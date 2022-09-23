import React, {Component} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';

import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';

class ManualRightsEntryDOPConnector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmOpen: false,
            isSendingData: false,
        };

        this.showConfirmDialog = this.showConfirmDialog.bind(this);
        this.onModalApply = this.onModalApply.bind(this);
        this.onModalCancel = this.onModalCancel.bind(this);
    }

    componentDidMount() {
        DOP.setDOPMessageCallback(this.showConfirmDialog);
    }

    showConfirmDialog() {
        this.setState({isConfirmOpen: true});
    }

    onModalApply() {
        this.setState({isSendingData: true});
        DOP.sendInfoToDOP(0, null);
    }

    onModalCancel() {
        this.setState({isConfirmOpen: false});
        DOP.sendInfoToDOP(1, null);
    }

    render() {
        const {isConfirmOpen, isSendingData} = this.state;
        const actions = [
            {text: 'Cancel', onClick: this.onModalCancel, appearance: 'default', isDisabled: isSendingData},
            {text: 'Apply', onClick: this.onModalApply, appearance: 'primary', isLoading: isSendingData},
        ];

        return (
            <div>
                <ModalTransition>
                    {isConfirmOpen && (
                        <Modal actions={actions} onClose={this.close} heading="Selected Rights">
                            Are you sure there are no more rights to create or fix?
                        </Modal>
                    )}
                </ModalTransition>
            </div>
        );
    }
}

export default ManualRightsEntryDOPConnector;
