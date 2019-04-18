import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

const CAST = 'CAST';

class CoreMetadataCreateCastModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isValidPersonSelected: true,
      selectedPerson: {}
    };
  }

  addValidCastCrew = () => {
    if (this.props.castCrewList.findIndex( person => person.id === this.state.selectedPerson.id) < 0) {
      this.props.addCastCrew(this.state.selectedPerson);
      this.setState({
        isValidPersonSelected: true
      });
    } else {
      this.setState({
        isValidPersonSelected: false
      });
    }
  };

  updateSelectedPerson = (personJSON) => {
    let person = JSON.parse(personJSON);
    this.setState({
      selectedPerson: person
    });
  };

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
            <AvField type="select" name="castInputValue" id="createCasSelect" onChange={e => this.updateSelectedPerson(e.target.value)}>
              <option value={''}>Select a Cast</option>
              {
                this.props.configCastAndCrew && this.props.configCastAndCrew.value.map((e, index) => {
                  return <option key={index} value={JSON.stringify(e)}>{e.displayName}</option>;
                })
              }
            </AvField>
            {!this.state.isValidPersonSelected ? <span style={{color: 'red'}}>Person already exist</span> : null}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.addValidCastCrew()}>
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
  addCastCrew: PropTypes.func,
  castInputValue: PropTypes.string,

  configCastAndCrew: PropTypes.object,
  castCrewList: PropTypes.array
};

export default CoreMetadataCreateCastModal;
