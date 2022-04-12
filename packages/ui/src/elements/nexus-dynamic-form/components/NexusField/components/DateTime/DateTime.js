import React from 'react';
import PropTypes from 'prop-types';
import NexusDatePicker from '../../../../../nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import NexusDateTimePicker from '../../../../../nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';
import NexusDateTimeWindowPicker from '../../../../../nexus-date-and-time-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';
import {DATETIME_FIELDS} from '../../../../constants';
import './DateTime.scss';

const {BUSINESS_DATETIME, TIMESTAMP} = DATETIME_FIELDS;

const DateTime = ({
    dateType,
    type,
    labels,
    isReadOnly,
    isDisabled,
    value,
    onChange,
    id,
    isReturningTime,
    isClearable,
}) => {
    const isUsingTime = [BUSINESS_DATETIME, TIMESTAMP].includes(dateType);
    const isTimestamp = dateType === TIMESTAMP;
    if (type === 'dateRange') {
        const dateProps = {
            isUsingTime,
            isTimestamp,
            startDateTimePickerProps: {
                id: `${id}-start`,
                defaultValue: value.startDate,
            },
            endDateTimePickerProps: {
                id: `${id}-end`,
                defaultValue: value.endDate,
            },
            labels,
            onChange,
            isReturningTime,
            isClearable,
        };
        return <NexusDateTimeWindowPicker isReadOnly={isReadOnly || isDisabled} {...dateProps} />;
    }
    const props = {
        id: `${id}-date`,
        isReadOnly,
        value,
        isTimestamp,
        onChange,
        isClearable,
    };
    return isUsingTime ? (
        <NexusDateTimePicker {...props} value={value.toString()} />
    ) : (
        <NexusDatePicker {...props} value={value.toString()} />
    );
};

DateTime.propTypes = {
    dateType: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    labels: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    isReadOnly: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isClearable: PropTypes.bool,
    onChange: PropTypes.func,
    isReturningTime: PropTypes.bool,
};

DateTime.defaultProps = {
    dateType: '',
    type: '',
    id: '',
    labels: ['', ''],
    value: '',
    isReadOnly: false,
    isClearable: false,
    isDisabled: false,
    isReturningTime: true,
    onChange: () => null,
};

export default DateTime;
