import React from 'react';
import PropTypes from 'prop-types';
import NexusDateTimeWindowPicker from '../../nexus-date-and-time-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';
import {DATETIME_FIELDS} from '../constants';

const {BUSINESS_DATETIME, TIMESTAMP} = DATETIME_FIELDS;

const DateTime = ({dateType, labels, isReadOnly, value, onChange}) => {
    const dateProps = {
        isUsingTime: [BUSINESS_DATETIME, TIMESTAMP].includes(dateType),
        isTimestamp: dateType === TIMESTAMP,
        startDateTimePickerProps: {
            id: labels[0].replace(' ', ''),
            defaultValue: value.startDate,
        },
        endDateTimePickerProps: {
            id: labels[1].replace(' ', ''),
            defaultValue: value.endDate,
        },
        labels,
        onChange,
    };
    return <NexusDateTimeWindowPicker isReadOnly={isReadOnly} {...dateProps} />;
};

DateTime.propTypes = {
    dateType: PropTypes.string,
    labels: PropTypes.array,
    value: PropTypes.array,
    isReadOnly: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

DateTime.defaultProps = {
    dateType: '',
    labels: ['', ''],
    value: ['', ''],
    isReadOnly: false,
};

export default DateTime;
