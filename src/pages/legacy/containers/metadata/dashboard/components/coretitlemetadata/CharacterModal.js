import React, {useState, useEffect} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import PropTypes from 'prop-types';
import {CustomInput, CustomLabel} from './CustomComponents';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button';

const CharacterModal = ({
    selectedPerson,
    isModalOpen,
    toggleModal,
    handleAddCharacterName,
    parentId,
    modalType,
    data,
    selectedId,
}) => {
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

    const handleChange = e => {
        const {value} = e.target;
        setCharacterName(value);
    };

    const isEmpty = incorrectValue => {
        return !name || name.length === 0 || name.trim().length === 0;
    };

    const handleSubmit = () => {
        if (characterName) {
            if (characterName.length > 0 && characterName.length <= 100) {
                const newObject = {
                    ...selectedPerson,
                    characterName: characterName,
                };
                if (parentId) {
                    handleAddCharacterName(data, parentId, selectedId, newObject);
                } else {
                    handleAddCharacterName(selectedId, newObject);
                }
                toggle();
                setIsInvalid(false);
            } else {
                setIsInvalid(true);
                setError('Character incorrectValue must be less than 100 characters long!');
            }
        } else {
            setIsInvalid(true);
            setError('Character incorrectValue cannot be empty!');
        }
    };
    return (
        <Modal isOpen={isModalOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{modalType} Character Name</ModalHeader>
            <ModalBody>
                <CustomLabel htmlFor="displayName">Display Name</CustomLabel>
                <CustomInput
                    readOnly
                    placeholder="Display Name"
                    name="displayName"
                    disabled={true}
                    value={selectedPerson && selectedPerson.displayName}
                />
                <CustomLabel isError={isInvalid} htmlFor="characterName">
                    Character Name
                </CustomLabel>
                <CustomInput
                    isError={isInvalid}
                    onChange={value => handleChange(value)}
                    placeholder="Character Name"
                    name="characterName"
                    value={characterName}
                />
                {isInvalid && <ErrorMessage>{error}</ErrorMessage>}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSubmit} appearance="primary" isDisabled={isEmpty(characterName)}>
                    OK
                </Button>
                <Button onClick={toggle} appearance="danger">
                    Cancel
                </Button>
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
    data: PropTypes.object,
    selectedId: PropTypes.number,
};

export default CharacterModal;
