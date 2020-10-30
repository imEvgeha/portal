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

const NexusCharacterNameModal = ({hint, defaultVal, isModalOpen, closeModal, onSubmit}) => {
    const [val, setVal] = useState(defaultVal || '');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setVal(defaultVal);
    }, [defaultVal]);

    const onCancel = () => {
        setVal(defaultVal);
        if (typeof closeModal === 'function') {
            closeModal();
        }
    };

    const handleChange = e => {
        const {value} = e.target;
        setVal(value);
    };

    const isEmpty = str => {
        return !str || str.trim().length === 0;
    };

    useEffect(() => {
        if (isEmpty(val)) {
            setError(EMPTY_CHARACTER_ERROR);
            setIsValid(false);
        } else if (val.trim().length >= MAX_CHARACTER_NAME_LENGTH) {
            setError(LONG_CHARACTER_ERROR);
            setIsValid(false);
        } else {
            setError(null);
            setIsValid(true);
        }
    }, [val]);

    const handleSubmit = () => {
        if (typeof onSubmit === 'function') {
            onSubmit(val);
        }
    };

    return (
        <Modal isOpen={isModalOpen} toggle={onCancel}>
            <ModalHeader toggle={onCancel}>{defaultVal ? EDIT_CHARACTER_NAME : ADD_CHARACTER_NAME}</ModalHeader>
            <ModalBody>
                <ModalCustomLabel htmlFor="displayName">Display Name</ModalCustomLabel>
                <ModalCustomInput isReadOnly={true} name="displayName" value={hint || ''} />
                <ModalCustomLabel isError={!isValid} htmlFor="characterName">
                    Character Name
                </ModalCustomLabel>
                <ModalCustomInput
                    isError={!isValid}
                    onChange={value => handleChange(value)}
                    placeholder="Character Name"
                    name="characterName"
                    value={val || ''}
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
    defaultVal: PropTypes.string,
    hint: PropTypes.string,
};

NexusCharacterNameModal.defaultProps = {
    defaultVal: '',
    hint: '',
};

export default NexusCharacterNameModal;
