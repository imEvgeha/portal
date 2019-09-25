import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { CustomInput, CustomLabel } from './CustomComponents';

const CharacterModal = ({selectedPerson, isModalOpen, toggleModal, handleAddCharacterName, parentId}) => {
    const [characterName, setCharacterName] = useState('');
    const toggle = () => {
        toggleModal();
    };

    useEffect(() => {
        setCharacterName(selectedPerson && selectedPerson.characterName ? selectedPerson.characterName : '');
    }, [selectedPerson]);

    const handleChange = (e) => {
        setCharacterName(e.target.value);
    };

    const handleSubmit = () => {
        const newObject = {
            ...selectedPerson,
            characterName: characterName
        };
        if(parentId) {            
            handleAddCharacterName(parentId, selectedPerson.id, newObject);
        } else {            
            handleAddCharacterName(selectedPerson.id, newObject);
        }
        toggle();
    };
    return (
        <Modal isOpen={isModalOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add Character Name</ModalHeader>
            <ModalBody>
            <CustomLabel htmlFor="displayName">Display Name</CustomLabel>
            <CustomInput
                placeholder="Display Name"
                name="displayName"
                disabled={true}
                value={selectedPerson && selectedPerson.displayName}
            />
            <CustomLabel htmlFor="characterName">Character Name</CustomLabel>
            <CustomInput
                onChange={value => handleChange(value)}
                placeholder="Character Name"
                name="characterName"
                value={characterName}
            />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>Add</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};


CharacterModal.propTypes = {
    handleAddCharacterName: PropTypes.func,
    isModalOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    selectedPerson: PropTypes.object,
    parentId: PropTypes.string
};

export default CharacterModal;