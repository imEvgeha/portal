import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import NexusDatePicker from '../nexus-date-picker/NexusDatePicker';
import './NexusDateTimeWindowPicker.scss';
import moment from 'moment';

// TODO: Move to a separate file for constants
const RELATIVE_TIME_LABEL = 'Relative';
const SIMULCAST_TIME_LABEL = 'Simulcast (UTC)';
const START_DATE_ERROR = 'Start date must be before End date';
const END_DATE_ERROR = 'End date must be after Start date';

const NexusDateTimeWindowPicker = ({
    label,
    labels,
    isLocalDate,
    isUsingTime,
    onChange,
    getAllUpdates,
    startDateTimePickerProps,
    endDateTimePickerProps,
}) => {
    const [isUTC, setIsUTC] = useState(isLocalDate);

    const [startDate, setStartDate] = useState(startDateTimePickerProps.defaultValue || '');
    const [startDateError, setStartDateError] = useState('');

    const [endDate, setEndDate] = useState(endDateTimePickerProps.defaultValue || '');
    const [endDateError, setEndDateError] = useState('');

    // When date changes, validate and trigger change
    useEffect(() => {
        validateStartDate(startDate);
        setEndDateError('');
        startDate && getAllUpdates({startDate});
        handleChange();
    }, [startDate]);

    useEffect(() => {
        validateEndDate(endDate);
        setStartDateError('');
        endDate && getAllUpdates({endDate});
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
                            isUTC={isUTC}
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
                            isUTC={isUTC}
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
            {isUsingTime &&
                <div className="nexus-c-date-time-picker__type-select">
                    <label className="nexus-c-date-time-picker__label">
                        Select Type
                    </label>
                    <Select
                        defaultValue={
                            isLocalDate
                                ? {label: RELATIVE_TIME_LABEL, value: false}
                                : {label: SIMULCAST_TIME_LABEL, value: true}
                        }
                        options={[
                            {label: RELATIVE_TIME_LABEL, value: false},
                            {label: SIMULCAST_TIME_LABEL, value: true},
                        ]}
                        onChange={type => setIsUTC(type.value)}
                    />
                </div>
            }
        </div>
    );
};

NexusDateTimeWindowPicker.propTypes = {
    label: PropTypes.string,
    labels: PropTypes.array,    //example: ['From', 'To']
    islocalDate: PropTypes.bool,
    isUsingTime: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    getAllUpdates: PropTypes.func,     //when any date is changed (returns blank dates as well)
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
    isLocalDate: false,
    getAllUpdates: () => null,
    onChange: () => null,
};

export default NexusDateTimeWindowPicker;