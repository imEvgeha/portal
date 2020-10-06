import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Field as AKField, ErrorMessage, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import ErrorBoundary from '../../../../../pages/fallback/ErrorBoundary';
import NexusTextArea from '../../../nexus-textarea/NexusTextArea';
import {VIEWS} from '../../constants';
import {checkFieldDependencies, getValidationFunction} from '../../utils';
import DateTime from './components/DateTime/DateTime';
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
    dateType,
    labels,
    ...props
}) => {
    const checkDependencies = type => {
        return checkFieldDependencies(type, view, dependencies, formData);
    };

    const dateProps = {
        labels,
        type,
        dateType,
        isReadOnly,
    };

    const renderFieldEditMode = fieldProps => {
        switch (type) {
            case 'string':
                return <TextField {...fieldProps} placeholder={`Enter ${fieldProps.name}`} />;
            case 'textarea':
                return <NexusTextArea {...fieldProps} placeholder={`Enter ${fieldProps.name}`} />;
            case 'number':
                return <TextField {...fieldProps} type="Number" placeholder={`Enter ${fieldProps.name}`} />;
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
            case 'dateRange':
            case 'datetime':
                return <DateTime {...dateProps} {...fieldProps} />;
            default:
                return;
        }
    };

    const renderFieldViewMode = fieldProps => {
        if (validationError) {
            return <div>{validationError}</div>;
        }
        switch (type) {
            case 'boolean':
                return <Checkbox isDisabled defaultChecked={fieldProps.value} />;
            case 'dateRange':
            case 'datetime':
                return <DateTime {...dateProps} {...fieldProps} isReadOnly />;
            default:
                return fieldProps.value ? (
                    <div>{fieldProps.value}</div>
                ) : (
                    <div className="nexus-c-field__placeholder">{`Enter ${fieldProps.name}`}</div>
                );
        }
    };

    return (
        <ErrorBoundary>
            <div className={`nexus-c-field ${validationError ? 'nexus-c-field--error' : ''}`}>
                <AKField
                    isDisabled={isReadOnly || checkDependencies('readOnly')}
                    isRequired={checkDependencies('required') || isRequired}
                    validate={value => getValidationFunction(value, validation)}
                    {...props}
                >
                    {({fieldProps, error}) => (
                        <>
                            <div className="nexus-c-field__label">
                                {`${fieldProps.name}${checkDependencies('required') || isRequired ? '*' : ''}: `}
                                {tooltip && (
                                    <span title={tooltip} style={{color: 'grey'}}>
                                        <i className="far fa-question-circle" />
                                    </span>
                                )}
                            </div>
                            <div className="nexus-c-field__value-section">
                                <div className="nexus-c-field__value">
                                    {view === VIEWS.EDIT || view === VIEWS.CREATE
                                        ? renderFieldEditMode(fieldProps)
                                        : renderFieldViewMode(fieldProps)}
                                </div>
                                <div className="nexus-c-field__error">
                                    {error && <ErrorMessage>{error}</ErrorMessage>}
                                </div>
                            </div>
                        </>
                    )}
                </AKField>
            </div>
        </ErrorBoundary>
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
    dateType: PropTypes.string,
    labels: PropTypes.array,
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
    dateType: '',
    labels: [],
};

export default NexusField;
