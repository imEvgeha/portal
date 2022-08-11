import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import InlineEdit from '@atlaskit/inline-edit';
import Select from '@atlaskit/select';
import {isUtc} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import moment from 'moment';
import {useIntl} from 'react-intl';
import CustomIntlProvider from '../../nexus-layout/CustomIntlProvider';
import NexusDatePicker from '../nexus-date-picker/NexusDatePicker';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import {getDisplayDate} from '../utils';
import {
    END_DATE_ERROR,
    START_DATE_ERROR,
    RELATIVE_TIME_LABEL,
    SIMULCAST_TIME_LABEL,
    FILL_DATE,
    FILL_DATE_TIME,
    RELATIVE_DATE_FORMAT_WITHOUT_TIME,
    RELATIVE_DATE_FORMAT,
} from '../constants';

const NexusDateTimeWindowPicker = ({
    label,
    labels,
    isUsingTime,
    isTimestamp, // If set, value includes milliseconds and return value is in ISO format
    isReturningTime,
    onChange,
    onChangeAny,
    startDateTimePickerProps,
    endDateTimePickerProps,
    isClearable,
    isWithInlineEdit,
    isReadOnly,
}) => {
    const getIsSimulCast = () => {
        if (startDateTimePickerProps.defaultValue && typeof startDateTimePickerProps.defaultValue === 'string') {
            return isUtc(startDateTimePickerProps.defaultValue);
        }
        return false;
    };

    const [isSimulcast, setIsSimulcast] = useState(getIsSimulCast());

    const [startDate, setStartDate] = useState(startDateTimePickerProps.defaultValue || '');
    const [startDateError, setStartDateError] = useState('');

    const [endDate, setEndDate] = useState(endDateTimePickerProps.defaultValue || '');
    const [endDateError, setEndDateError] = useState('');

    useEffect(() => {
        setStartDate(startDateTimePickerProps.defaultValue);
        setEndDate(endDateTimePickerProps.defaultValue);

        // Due to requirements, we check if the provided value is UTC and set isSimulcast accordingly
        setIsSimulcast(getIsSimulCast());
    }, [startDateTimePickerProps.defaultValue, endDateTimePickerProps.defaultValue]);

    // When date changes, validate and trigger change
    useEffect(() => {
        validateStartDate(startDate);
        setEndDateError('');
        onChangeAny({startDate});
        !isWithInlineEdit && handleChange(isSimulcast);
    }, [startDate]);

    useEffect(() => {
        validateEndDate(endDate);
        setStartDateError('');
        onChangeAny({endDate});
        !isWithInlineEdit && handleChange(isSimulcast);
    }, [endDate]);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Display an error when time-window is invalid
    // (i.e. If start date is after end date and vice versa)
    const validateStartDate = date => {
        date &&
            endDate &&
            (moment(date).isAfter(endDate) ? setStartDateError(START_DATE_ERROR) : setStartDateError(''));
    };

    const validateEndDate = date => {
        date && startDate && (moment(date).isBefore(startDate) ? setEndDateError(END_DATE_ERROR) : setEndDateError(''));
    };

    // Fills seconds and milliseconds for DateTime endDate or Hours, minutes, seconds and milliseconds for Date endDate
    const handleChangeEndDate = date => {
        if (!date) {
            setEndDate('');
            return;
        }
        let endDateWithFilledTime = moment(date).valueOf() + (isUsingTime ? FILL_DATE_TIME : FILL_DATE);

        const RELATIVE_FORMAT = isReturningTime ? RELATIVE_DATE_FORMAT : RELATIVE_DATE_FORMAT_WITHOUT_TIME;

        if (isTimestamp) {
            endDateWithFilledTime = moment(endDateWithFilledTime).toISOString();
        } else {
            // .utc(false) makes sure that moment doesn't try to convert our date to local date
            endDateWithFilledTime = isSimulcast
                ? moment.utc(endDateWithFilledTime).format(RELATIVE_FORMAT)
                : moment(endDateWithFilledTime).utc(true).format(RELATIVE_FORMAT);
        }

        setEndDate(endDateWithFilledTime);
    };

    // If both dates are filled, send a formatted time-window string
    const handleChange = simulcast => {
        if (onChange && ((startDate && endDate) || (isClearable && !startDate && !endDate))) {
            if (isTimestamp) {
                // YYYY-MM-DD[T]HH:mm:ss.SSS[Z]
                onChange({
                    startDate: moment(startDate).toISOString(),
                    endDate: moment(endDate).toISOString(),
                });
            } else if (startDate && startDate.endsWith('Z')) {
                // YYYY-MM-DD[T]HH:mm:ss(Z)
                onChange({
                    startDate: simulcast ? startDate : startDate.slice(0, -1),
                    endDate: simulcast ? endDate : endDate.slice(0, -1),
                });
            } else {
                // YYYY-MM-DD[T]HH:mm:ss(Z)
                onChange({
                    startDate: simulcast ? `${startDate}Z` : startDate,
                    endDate: simulcast ? `${endDate}Z` : endDate,
                });
            }
        }
    };

    const onFormatChange = value => {
        setIsSimulcast(value);
        handleChange(value);
    };

    const DatePicker = () => (
        <>
            <div className="nexus-c-date-time-window-picker__start-date">
                {!!labels.length && <div className="nexus-c-date-time-window-picker__label">{labels[0]}</div>}
                {isUsingTime ? (
                    <NexusSimpleDateTimePicker
                        isSimulcast={isSimulcast}
                        isTimestamp={isTimestamp}
                        value={startDate}
                        onChange={setStartDate}
                        error={startDateError}
                        isClearable={isClearable}
                        {...startDateTimePickerProps}
                    />
                ) : (
                    <NexusDatePicker
                        value={startDate}
                        isTimestamp={isTimestamp}
                        onChange={setStartDate}
                        error={startDateError}
                        isClearable={isClearable}
                        {...startDateTimePickerProps}
                    />
                )}
            </div>
            <div className="nexus-c-date-time-window-picker__end-date">
                {!!labels.length && <div className="nexus-c-date-time-window-picker__label">{labels[1]}</div>}
                {isUsingTime ? (
                    <NexusSimpleDateTimePicker
                        isSimulcast={isSimulcast}
                        isTimestamp={isTimestamp}
                        value={endDate}
                        onChange={handleChangeEndDate}
                        error={endDateError}
                        isClearable={isClearable}
                        {...endDateTimePickerProps}
                    />
                ) : (
                    <NexusDatePicker
                        value={endDate}
                        isTimestamp={isTimestamp}
                        onChange={handleChangeEndDate}
                        error={endDateError}
                        isClearable={isClearable}
                        {...endDateTimePickerProps}
                    />
                )}
            </div>
            {!isTimestamp && isUsingTime && (
                <div className="nexus-c-date-time-picker__type-select">
                    <label className="nexus-c-date-time-picker__label">Select Type</label>
                    <Select
                        defaultValue={{
                            label: isSimulcast ? SIMULCAST_TIME_LABEL : RELATIVE_TIME_LABEL,
                            value: isSimulcast,
                        }}
                        options={[
                            {label: RELATIVE_TIME_LABEL, value: false},
                            {label: SIMULCAST_TIME_LABEL, value: true},
                        ]}
                        onChange={type => onFormatChange(type.value)}
                    />
                </div>
            )}
        </>
    );

    const ReadView = () => (
        <div className="nexus-c-date-time-window-picker__read-view-container">
            {[
                {date: startDateTimePickerProps.defaultValue, name: 'start-date'},
                {date: endDateTimePickerProps.defaultValue, name: 'end-date'},
            ].map(({date, name}, index) => (
                <div className={`nexus-c-date-time-window-picker__${name}`} key={index}>
                    {!!labels.length && <div className="nexus-c-date-time-window-picker__label">{labels[index]}</div>}
                    {moment(date).isValid() ? (
                        getDisplayDate(date, locale, isTimestamp, isSimulcast)
                    ) : (
                        <span className="read-view-container__placeholder">{`Enter ${labels[index] || 'date'}`}</span>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <CustomIntlProvider>
            <div className="nexus-c-date-time-window-picker">
                {label && <div className="nexus-c-date-time-window-picker__label">{label}</div>}
                {isReadOnly ? (
                    <ReadView />
                ) : isWithInlineEdit ? (
                    <InlineEdit
                        onConfirm={() => handleChange(isSimulcast)}
                        editView={() => <DatePicker />}
                        defaultValue={`${startDate} ${endDate}`}
                        readView={ReadView}
                        readViewFitContainerWidth
                    />
                ) : (
                    <DatePicker />
                )}
            </div>
        </CustomIntlProvider>
    );
};

NexusDateTimeWindowPicker.propTypes = {
    label: PropTypes.string,
    labels: PropTypes.array, // example: ['From', 'To']
    isTimestamp: PropTypes.bool,
    isReturningTime: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeAny: PropTypes.func, // when any date is changed (returns blank dates as well)
    isUsingTime: PropTypes.bool.isRequired,
    startDateTimePickerProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultValue: PropTypes.string,
    }).isRequired,
    endDateTimePickerProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultValue: PropTypes.string,
    }).isRequired,
    isClearable: PropTypes.bool,
    isWithInlineEdit: PropTypes.bool,
    isReadOnly: PropTypes.bool,
};

NexusDateTimeWindowPicker.defaultProps = {
    label: '',
    labels: [],
    isTimestamp: true,
    isReturningTime: true,
    onChangeAny: () => null,
    onChange: () => null,
    isClearable: false,
    isWithInlineEdit: false,
    isReadOnly: false,
};

export default NexusDateTimeWindowPicker;
