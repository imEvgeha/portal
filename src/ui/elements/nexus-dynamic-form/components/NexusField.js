import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import {get} from 'lodash';
import NexusTextArea from '../../nexus-textarea/NexusTextArea';
import './NexusField.scss';

const NexusField = ({type, isEdit, tooltip, data, readOnly, dependencies, ...props}) => {
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
        // check for validations
        const readOnlyDependencies = checkDependencies('readOnly');
        switch (type) {
            case 'string':
                return <TextField isReadOnly={readOnly || readOnlyDependencies} {...fieldProps} />;
            case 'textarea':
                return <NexusTextArea isReadOnly={readOnly || readOnlyDependencies} {...fieldProps} />;
            case 'number':
                return <TextField isReadOnly={readOnly || readOnlyDependencies} {...fieldProps} type="Number" />;
            case 'boolean':
                const {name, label} = fieldProps;
                return (
                    <CheckboxField isDisabled={readOnly || readOnlyDependencies} name={name} label={label}>
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
            <AKField {...props}>
                {({fieldProps, error, valid}) => (
                    <>
                        <div className="nexus-c-field__label">
                            {`${fieldProps.name}${fieldProps.isRequired ? '*' : ''}: `}
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
    readOnly: PropTypes.bool,
};

NexusField.defaultProps = {
    isEdit: false,
    tooltip: null,
    data: {},
    dependencies: [],
    readOnly: false,
};

export default NexusField;
