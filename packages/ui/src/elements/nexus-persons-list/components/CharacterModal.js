import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import TextField from '@atlaskit/textfield';
import './CharacterModal.scss';

const CharacterModal = ({closeModal, onModalSubmit, data, personId}) => {
    const {personName, characterName} = data;
    return (
        <div>
            <AKForm onSubmit={values => onModalSubmit(values, personId)}>
                {({formProps, reset}) => (
                    <form {...formProps}>
                        <Field name="personName" defaultValue={personName} label="Person Name" isDisabled>
                            {({fieldProps}) => <TextField {...fieldProps} />}
                        </Field>
                        <Field name="characterName" defaultValue={characterName} label="Character Name" isRequired>
                            {({fieldProps}) => <TextField {...fieldProps} />}
                        </Field>
                        <FormFooter>
                            <Button type="submit" appearance="primary">
                                Submit
                            </Button>
                            <Button
                                className="nexus-c-character-modal__cancel-button"
                                appearance="danger"
                                onClick={() => {
                                    reset();
                                    closeModal();
                                }}
                            >
                                Cancel
                            </Button>
                        </FormFooter>
                    </form>
                )}
            </AKForm>
        </div>
    );
};

CharacterModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    onModalSubmit: PropTypes.func.isRequired,
    data: PropTypes.object,
    personId: PropTypes.number.isRequired,
};

CharacterModal.defaultProps = {
    data: {},
};

export default CharacterModal;
