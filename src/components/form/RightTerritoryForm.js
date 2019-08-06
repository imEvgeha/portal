import React from 'react';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import PropTypes from 'prop-types';

class RightTerritoryForm extends React.Component {
    render() {
        return (
            <ModalTransition>
                {this.props.isOpen && (
                    <Modal
                        heading="Territory Data"
                        onClose={this.props.onClose}
                    >
                        Hello
                    </Modal>
                )}
            </ModalTransition>
        );
    }
}

RightTerritoryForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool
};

export default RightTerritoryForm;