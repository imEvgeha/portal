import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {DatePicker, TimePicker, DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import NexusTextArea from "../../nexus-textarea/NexusTextArea";
import './NexusField.scss';

const NexusField = ({type, isEdit, tooltip, ...props}) => {
    const renderFieldEditMode = fieldProps => {
        switch (type) {
            case 'string':
                return <TextField {...fieldProps} />;
            case 'textarea':
                return <NexusTextArea {...fieldProps} />;
            case 'number':
                return <TextField {...fieldProps} type="Number" />;
            case 'date':
                return <DatePicker {...fieldProps} />;
            case 'time':
                return <TimePicker {...fieldProps} />;
            case 'datetime':
                return <DateTimePicker {...fieldProps} />;
            case 'boolean':
                const {name, label} = fieldProps;
                return (
                    <CheckboxField name={name} label={label}>
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
};

NexusField.defaultProps = {
    isEdit: false,
    tooltip: null,
};

export default NexusField;
