import React from 'react';
import PropTypes from 'prop-types';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import TextField from '@atlaskit/textfield';
import {Button} from '@portal/portal-components';
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
                            <Button label="Submit" type="submit" className="p-button-outlined" />
                            <Button
                                label="Cancel"
                                className="p-button-outlined p-button-secondary nexus-c-character-modal__cancel-button"
                                onClick={e => {
                                    e.stopPropagation();
                                    reset();
                                    closeModal();
                                }}
                            />
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
