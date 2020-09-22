import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import {get} from 'lodash';
import NexusTextArea from '../../nexus-textarea/NexusTextArea';
import './NexusField.scss';

const NexusField = ({type, isEdit, tooltip, data, isReadOnly, isRequired, dependencies, ...props}) => {
    const checkDependencies = type => {
        const view = isEdit ? 'edit' : 'view';
        const foundDependencies = dependencies && dependencies.filter(d => d.type === type && d.view === view);

        return !!(
            foundDependencies &&
            foundDependencies.some(({field, value}) => {
                const dependencyValue = get(data, field);
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
                    >
                        {({fieldProps}) => <Checkbox {...fieldProps} />}
                    </CheckboxField>
                );
            default:
                return;
        }
    };

    const renderFieldViewMode = fieldProps => {
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
        <div className="nexus-c-field">
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
                            {isEdit ? renderFieldEditMode(fieldProps) : renderFieldViewMode(fieldProps)}
                        </div>
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
    isEdit: PropTypes.bool,
    tooltip: PropTypes.string,
    data: PropTypes.object,
    dependencies: PropTypes.array,
    isReadOnly: PropTypes.bool,
    isRequired: PropTypes.bool,
};

NexusField.defaultProps = {
    isEdit: false,
    tooltip: null,
    data: {},
    dependencies: [],
    isReadOnly: false,
    isRequired: false,
};

export default NexusField;
