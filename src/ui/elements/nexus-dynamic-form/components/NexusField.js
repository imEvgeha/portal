import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import NexusTextArea from '../../nexus-textarea/NexusTextArea';
import {checkFieldDependencies, getValidationFunction, renderLabel, renderError} from '../utils';
import {VIEWS} from '../constants';
import './NexusField.scss';

const NexusField = ({
    type,
    view,
    tooltip,
    formData,
    isReadOnly,
    isRequired,
    dependencies,
    validationError,
    validation,
    label,
    ...props
}) => {
    const checkDependencies = type => {
        return checkFieldDependencies(type, view, dependencies, formData);
    };

    const renderFieldEditMode = fieldProps => {
        switch (type) {
            case 'string':
            case 'stringInArray':
                return <TextField {...fieldProps} placeholder={`Enter ${label}`} />;
            case 'textarea':
                return <NexusTextArea {...fieldProps} placeholder={`Enter ${label}`} />;
            case 'number':
                return <TextField {...fieldProps} type="Number" placeholder={`Enter ${label}`} />;
            case 'boolean':
                return (
                    <CheckboxField
                        isDisabled={isReadOnly || checkDependencies('readOnly')}
                        name={fieldProps.name}
                        label={fieldProps.label}
                        defaultIsChecked={fieldProps.value}
                    >
                        {({fieldProps}) => <Checkbox {...fieldProps} />}
                    </CheckboxField>
                );
            default:
                return;
        }
    };

    const renderFieldViewMode = (type, fieldProps, validationError) => {
        if (validationError) {
            return <div>{validationError}</div>;
        }
        switch (type) {
            case 'datetime':
                return <DateTimePicker {...fieldProps} />;
            case 'boolean':
                return <Checkbox isDisabled defaultChecked={fieldProps.value} />;
            default:
                return fieldProps.value ? (
                    <div>{fieldProps.value}</div>
                ) : (
                    <div className="nexus-c-field__placeholder">{`Enter ${label}`}</div>
                );
        }
    };

    return (
        <div className={`nexus-c-field ${validationError ? 'nexus-c-field--error' : ''}`}>
            <AKField
                isDisabled={isReadOnly || checkDependencies('readOnly')}
                isRequired={checkDependencies('required') || isRequired}
                validate={value => getValidationFunction(value, validation)}
                {...props}
            >
                {({fieldProps, error}) => (
                    <>
                        {renderLabel(label, !!(checkDependencies('required') || isRequired), tooltip)}
                        <div className="nexus-c-field__value-section">
                            <div className="nexus-c-field__value">
                                {view === VIEWS.EDIT || view === VIEWS.CREATE
                                    ? renderFieldEditMode(fieldProps)
                                    : renderFieldViewMode(type, fieldProps, validationError)}
                            </div>
                            {renderError(error)}
                        </div>
                    </>
                )}
            </AKField>
        </div>
    );
};

NexusField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    tooltip: PropTypes.string,
    formData: PropTypes.object,
    dependencies: PropTypes.array,
    isReadOnly: PropTypes.bool,
    isRequired: PropTypes.bool,
    validationError: PropTypes.string,
    validation: PropTypes.array,
    label: PropTypes.string,
};

NexusField.defaultProps = {
    view: VIEWS.VIEW,
    tooltip: null,
    formData: {},
    dependencies: [],
    isReadOnly: false,
    isRequired: false,
    validationError: null,
    validation: [],
    label: '',
};

export default NexusField;
