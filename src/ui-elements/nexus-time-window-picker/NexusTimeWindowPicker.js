import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import './NexusTimeWindowPicker.scss';
import moment from 'moment';

// TODO: Move to a separate file for constants
const RELATIVE_TIME_LABEL = 'Relative';
const SIMULCAST_TIME_LABEL = 'Simulcast (UTC)';
const START_DATE_ERROR = 'Start date must be before End date';
const END_DATE_ERROR = 'End date must be after Start date';

const NexusTimeWindowPicker = ({
    label,
    onChange,
    startDateProps,
    endDateProps,
}) => {
    const [isUTC, setIsUTC] = useState(false);

    const [startDate, setStartDate] = useState(startDateProps.defaultValue || '');
    const [startDateError, setStartDateError] = useState('');

    const [endDate, setEndDate] = useState(endDateProps.defaultValue || '');
    const [endDateError, setEndDateError] = useState('');

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
            moment(date).isSameOrAfter(endDate)
                ? setStartDateError(START_DATE_ERROR)
                : setStartDateError('')
        );
    };

    const validateEndDate = (date) => {
        (date && startDate) && (
            moment(date).isSameOrBefore(startDate)
                ? setEndDateError(END_DATE_ERROR)
                : setEndDateError('')
        );
    };

    // If both dates are filled, send a formatted time-window string
    const handleChange = () => startDate && endDate && onChange({startDate, endDate});

    return (
        <div className="nexus-c-time-window-picker">
            {label &&
                <div className="nexus-c-time-window-picker__label">
                    {label}
                </div>
            }
            <div className="nexus-c-time-window-picker__start-date">
                <NexusSimpleDateTimePicker
                    isUTC={isUTC}
                    value={startDate}
                    onChange={setStartDate}
                    error={startDateError}
                    {...startDateProps}
                />
            </div>
            <div className="nexus-c-time-window-picker__end-date">
                    <NexusSimpleDateTimePicker
                        isUTC={isUTC}
                        value={endDate}
                        onChange={setEndDate}
                        error={endDateError}
                        {...endDateProps}
                    />
            </div>
            <div className="nexus-c-date-time-picker__type-select">
                <Select
                    defaultValue={{label: RELATIVE_TIME_LABEL, value: false}}
                    options={[
                        {label: RELATIVE_TIME_LABEL, value: false},
                        {label: SIMULCAST_TIME_LABEL, value: true},
                        ]}
                        onChange={type => setIsUTC(type.value)}
                    />
            </div>
        </div>
    );
};

NexusTimeWindowPicker.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    startDateProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    endDateProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};

NexusTimeWindowPicker.defaultProps = {
    label: '',
};

export default NexusTimeWindowPicker;