import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from '@atlaskit/select';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import NexusDatePicker from '../nexus-date-picker/NexusDatePicker';
import './NexusDateTimeWindowPicker.scss';
import {
    END_DATE_ERROR,
    START_DATE_ERROR,
    RELATIVE_TIME_LABEL,
    SIMULCAST_TIME_LABEL
} from './constants';

const NexusDateTimeWindowPicker = ({
    label,
    labels,
    isUsingTime,
    isTimestamp, // If set, value includes milliseconds and return value is in ISO format
    onChange,
    startDateTimePickerProps,
    endDateTimePickerProps,
}) => {
    const [isSimulcast, setIsSimulcast] = useState(false);

    const [startDate, setStartDate] = useState(startDateTimePickerProps.defaultValue || '');
    const [startDateError, setStartDateError] = useState('');

    const [endDate, setEndDate] = useState(endDateTimePickerProps.defaultValue || '');
    const [endDateError, setEndDateError] = useState('');

    // Due to requirements, we check if the provided value is "zoned" and set isSimulcast accordingly
    useEffect(() => {
        const {defaultValue} = startDateTimePickerProps || {};
        typeof defaultValue === 'string' && setIsSimulcast(defaultValue.endsWith('Z'));
    }, []);

    // When date changes, validate and trigger change
    useEffect(() => {
        validateStartDate(startDate);
        setEndDateError('');
        handleChange();
    }, [startDate]);

    useEffect(() => {
        validateEndDate(endDate);
        setStartDateError('');
        handleChange();
    }, [endDate]);

    // Display an error when time-window is invalid
    // (i.e. If start date is after end date and vice versa)
    const validateStartDate = (date) => {
        (date && endDate) && (
            moment(date).isAfter(endDate)
                ? setStartDateError(START_DATE_ERROR)
                : setStartDateError('')
        );
    };

    const validateEndDate = (date) => {
        (date && startDate) && (
            moment(date).isBefore(startDate)
                ? setEndDateError(END_DATE_ERROR)
                : setEndDateError('')
        );
    };

    // If both dates are filled, send a formatted time-window string
    const handleChange = () => startDate && endDate && onChange({startDate, endDate});

    return (
        <div className="nexus-c-date-time-window-picker">
            {label &&
                <div className="nexus-c-date-time-window-picker__label">
                    {label}
                </div>
            }
            <div className="nexus-c-date-time-window-picker__start-date">
                {
                    !!labels.length && (
                        <div className="nexus-c-date-time-window-picker__label">
                            {labels[0]}
                        </div>
                    )
                }
                {isUsingTime
                    ? (
                        <NexusSimpleDateTimePicker
                            isSimulcast={isSimulcast}
                            isTimestamp={isTimestamp}
                            value={startDate}
                            onChange={setStartDate}
                            error={startDateError}
                            {...startDateTimePickerProps}
                        />
                    )
                    : (
                        <NexusDatePicker
                            value={startDate}
                            onChange={setStartDate}
                            error={startDateError}
                            {...startDateTimePickerProps}
                        />
                    )
                }
            </div>
            <div className="nexus-c-date-time-window-picker__end-date">
                {
                    !!labels.length && (
                        <div className="nexus-c-date-time-window-picker__label">
                            {labels[1]}
                        </div>
                    )
                }
                {isUsingTime
                    ? (
                        <NexusSimpleDateTimePicker
                            isSimulcast={isSimulcast}
                            isTimestamp={isTimestamp}
                            value={endDate}
                            onChange={setEndDate}
                            error={endDateError}
                            {...endDateTimePickerProps}
                        />
                    )
                    : (
                        <NexusDatePicker
                            value={endDate}
                            onChange={setEndDate}
                            error={endDateError}
                            {...endDateTimePickerProps}
                        />
                    )
                }
            </div>
            {(!isTimestamp && isUsingTime) &&
                <div className="nexus-c-date-time-picker__type-select">
                    <label className="nexus-c-date-time-picker__label">
                        Select Type
                    </label>
                    <Select
                        defaultValue={{label: RELATIVE_TIME_LABEL, value: false}}
                        options={[
                            {label: RELATIVE_TIME_LABEL, value: false},
                            {label: SIMULCAST_TIME_LABEL, value: true},
                        ]}
                        onChange={type => setIsSimulcast(type.value)}
                    />
                </div>
            }
        </div>
    );
};

NexusDateTimeWindowPicker.propTypes = {
    label: PropTypes.string,
    labels: PropTypes.array,    //example: ['From', 'To']
    isTimestamp: PropTypes.bool,
    isUsingTime: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    startDateTimePickerProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    endDateTimePickerProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};

NexusDateTimeWindowPicker.defaultProps = {
    label: '',
    labels: [],
    isTimestamp: false,
};

export default NexusDateTimeWindowPicker;