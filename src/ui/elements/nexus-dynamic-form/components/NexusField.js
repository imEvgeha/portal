import React from 'react';
import PropTypes from 'prop-types';
import {DatePicker, TimePicker, DateTimePicker} from '@atlaskit/datetime-picker';
import {Field as AKField, ErrorMessage} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

const NexusField = ({...props}) => {
    const renderField = (fieldProps, valid, error) => {
        switch (props.type) {
            case 'string':
                return <TextField {...fieldProps} valid={valid} error={error} />;
            case 'date':
                return <DatePicker {...fieldProps} valid={valid} error={error} />;
            case 'time':
                return <TimePicker {...fieldProps} valid={valid} error={error} />;
            case 'datetime':
                return <DateTimePicker {...fieldProps} valid={valid} error={error} />;
            default:
                return;
        }
    };

    return (
        <AKField {...props}>
            {({fieldProps, error, valid}) => (
                <>
                    {renderField(fieldProps, valid, error)}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </>
            )}
        </AKField>
    );
};

NexusField.propTypes = {
    type: PropTypes.string.isRequired,
};

export default NexusField;
