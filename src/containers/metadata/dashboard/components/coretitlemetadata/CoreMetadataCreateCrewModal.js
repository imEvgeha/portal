import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {AvField} from 'availity-reactstrap-validation';

const CREW = 'CREW';

class CoreMetadataCreateCrewModal extends Component {

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
    castCrewList: PropTypes.array
};

export default CoreMetadataCreateCrewModal;
