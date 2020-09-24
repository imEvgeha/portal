import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import {get} from 'lodash';
import NexusTextArea from '../../nexus-textarea/NexusTextArea';
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
    ...props
}) => {
    const checkDependencies = type => {
        // View mode has the same dependencies as Edit mode
        const currentView = view === VIEWS.CREATE ? VIEWS.CREATE : VIEWS.EDIT;
        const foundDependencies = dependencies && dependencies.filter(d => d.type === type && d.view === currentView);

        return !!(
            foundDependencies &&
            foundDependencies.some(({field, value}) => {
                const dependencyValue = get(formData, field);
                // if has value || its value equal to the provided value
                return dependencyValue && (dependencyValue === value || !value);
            })
        );
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
            default:
                return;
        }
    };

    const renderFieldViewMode = fieldProps => {
        if (validationError) {
            return <div>{validationError}</div>;
        }
        switch (type) {
            case 'datetime':
                return <DateTimePicker {...fieldProps} />;
            case 'boolean':
                return <Checkbox isDisabled defaultChecked={fieldProps.value} />;
            default:
                return <div>{fieldProps.value}</div>;
        }
    };

    return (
        <div className={`nexus-c-field ${validationError ? 'nexus-c-field--error' : ''}`}>
            <AKField
                isDisabled={isReadOnly || checkDependencies('readOnly')}
                isRequired={checkDependencies('required') || isRequired}
                {...props}
            >
                {({fieldProps, error, valid}) => (
                    <>
                        <div className="nexus-c-field__label">
                            {`${fieldProps.name}${checkDependencies('required') || isRequired ? '*' : ''}: `}
                            {tooltip && (
                                <span title={tooltip} style={{color: 'grey'}}>
                                    <i className="far fa-question-circle" />
                                </span>
                            )}
                        </div>
                        <div className="nexus-c-field__value">
                            {view === VIEWS.EDIT || view === VIEWS.CREATE
                                ? renderFieldEditMode(fieldProps)
                                : renderFieldViewMode(fieldProps)}
                        </div>
                        {/* <div className="nexus-c-field__error"> */}
                        {/*    <ErrorMessage>{'aa'}</ErrorMessage> */}
                        {/* </div> */}
                        {error && <ErrorMessage>{error}</ErrorMessage>}
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
};

NexusField.defaultProps = {
    view: VIEWS.VIEW,
    tooltip: null,
    formData: {},
    dependencies: [],
    isReadOnly: false,
    isRequired: false,
    validationError: null,
};

export default NexusField;
