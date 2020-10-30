import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {ErrorMessage} from '@atlaskit/form';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import ModalCustomInput from './ModalCustomInput';
import ModalCustomLabel from './ModalCustomLabel';
import {
    ADD_CHARACTER_NAME,
    EDIT_CHARACTER_NAME,
    EMPTY_CHARACTER_ERROR,
    LONG_CHARACTER_ERROR,
    MAX_CHARACTER_NAME_LENGTH,
} from '../constants';

const NexusCharacterNameModal = ({displayName, characterName, value, onChange, isModalOpen, closeModal, onSubmit}) => {
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState(null);

    const onCancel = () => {
        if (typeof closeModal === 'function') {
            closeModal();
        }
    };

    const isEmpty = str => {
        return !str || str.trim().length === 0;
    };

    useEffect(() => {
        if (isEmpty(value)) {
            setError(EMPTY_CHARACTER_ERROR);
            setIsValid(false);
        } else if (value.trim().length >= MAX_CHARACTER_NAME_LENGTH) {
            setError(LONG_CHARACTER_ERROR);
            setIsValid(false);
        } else {
            setError(null);
            setIsValid(true);
        }
    }, [value]);

    const handleSubmit = () => {
        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    };

    return (
        <Modal isOpen={isModalOpen} toggle={onCancel}>
            <ModalHeader toggle={onCancel}>{characterName ? EDIT_CHARACTER_NAME : ADD_CHARACTER_NAME}</ModalHeader>
            <ModalBody>
                <ModalCustomLabel htmlFor="displayName">Display Name</ModalCustomLabel>
                <ModalCustomInput isReadOnly={true} name="displayName" value={displayName || ''} />
                <ModalCustomLabel isError={!isValid} htmlFor="characterName">
                    Character Name
                </ModalCustomLabel>
                <ModalCustomInput
                    isError={!isValid}
                    onChange={value => onChange(value)}
                    placeholder="Character Name"
                    name="characterName"
                    value={value || ''}
                />
                {!isValid && <ErrorMessage>{error}</ErrorMessage>}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSubmit} appearance="primary" isDisabled={!isValid}>
                    OK
                </Button>
                <Button onClick={onCancel} appearance="danger">
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

NexusCharacterNameModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    characterName: PropTypes.string,
    displayName: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

NexusCharacterNameModal.defaultProps = {
    characterName: '',
    displayName: '',
    value: '',
    onChange: () => null,
};

export default NexusCharacterNameModal;
