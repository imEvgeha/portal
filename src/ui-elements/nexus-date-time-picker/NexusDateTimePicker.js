// eslint-disable-next-line no-unused-vars
import React, {useState, Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useIntl} from 'react-intl';
import Select from '@atlaskit/select';
import InlineEdit from '@atlaskit/inline-edit';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import {getDateFormatBasedOnLocale} from '../../util/Common';
import './NexusDateTimePicker.scss';
import {
    RELATIVE_TIME_LABEL,
    SIMULCAST_TIME_LABEL,
    TIME_FORMAT,
    TIMESTAMP_FORMAT
} from './constants';

const NexusDateTimePicker = ({
    id,
    isWithInlineEdit, // If set, allows for switching between read and edit modes
    isReadOnly,
    isLocalDate, // Used for CreatedAt, UpdatedAt, ReceivedAt values
    isTimestamp, // If set, value includes milliseconds and return value is in ISO format
    onChange,
    onConfirm,
    value,
    label,
    ...restProps
}) => {
    const [isUTC, setIsUTC] = useState(!isLocalDate);

    // Due to requirements, we check if the provided value is "zoned" and set isUTC accordingly
    useEffect(() => {typeof value === 'string' && setIsUTC(value.endsWith('Z'));}, []);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date format based on locale
    const dateFormat = getDateFormatBasedOnLocale(locale)
        .toUpperCase()
        .concat(isTimestamp ? TIMESTAMP_FORMAT : TIME_FORMAT); // Decide whether to include milliseconds based on type

    const getDisplayDate = (date) => {
        const hasUTCTag = date.endsWith('Z');
        return moment(date).utc(!hasUTCTag).format(dateFormat);
    };

    const DatePicker = (isReadOnly) => (
        <div className="nexus-c-date-time-picker">
            {label &&
                <div className="nexus-c-date-time-picker__label">
                    {label}
                </div>
            }
            {isReadOnly
                ? getDisplayDate(value)
                : (
                    <>
                        <div className="nexus-c-date-time-picker__date-time">
                            <NexusSimpleDateTimePicker
                                id={id}
                                onChange={onChange}
                                value={value}
                                isUTC={isUTC}
                                defaultValue={isUTC ? value : moment(value).local().format(dateFormat)}
                                {...restProps}
                            />
                        </div>
                        {!isTimestamp && ( // Timestamps are always UTC, no need for this option
                            <div className="nexus-c-date-time-picker__type-select">
                                <Select
                                    defaultValue={
                                        !isUTC
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
                        )}
                    </>
                )
            }
        </div>
    );

    return (
        <>
            {isWithInlineEdit && !isReadOnly
                ? (
                    <InlineEdit
                        readView={() => (
                            <div className="nexus-c-date-time-picker__read-view-container">
                                {moment(value).isValid()
                                ?`${getDisplayDate(value)}
                                 ${isUTC && !isTimestamp ? ' (UTC)' : ''}`
                                : <div className="read-view-container__placeholder">
                                        {`Enter ${name}`}
                                </div>}
                            </div>
                        )}
                        editView={() => DatePicker(false)}
                        defaultValue={value}
                        onConfirm={date => {
                            let newDate = date;
                            // As per requirement, timestamps are in ISO format
                            // and other dates take shorter format with no milliseconds
                            // where Simulcast(UTC) dates are with 'Z' at the end
                            if (isTimestamp) {
                                newDate = moment(date).toISOString();
                            } else {
                                newDate = isUTC ? date : date.slice(0, -1);
                            }
                            onConfirm(newDate);
                        }}
                        readViewFitContainerWidth
                        {...restProps}
                    />
                )
                : DatePicker(isReadOnly)
            }
        </>
    );
};

NexusDateTimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    isWithInlineEdit: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isLocalDate: PropTypes.bool,
    isTimestamp: PropTypes.bool,
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

NexusDateTimePicker.defaultProps = {
    label: '',
    value: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    isLocalDate: true, //TODO: Check if this flag is useful at all anymore, if not set isUTC default as 'false'
    isTimestamp: true, //TODO: Change to false when AVAILS team finishes their part NEX-656
    onConfirm: () => null,
};

export default NexusDateTimePicker;
