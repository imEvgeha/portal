import React from 'react';
import PropTypes from 'prop-types';
import {DatePicker, TimePicker, DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

const NexusField = ({...props}) => {
    const renderField = fieldProps => {
        switch (props.type) {
            case 'string':
                return <TextField {...fieldProps} />;
            case 'number':
                return <TextField {...fieldProps} type="Number" />;
            case 'date':
                return <DatePicker {...fieldProps} />;
            case 'time':
                return <TimePicker {...fieldProps} />;
            case 'datetime':
                return <DateTimePicker {...fieldProps} />;
            default:
                return;
        }
    };

    return (
        <AKField {...props}>
            {({fieldProps, error, valid}) => (
                <>
                    {renderField(fieldProps)}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </>
            )}
        </AKField>
    );
};

NexusField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default NexusField;
