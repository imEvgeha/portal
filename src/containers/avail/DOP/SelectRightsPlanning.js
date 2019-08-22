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
import DOP from '../../../util/DOP';


import Button from '@atlaskit/button'; //TO BE DELETED

// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    static propTypes =  {
        availsMapping: PropTypes.object,
        reports: PropTypes.array,
        fetchAvailMapping: PropTypes.func.isRequired,
        fetchAvailConfiguration: PropTypes.func.isRequired,
    };

    static defaultProps = {
        availsMapping: null,
        reports: null,
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
        const {availsMapping, reports, fetchAvailMapping, fetchAvailConfiguration} = this.props;
        if (!availsMapping) {
            fetchAvailMapping();
        }
        if (!reports) {
            fetchAvailConfiguration();
        }

        DOP.setDOPMessageCallback(this.showConfirmDialog);
    }

    showConfirmDialog(){
        this.setState({isConfirmOpen : true});
    }

    onModalApply(){
        this.setState({isSendingData : true});
        // send flag changes to server
        // DOP.sendInfoToDOP();
        // this.setState({isConfirmOpen : false});
    }

    render() {
        const {availsMapping} = this.props;
        const { isConfirmOpen } = this.state;

        const RightsResultsTable = compose(
            withSelectRightHeader,
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withFilteredRights({status:'Ready,ReadyNew', invalid:'false'}),
        )(ResultsTable);

        const actions = [
            { text: 'Cancel', onClick: () =>   this.setState({isConfirmOpen : false}), appearance:'default', isDisabled:this.state.isSendingData},
            { text: 'Apply', onClick: this.onModalApply, appearance:'primary', isLoading:this.state.isSendingData},
        ];

        return (
            <div>
                <Button onClick={DOP.mockOnDOPMessage}>CLICK</Button>
                {availsMapping && (
                    <RightsResultsTable
                        availsMapping={availsMapping}
                        mode={'selectRightsMode'}/>
                )}
                <ModalTransition>
                    {isConfirmOpen && (
                        <Modal actions={actions} onClose={this.close} heading="Selected Rights">
                            You are about to move X avail rights to the selected folder.
                            This will enable you to schedule them in plans.
                        </Modal>
                    )}
                </ModalTransition>
            </div>
        );
    }
}

const mapStateToProps = ({root}) => ({
    availsMapping: root.availsMapping,
    reports: root.reports,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);
