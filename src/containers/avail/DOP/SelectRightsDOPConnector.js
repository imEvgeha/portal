import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
// import Button from '@atlaskit/button';

import DOP from '../../../util/DOP';
import {rightsService} from '../service/RightsService';
import {updatePromotedRights, updatePromotedRightsFullData} from '../../../stores/actions/DOP';


class SelectRightsDOPConnector extends Component {
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
        this.onModalCancel = this.onModalCancel.bind(this);
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
                if(response.data.territory && Array.isArray(response.data.territory)){
                    let availableTerritories = response.data.territory.filter(({selected}) => !selected);
                    let toChangeTerritories = availableTerritories.filter(({country}) => right.territories.includes(country));
                    if(toChangeTerritories.length > 0){
                        let toChangeTerritoriesCountry = toChangeTerritories.map(({country}) => country);
                        let newTerritories = response.data.territory.
                        map(territory => {return {...territory, selected: territory.selected || toChangeTerritoriesCountry.includes(territory.country)};});
                        // newTerritories = response.data.territory.map(territory => {return {...territory, selected: false}});
                        return rightsService.update({territory: newTerritories}, right.rightId).then(() => {
                            return {rightId: right.rightId, territories: toChangeTerritoriesCountry};
                        }).catch((e) => {
                            console.error('Unexpected error');
                            console.error(e);
                        });
                    }
                }
                return null;
            });
        })).then(result => {
            let newDopInfo = result.filter(a => a);
            this.setState({isSendingData : false, isConfirmOpen : false});
            updatePromotedRights([]);
            updatePromotedRightsFullData([]);
            DOP.sendInfoToDOP(newDopInfo.length > 0 ? 0 : 1, {selectedRights : newDopInfo});
        }).catch((e) => {
            console.error('Unexpected error');
            console.error(e);
        });
    }

    onModalCancel(){
        this.setState({isConfirmOpen : false});
        DOP.sendInfoToDOP(1, null);
    }

    render(){
        const { isConfirmOpen, isSendingData } = this.state;
        const { promotedRights } = this.props;
        const actions = [
            { text: 'Cancel', onClick: this.onModalCancel, appearance:'default', isDisabled: isSendingData},
            { text: 'Apply', onClick: this.onModalApply, appearance:'primary', isLoading: isSendingData},
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

const mapStateToProps = state => {
    return {
        promotedRights: state.dopReducer.session.promotedRights
    };
};

const mapDispatchToProps = (dispatch) => ({
    updatePromotedRights: payload => dispatch(updatePromotedRights(payload)),
    updatePromotedRightsFullData: payload => dispatch(updatePromotedRightsFullData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsDOPConnector);