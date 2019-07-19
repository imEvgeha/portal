import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {CREW, getFilteredCrewList} from '../../../../../constants/metadata/configAPI';
import {AsyncSelect} from '@atlaskit/select';
import {searchPerson} from '../../../service/ConfigService';
import {ErrorMessage} from '@atlaskit/form';

class CoreMetadataCreateCrewModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isValidPersonSelected: true,
            selectedPerson: null,
            persons: [],
        };
    }

    UNSAFE_componentWillReceiveProps(){
        if(!this.props.isCrewModalOpen) {
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

    filterPerson = (inputValue, callback) => {
        searchPerson(inputValue, 20, CREW)
            .then(res => {
                this.setState({ persons: getFilteredCrewList(res.data.data, true) });
                callback(this.state.persons.map(e => {return {label: e.displayName + (e.personType.length > 0 ? ' \'' + e.personType + '\'' : ''), value: e.displayName, original: JSON.stringify(e)}; }));
            }).catch((err) => { console.error(err); });
    };


    loadOptions = (inputValue, callback) => {
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);
        this.keyInputTimeout = setTimeout(() => {
            this.filterPerson(inputValue, callback);
        }, 300);
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
                        <AsyncSelect
                            className="async-select-with-callback"
                            classNamePrefix="react-select"
                            defaultOptions
                            placeholder="Choose a Crew"
                            validationState={this.state.isValidPersonSelected ? 'default' : 'error'}
                            loadOptions={this.loadOptions}
                            options={this.state.persons}
                            onChange={(e) => this.updateSelectedPerson(e.original)}
                        />
                        {!this.state.isValidPersonSelected ? <ErrorMessage>Person is already exists</ErrorMessage> : null}
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={() => this.addValidCastCrew()}>
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

    configCastAndCrew: PropTypes.object,
    castCrewList: PropTypes.array,
};

export default CoreMetadataCreateCrewModal;
