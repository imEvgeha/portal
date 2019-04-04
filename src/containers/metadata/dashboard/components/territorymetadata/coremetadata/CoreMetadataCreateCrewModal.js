import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

const CREW = 'CREW';

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
            <AvField type="select" name="castInputValue" id="exampleSelect" onChange={e => this.props.updateCastValue(e.target.value)}>
              <option value={''}>Select a Crew</option>
              <option>Firsname Lastname1</option>
              <option>Firsname Lastname2</option>
              <option>Firsname Lastname3</option>
              <option>Firsname Lastname4</option>
              <option>Firsname Lastname5</option>
            </AvField>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.addCast('director')}>
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
  addCast: PropTypes.func,
  updateCastValue: PropTypes.func
};

export default CoreMetadataCreateCrewModal;
