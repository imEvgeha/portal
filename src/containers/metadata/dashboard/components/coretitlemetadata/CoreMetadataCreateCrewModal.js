import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import { CREW, getFilteredCrewList } from '../../../../../constants/metadata/configAPI';

class CoreMetadataCreateCrewModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isValidPersonSelected: true,
            selectedPerson: null
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
                        <AvField type="select" name="castInputValue" id="exampleSelect"
                            onChange={e => this.updateSelectedPerson(e.target.value)}>
                            <option value={''}>Select a Crew</option>
                            {
                                this.props.configCastAndCrew && getFilteredCrewList(this.props.configCastAndCrew.value, true).map((e, index) => {
                                    return <option key={index}
                                        value={JSON.stringify(e)}>{e.displayName + (e.personType.length > 0 ? ' \'' + e.personType + '\'' : '')}</option>;
                                })
                            }
                        </AvField>
                        {!this.state.isValidPersonSelected ?
                            <span style={{ color: 'red' }}>Person already exist</span> : null}
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
