import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {
    CustomInput,
    CustomLabel
} from '../../../../pages/legacy/containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';

const NexusCharacterNameModal = ({
     hint,
     defaultVal,
     isModalOpen,
     closeModal,
     onSubmit,
})=> {

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

    const handleChange = (e) => {
        const { value } = e.target;
        setVal(value);
    };

    const isEmpty = (str) => {
        return (!str || str.trim().length === 0);
    };

    useEffect(() => {
        if(isEmpty(val)){
            setError('Character name cannot be empty!');
            setIsValid(false);
        }else{
            if(val.trim().length < 100){
                setError(null);
                setIsValid(true);
            }else{
                setError('Character name must be less than 100 characters long!');
                setIsValid(false);
            }
        }
    }, [val]);

    const handleSubmit = () => {
        if (typeof onSubmit === 'function') {
            onSubmit(val);
        }
    };

    return (
        <Modal isOpen={isModalOpen} toggle={onCancel}>
            <ModalHeader toggle={onCancel}>{defaultVal ? 'Edit' : 'Add'} Character Name</ModalHeader>
            <ModalBody>
                <CustomLabel htmlFor="displayName">Display Name</CustomLabel>
                <CustomInput
                    readOnly
                    name="displayName"
                    disabled={true}
                    value={hint || ''}
                />
                <CustomLabel isError={!isValid} htmlFor="characterName">Character Name</CustomLabel>
                <CustomInput
                    isError={!isValid}
                    onChange={value => handleChange(value)}
                    placeholder="Character Name"
                    name="characterName"
                    value={val || ''}
                />
                {!isValid &&  ( <ErrorMessage>{error}</ErrorMessage>)}
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
    hint: PropTypes.string
};

export default NexusCharacterNameModal;
