import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

class CoreMetadataCreateCastModal extends Component {
  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.props.isCastModalOpen}
          toggle={() => this.props.renderCastModal('cast')}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={() => this.props.renderCastModal('cast')}>
            Create Cast
          </ModalHeader>
          <ModalBody>
            <AvField name='cast' type='text' placeholder='Enter Cast' />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.renderCastModal('cast')}>
              Save
            </Button>{' '}
            <Button color='secondary' onClick={() => this.props.renderCastModal('cast')}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

CoreMetadataCreateCastModal.propTypes = {
  className: PropTypes.string,
  renderCastModal: PropTypes.func,
  isCastModalOpen: PropTypes.bool
};

export default CoreMetadataCreateCastModal;
