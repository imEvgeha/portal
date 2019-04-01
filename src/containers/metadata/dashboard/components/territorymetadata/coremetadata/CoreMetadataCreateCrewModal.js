import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

const CREW = CREW;

class CoreMetadataCreateCrewModal extends Component {
  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.props.isCrewModalOpen}
          toggle={() => this.props.renderCrewModal(CREW)}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={() => this.props.renderCrewModal(CREW)}>
            Create Crew
          </ModalHeader>
          <ModalBody>
            <AvField name='crewInputValue' type='text' value={this.props.crewInputValue} onChange={e => this.props.updateCrewValue(e.target.value)} placeholder='Enter Crew' />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.addCrew()}>
              Save
            </Button>{' '}
            <Button color='secondary' onClick={() => this.props.renderCrewModal(CREW)}>
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
  isCrewModalOpen: PropTypes.bool,
  addCrew: PropTypes.func,
  updateCrewValue: PropTypes.func,
  crewInputValue: PropTypes.string
};

export default CoreMetadataCreateCrewModal;
