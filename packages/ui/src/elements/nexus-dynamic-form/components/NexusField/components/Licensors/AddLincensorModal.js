import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Field, FormFooter} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

const AddLicensorModal = ({licensorOptions, handleAddLicensor, closeModal}) => {
    return (
        <AKForm onSubmit={values => handleAddLicensor(values)}>
            {({formProps, reset}) => (
                <form {...formProps}>
                    <Field name="licensor" label="Licensor" isRequired>
                        {({fieldProps}) => (
                            <Select
                                options={licensorOptions}
                                {...fieldProps}
                                className="nexus-c-modal__select-container"
                                classNamePrefix="nexus-c-modal__select"
                            />
                        )}
                    </Field>
                    <Field name="licensorTitleId" label="Licensor Title ID" isRequired>
                        {({fieldProps}) => <TextField {...fieldProps} />}
                    </Field>
                    <FormFooter>
                        <Button type="submit" appearance="primary">
                            Submit
                        </Button>

                        <Button
                            className="nexus-c-modal__cancel-button"
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
    );
};

AddLicensorModal.propTypes = {
    licensorOptions: PropTypes.array,
    handleAddLicensor: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
};

AddLicensorModal.defaultProps = {
    licensorOptions: {},
};

export default AddLicensorModal;
