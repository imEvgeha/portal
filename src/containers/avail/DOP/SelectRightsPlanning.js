import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import withRedux from '../../../components/avails/SaveStateTable';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import ResultsTable from '../../../components/common/ResultsTable';
import withFilteredRights from '../../../components/DOP/withFilteredRights';
import withSelectIgnoreMark from '../../../components/DOP/SelectIgnoreMarkTable';
import {fetchAvailMapping, fetchAvailConfiguration} from '../availActions';
import withSelectRightHeader from '../../../components/DOP/SelectRightsTableHeader';


// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    static propTypes =  {
        availsMapping: PropTypes.object,
        fetchAvailMapping: PropTypes.func.isRequired,
        fetchAvailConfiguration: PropTypes.func.isRequired,
    };

    static defaultProps = {
        availsMapping: null
    };

    componentDidMount() {
        const {availsMapping, fetchAvailMapping, fetchAvailConfiguration} = this.props;
        if (!availsMapping) {
            fetchAvailMapping();
        }
        fetchAvailConfiguration();
    }

    render() {
        const {availsMapping} = this.props;

        const RightsResultsTable = compose(
            withSelectRightHeader,
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withFilteredRights({status:'Ready,ReadyNew', invalid:'true'}),
        )(ResultsTable);

        return (
            <div>
                <DOPConnector/>
                {availsMapping && (
                    <RightsResultsTable
                        availsMapping={availsMapping}
                        mode={'selectRightsMode'}
                        disableEdit={true}
                    />
                )}
            </div>
        );
    }
}

let mapStateToProps = ({root}) => ({
    availsMapping: root.availsMapping
});

let mapDispatchToProps = (dispatch) => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);


//--------------------------------------
// import Button from '@atlaskit/button';
import DOP from '../../../util/DOP';
import {rightsService} from '../service/RightsService';
import {updatePromotedRights} from '../../../stores/actions/DOP';

mapStateToProps = state => {
    return {
        promotedRights: state.dopReducer.session.promotedRights
    };
};

mapDispatchToProps = (dispatch) => ({
    updatePromotedRights: payload => dispatch(updatePromotedRights(payload)),
});

class DOPConnectorInternal extends Component {
    static propTypes = {
        promotedRights: PropTypes.array,
        updatePromotedRights: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isConfirmOpen: false,
            isSendingData: false
        };

        this.showConfirmDialog = this.showConfirmDialog.bind(this);
        this.onModalApply = this.onModalApply.bind(this);
    }

    componentDidMount() {
        DOP.setDOPMessageCallback(this.showConfirmDialog);
    }

    showConfirmDialog(){
        const { promotedRights } = this.props;
        if(promotedRights.length > 0){
            this.setState({isConfirmOpen : true});
        }
    }

    onModalApply(){
        this.setState({isSendingData : true});
        const { promotedRights, updatePromotedRights } = this.props;
        // send flag changes to server
        Promise.all(promotedRights.map(right => {
            return rightsService.get(right.rightId).then(response => {
                if(response.data.territory){
                    let availableTerritories = response.data.territory.filter(({selected}) => !selected);
                    let toChangeTerritories = availableTerritories.filter(({country}) => right.territories.includes(country));
                    if(toChangeTerritories.length > 0){
                        let toChangeTerritoriesCountry = toChangeTerritories.map(({country}) => country);
                        let newTerritories = response.data.territory.map(territory => {return {...territory, selected: territory.selected || toChangeTerritoriesCountry.includes(territory.country)};});
                        // newTerritories = response.data.territory.map(territory => {return {...territory, selected: false}});
                        return rightsService.update({territory: newTerritories}, right.rightId).then(() => {
                            return {rightId: right.rightId, territories: toChangeTerritoriesCountry};
                        });
                    }
                }
                return null;
            });
        })).then(result => {
            let newDopInfo = result.filter(a => a);
            this.setState({isSendingData : false, isConfirmOpen : false});
            updatePromotedRights([]);
            DOP.sendInfoToDOP(newDopInfo.length > 0 ? 0 : 1, {selectedRights : newDopInfo});
        });
    }

    render(){
        const { isConfirmOpen } = this.state;
        const { promotedRights } = this.props;
        const actions = [
            { text: 'Cancel', onClick: () =>   this.setState({isConfirmOpen : false}), appearance:'default', isDisabled:this.state.isSendingData},
            { text: 'Apply', onClick: this.onModalApply, appearance:'primary', isLoading:this.state.isSendingData},
        ];

        return(
            <div>
                {/*<Button onClick={DOP.mockOnDOPMessage}>DOP Trigger</Button>*/}
                <ModalTransition>
                    {isConfirmOpen && (
                        <Modal actions={actions} onClose={this.close} heading="Selected Rights">
                            You are about to move {promotedRights.length} avail right{promotedRights.length > 1 && 's'} to the selected folder.
                            This will enable you to schedule {promotedRights.length > 1 ? 'them' : 'it'} in plans.
                        </Modal>
                    )}
                </ModalTransition>
            </div>
        );
    }
}
let DOPConnector = connect(mapStateToProps, mapDispatchToProps)(DOPConnectorInternal);

//--------------------------------------
