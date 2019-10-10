import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import {DateTimePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form';
import {Label} from '@atlaskit/field-base';

const TIME_PLACEHOLDER = 'HH:mm:ss';
const ATLASKIT_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';

const NexusSimpleDateTimePicker = ({
    label,
    id,
    value,
    onChange,
    error,
    isUTC,
    ...restProps,
}) => {
    const [date, setDate] = useState(value);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    useEffect(() => setDateBasedOnTimezone(date), [isUTC]);
    useEffect(() => setDateBasedOnTimezone(value), [value]);

    const setDateBasedOnTimezone = (value) => {
        setDate(
            !isUTC
                ? moment.utc(value).local().format(ATLASKIT_DATE_FORMAT)
                : moment(value).utc(false).format(ATLASKIT_DATE_FORMAT)
        );
    };

    // Create date placeholder based on locale
    const datePlaceholder = moment()
        .locale(locale)
        .localeData()
        .longDateFormat('L')
        .toUpperCase();

    const convertToISO = date => {
        const dateWithStrippedTimezone = moment.utc(date).format(ATLASKIT_DATE_FORMAT);
        setDate(dateWithStrippedTimezone);

        // .utc(isUTC) part decides whether it is necessary to shift to UTC or not
        return moment(dateWithStrippedTimezone).utc(isUTC).toISOString();
    };

    // Parse timezone along with date and time; AtlasKit requirement
    // https://atlaskit.atlassian.com/packages/core/datetime-picker/example/timezone-compat
    const parseTimezoneValue = (
        value,
        date,
        time,
        timezone,
    ) => {
        const parsed = moment(value).parseZone();
        return {
            dateValue: parsed.isValid() ? parsed.format('YYYY-MM-DD') : date,
            timeValue: parsed.isValid() ? parsed.format('HH:mm') : time,
            zoneValue: parsed.isValid() ? parsed.format('ZZ') : timezone,
        };
    };

    return (
        <>
            <Label
                label={label}
                // TODO: To be fixed
                // This id manipulation is necessary as per AtlasKit docs
                // https://atlaskit.atlassian.com/packages/core/datetime-picker
                htmlFor={`react-select-${id}--input`}
            />
            <TemporaryErrorBorder error={error}>
                <>
                    <DateTimePicker
                        locale={locale}
                        id={id}
                        parseValue={parseTimezoneValue}
                        defaultValue={date}
                        value={date}
                        onChange={date => onChange(convertToISO(date))}
                        datePickerProps={{
                            placeholder: datePlaceholder,
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
    error: PropTypes.string,
    isUTC: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

NexusSimpleDateTimePicker.defaultProps = {
    label: '',
    value: '',
    error: '',
    isUTC: false,
};

export default NexusSimpleDateTimePicker;

// TODO: Remove when AtlasKit fixes DateTimePicker's error state
const TemporaryErrorBorder = styled.div`
    border: 2px solid ${({error}) => error ? '#DE350B' : 'transparent'};
    border-radius: 4px;
`;