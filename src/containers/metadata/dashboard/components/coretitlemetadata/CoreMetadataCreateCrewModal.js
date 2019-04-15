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
            <AvField type="select" name="castInputValue" id="exampleSelect" onChange={e => this.props.updateCastCrewValue(e.target.value)}>
              <option value={''}>Select a Crew</option>
              {
                this.props.configCastAndCrew && this.props.configCastAndCrew.value.map((e, index) => {
                 return <option key={index} value={e.displayName}>{e.displayName}</option>;
                })
              }
            </AvField>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.addCastCrew('director')}>
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
  addCastCrew: PropTypes.func,
  updateCastCrewValue: PropTypes.func,

  configCastAndCrew: PropTypes.object
};

export default CoreMetadataCreateCrewModal;
