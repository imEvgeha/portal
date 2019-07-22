import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  CAST,
  getFilteredCastList,
  PERSONS_PER_REQUEST,
  PERSON_INPUT_TIMEOUT
} from '../../../../../constants/metadata/configAPI';
import { AsyncSelect } from '@atlaskit/select';
import { searchPerson } from '../../../service/ConfigService';
import { ErrorMessage } from '@atlaskit/form';
import UserPicker from '@atlaskit/user-picker';

class CoreMetadataCreateCastModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isValidPersonSelected: true,
      selectedPerson: null,
      persons: [],
      searchText: '',
      disableInput: false
    };
    this.keyInputTimeout = 0;
  }

  UNSAFE_componentWillReceiveProps() {
    if (!this.props.isCastModalOpen) {
      this.setState({
        isValidPersonSelected: true
      });
    }
  }

  addValidCastCrew = () => {
    if (this.state.selectedPerson) {
      let isValid = this.isSelectedPersonValid(this.state.selectedPerson);
      if (isValid) {
        this.props.addCastCrew(this.state.selectedPerson);
      }
      this.setState({
        isValidPersonSelected: isValid
      });
    } else {
      this.setState({
        isValidPersonSelected: true
      });
    }
  };

  isSelectedPersonValid = (selectedPerson) => {
    return this.props.castCrewList === null || this.props.castCrewList.findIndex(person =>
      person.id === selectedPerson.id && person.personType === selectedPerson.personType) < 0;
  };

  updateSelectedPerson = (personJSON) => {
    let person = null;
    if (personJSON) {
      person = JSON.parse(personJSON);
      let isValid = this.isSelectedPersonValid(person);
      this.setState({
        isValidPersonSelected: isValid
      });
    } else {
      this.setState({
        isValidPersonSelected: true
      });
    }

    this.setState({
      selectedPerson: person
    });
  };

  filterPerson = (inputValue, callback) => {
    searchPerson(inputValue, PERSONS_PER_REQUEST, CAST)
      .then(res => {
        this.setState({ persons: getFilteredCastList(res.data.data, true) });
        callback(this.state.persons.map(e => {return {label: e.displayName, value: e.displayName, original: JSON.stringify(e)}; }));
      }).catch((err) => { console.error(err); });
  };

  loadOptions = (inputValue, callback) => {
    if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);
    this.keyInputTimeout = setTimeout(() => {
      this.filterPerson(inputValue, callback);
    }, PERSON_INPUT_TIMEOUT);
  };

  onInputChange = (e) => {
    console.log(e);
  }
  handleClear = (b, e) => {
    console.log(b, e)
  }

  handleOnBlur = () => {
    this.setState({
      disableInput: true
    });
  }
  handleOnChange = e => {
    console.log(e)
  }
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
            <AsyncSelect
              className="async-select-with-callback"
              classNamePrefix="react-select"
              defaultOptions
              placeholder="Choose a Cast"
              validationState={this.state.isValidPersonSelected ? 'default' : 'error'}
              loadOptions={this.loadOptions}
              options={this.state.persons}
              onChange={(e) => this.updateSelectedPerson(e.original)}
            />
            <UserPicker
              fieldId="example"
              onClear={this.handleClear}
              disableInput={this.state.disableInput}
              onBlur={this.handleOnBlur}
              options={this.state.persons.map(e => { return { id: e.displyName, name: e.displayName };})}
              onInputChange={this.handleOnChange} 
            />
            {!this.state.isValidPersonSelected ? <ErrorMessage>Person is already exists</ErrorMessage> : null}
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

  castCrewList: PropTypes.array,
};

export default CoreMetadataCreateCastModal;
