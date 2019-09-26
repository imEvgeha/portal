import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { CustomInput, CustomLabel } from './CustomComponents';

const CharacterModal = ({selectedPerson, isModalOpen, toggleModal, handleAddCharacterName, parentId, modalType, data}) => {
    const [characterName, setCharacterName] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [error, setError] = useState(null);
    const toggle = () => {
        toggleModal();
        setCharacterName(selectedPerson && selectedPerson.characterName ? selectedPerson.characterName : '');
        setIsInvalid(false);
    };

    useEffect(() => {
        setCharacterName(selectedPerson && selectedPerson.characterName ? selectedPerson.characterName : '');
    }, [selectedPerson]);

    const handleChange = (e) => {
        const { value } = e.target;
        setCharacterName(value);
    };

    const handleSubmit = () => {
        if(characterName) {
            if(characterName.length > 0 && characterName.length <= 100) {
                const newObject = {
                    ...selectedPerson,
                    characterName: characterName
                };
                if(parentId) {        
                    handleAddCharacterName(data, parentId, selectedPerson.id, newObject);
                } else {            
                    handleAddCharacterName(selectedPerson.id, newObject);
                }
                toggle();
                setIsInvalid(false);
            } else {
                setIsInvalid(true);
                setError('Character name must be less than 100 characters long!');
            }
        } else {
            setIsInvalid(true);
            setError('Character name cannot be empty!');
        }
    };
    return (
        <Modal isOpen={isModalOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{modalType} Character Name</ModalHeader>
            <ModalBody>
            <CustomLabel htmlFor="displayName">Display Name</CustomLabel>
            <CustomInput
                placeholder="Display Name"
                name="displayName"
                disabled={true}
                value={selectedPerson && selectedPerson.displayName}
            />
            <CustomLabel isError={isInvalid} htmlFor="characterName">Character Name</CustomLabel>
            <CustomInput            
                isError={isInvalid}
                onChange={value => handleChange(value)}
                placeholder="Character Name"
                name="characterName"
                value={characterName}
            />
            {isInvalid && (                
                <CustomLabel isError={isInvalid} style={{fontSize: '14px'}} htmlFor="characterName">{error}</CustomLabel>
            )}
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
    parentId: PropTypes.string,
    modalType: PropTypes.string,
    data: PropTypes.object
};

export default CharacterModal;