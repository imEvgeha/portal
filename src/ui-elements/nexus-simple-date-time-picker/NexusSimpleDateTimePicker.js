import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form';
import {getDateFormatBasedOnLocale} from '../../util/Common';
import {
    TIME_PLACEHOLDER,
    ATLASKIT_DATE_FORMAT,
    SIMULCAST_DATE_FORMAT,
    RELATIVE_DATE_FORMAT
} from './constants';

const NexusSimpleDateTimePicker = ({
    label,
    id,
    value,
    defaultValue,
    onChange,
    error,
    isUTC,
    isTimestamp,
    ...restProps
}) => {
    const [date, setDate] = useState(value);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    useEffect(() => setStrippedDate(date), [isUTC]);
    useEffect(() => setStrippedDate(value), [value]);

    const setStrippedDate = (value) => {
        // Removing the 'Z' at the end if it exists, because otherwise you always
        // get local date in preview, but requirements let the user choose
        // whether they want to use UTC or Relative
        const strippedValue = value.endsWith('Z') ? value.slice(0, -1) : value;
        const newDate = moment(strippedValue).format(ATLASKIT_DATE_FORMAT);
        setDate(newDate);
    };

    // Create date placeholder based on locale
    const datePlaceholder = getDateFormatBasedOnLocale(locale).toUpperCase();

    const convertToRequiredFormat = date => {
        const dateWithStrippedTimezone = moment(date).format(ATLASKIT_DATE_FORMAT);
        setDate(dateWithStrippedTimezone);

        return isTimestamp
            ? moment(dateWithStrippedTimezone.concat('Z')).toISOString()
            : moment(dateWithStrippedTimezone).format(isUTC ? SIMULCAST_DATE_FORMAT : RELATIVE_DATE_FORMAT);
    };

    return (
        <>
            {label &&
                <label
                    // TODO: To be fixed
                    // This id manipulation is necessary as per AtlasKit docs
                    // https://atlaskit.atlassian.com/packages/core/datetime-picker
                    htmlFor={`react-select-${id}--input`}
                >
                    {label}
                </label>
            }
            <TemporaryErrorBorder error={error}>
                <>
                    <DateTimePicker
                        locale={locale}
                        id={id}
                        defaultValue={defaultValue}
                        value={date}
                        onChange={date => date && onChange(convertToRequiredFormat(date))}
                        datePickerProps={{
                            placeholder: datePlaceholder,
                            onChange: (newValue) => {
                                !moment(value).isValid()
                                    ? onChange(convertToRequiredFormat(newValue))
                                    : onChange(convertToRequiredFormat(newValue + date.slice(10)));
                            }
                        }}
                        timePickerProps={{
                            placeholder: TIME_PLACEHOLDER,
                        }}
                        {...restProps}
                    />
                </>
            </TemporaryErrorBorder>
            {error &&
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            }
        </>
    );
};

NexusSimpleDateTimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    error: PropTypes.string,
    isUTC: PropTypes.bool,
    isTimestamp: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

NexusSimpleDateTimePicker.defaultProps = {
    label: '',
    value: '',
    defaultValue: '',
    error: '',
    isUTC: true,
    isTimestamp: true, //TODO: Change to false when AVAILS team finishes their part NEX-656
};

export default NexusSimpleDateTimePicker;

// TODO: Remove when AtlasKit fixes DateTimePicker's error state
const TemporaryErrorBorder = styled.div`
    border: 2px solid ${({error}) => error ? '#DE350B' : 'transparent'};
    border-radius: 4px;
`;
