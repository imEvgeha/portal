import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form';
import {getDateFormatBasedOnLocale} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import moment from 'moment';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import ClearButton from '../clear-button/ClearButton';
import {
    TIME_PLACEHOLDER,
    ATLASKIT_DATE_FORMAT,
    SIMULCAST_DATE_FORMAT,
    RELATIVE_DATE_FORMAT,
    TIMES,
    DISPLAY_DATE_FORMAT,
} from '../constants';

const MIN_DATE_LENGTH = 10;

const NexusSimpleDateTimePicker = ({
    label,
    id,
    value,
    defaultValue,
    onChange,
    error,
    isSimulcast,
    isTimestamp,
    isClearable,
    isClearableOnly,
    ...restProps
}) => {
    const [date, setDate] = useState(value || '');

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};
    useEffect(() => setStrippedDate(date), [isSimulcast]);
    useEffect(() => setStrippedDate(value), [value]);
    const setStrippedDate = value => {
        if (!value) {
            setDate('');
            return;
        }
        // Removing the 'Z' at the end if it exists, because otherwise you always
        // get local date in preview, but requirements let the user choose
        // whether they want to use UTC or Relative
        const strippedValue = value.toString().endsWith('Z') ? value.slice(0, -1) : value;
        const newDate = moment(strippedValue).format(ATLASKIT_DATE_FORMAT);
        setDate(newDate);
    };

    // Create date placeholder based on locale
    const datePlaceholder = getDateFormatBasedOnLocale(locale).toUpperCase();

    const convertToRequiredFormat = date => {
        if (!date) {
            setDate('');
            return;
        }
        const dateWithStrippedTimezone = moment(date).format(ATLASKIT_DATE_FORMAT);
        setDate(dateWithStrippedTimezone);

        return isTimestamp
            ? moment(dateWithStrippedTimezone.concat('Z')).toISOString()
            : moment(dateWithStrippedTimezone).format(isSimulcast ? SIMULCAST_DATE_FORMAT : RELATIVE_DATE_FORMAT);
    };

    const onDateChange = date => {
        if (date) {
            onChange(convertToRequiredFormat(date));
        } else {
            return isClearable && onChange('');
        }
    };

    return (
        <>
            {label && (
                <label
                    // TODO: To be fixed
                    // This id manipulation is necessary as per AtlasKit docs
                    // https://atlaskit.atlassian.com/packages/core/datetime-picker
                    htmlFor={`react-select-${id}--input`}
                >
                    {label}
                </label>
            )}
            <div>
                <div className="nexus-c-date-picker__date-clear-wrapper">
                    <DateTimePicker
                        locale={locale}
                        id={id}
                        defaultValue={defaultValue}
                        isDisabled={isClearableOnly}
                        value={date}
                        onChange={onDateChange}
                        datePickerProps={{
                            placeholder: datePlaceholder,
                            onChange: newValue => {
                                !moment(value).isValid()
                                    ? onChange(convertToRequiredFormat(newValue))
                                    : onChange(convertToRequiredFormat(newValue + date.slice(MIN_DATE_LENGTH)));
                            },
                            formatDisplayLabel: date => `${moment(date).format(DISPLAY_DATE_FORMAT)}`,
                        }}
                        timePickerProps={{
                            placeholder: TIME_PLACEHOLDER,
                            onChange: (time = '') => {
                                const [hours, minutes] = time.split(':');
                                if (hours && minutes) {
                                    const mergedDate = moment(date || undefined)
                                        .hours(Number(hours))
                                        .minutes(Number(minutes));
                                    onChange(convertToRequiredFormat(mergedDate));
                                }
                            },
                        }}
                        timeIsEditable
                        times={TIMES}
                        {...restProps}
                    />
                </div>
                {error && (
                    <div>
                        <ErrorMessage>{error}</ErrorMessage>
                    </div>
                )}
            </div>
        </>
    );
};

NexusSimpleDateTimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    error: PropTypes.string,
    isSimulcast: PropTypes.bool,
    isTimestamp: PropTypes.bool,
    isClearable: PropTypes.bool,
    isClearableOnly: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

NexusSimpleDateTimePicker.defaultProps = {
    label: '',
    value: '',
    defaultValue: '',
    error: '',
    isSimulcast: true,
    isTimestamp: false,
    isClearable: false,
    isClearableOnly: false,
};

export default NexusSimpleDateTimePicker;

// TODO: Remove when AtlasKit fixes DateTimePicker's error state
const TemporaryErrorBorder = styled.div`
    border: 2px solid ${({error}) => (error ? '#DE350B' : 'transparent')};
    border-radius: 4px;
`;
