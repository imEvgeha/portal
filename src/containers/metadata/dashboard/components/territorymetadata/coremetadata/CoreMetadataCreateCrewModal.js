import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

class CoreMetadataCreateCrewModal extends Component {
  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.props.isCrewModalOpen}
          toggle={() => this.props.renderCrewModal('crew')}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={() => this.props.renderCrewModal('crew')}>
            Create Crew
          </ModalHeader>
          <ModalBody>
            <AvField name='crew' type='text' placeholder='Enter Crew' />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.renderCrewModal('crew')}>
              Save
            </Button>{' '}
            <Button color='secondary' onClick={() => this.props.renderCrewModal('crew')}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

CoreMetadataCreateCrewModal.propTypes = {
  className: PropTypes.string,
  renderCrewModal: PropTypes.func,
  isCrewModalOpen: PropTypes.bool
};

export default CoreMetadataCreateCrewModal;
