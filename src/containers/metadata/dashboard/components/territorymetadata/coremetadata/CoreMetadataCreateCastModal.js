import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

const CAST = CAST;

class CoreMetadataCreateCastModal extends Component {
  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.props.isCastModalOpen}
          toggle={() => this.props.renderCastModal(CAST)}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={() => this.props.renderCastModal(CAST)}>
            Create Cast
          </ModalHeader>
          <ModalBody>
            <AvField name='castInputValue' type='text' value={this.props.castInputValue} onChange={e => this.props.updateCastValue(e.target.value)} placeholder='Enter Cast' />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.addCast()}>
              Save
            </Button>{' '}
            <Button color='secondary' onClick={() => this.props.renderCastModal(CAST)}>
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
  isCastModalOpen: PropTypes.bool,
  updateCastValue: PropTypes.func,
  addCast: PropTypes.func,
  castInputValue: PropTypes.string
};

export default CoreMetadataCreateCastModal;
