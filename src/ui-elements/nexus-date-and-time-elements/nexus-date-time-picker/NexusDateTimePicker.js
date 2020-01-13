// eslint-disable-next-line no-unused-vars
import React, {useState, Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useIntl} from 'react-intl';
import Select from '@atlaskit/select';
import InlineEdit from '@atlaskit/inline-edit';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import {getDateFormatBasedOnLocale} from '../../../util/Common';
import './NexusDateTimePicker.scss';
import {
    RELATIVE_TIME_LABEL,
    SIMULCAST_TIME_LABEL,
    TIME_FORMAT,
    TIMESTAMP_FORMAT,
} from '../constants';

const NexusDateTimePicker = ({
    id,
    isWithInlineEdit, // If set, allows for switching between read and edit modes
    isReadOnly,
    isTimestamp, // If set, value includes milliseconds and return value is in ISO format
    onChange,
    onConfirm,
    value,
    label,
    ...restProps
}) => {
    const [isSimulcast, setIsSimulcast] = useState(false);

    // Due to requirements, we check if the provided value is "zoned" and set isSimulcast accordingly
    useEffect(() => {typeof value === 'string' && setIsSimulcast(value.endsWith('Z'));}, []);

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
                                isSimulcast={isSimulcast}
                                isTimestamp={isTimestamp}
                                defaultValue={isSimulcast ? value : moment(value).local().format(dateFormat)}
                                {...restProps}
                            />
                        </div>
                        {!isTimestamp && ( // Timestamps are always UTC, no need for this option
                            <div className="nexus-c-date-time-picker__type-select">
                                <Select
                                    defaultValue={
                                        isSimulcast
                                            ? {label: SIMULCAST_TIME_LABEL, value: true}
                                            : {label: RELATIVE_TIME_LABEL, value: false}
                                    }
                                    options={[
                                        {label: RELATIVE_TIME_LABEL, value: false},
                                        {label: SIMULCAST_TIME_LABEL, value: true},
                                    ]}
                                    onChange={type => setIsSimulcast(type.value)}
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
                                 ${isSimulcast && !isTimestamp ? ' (UTC)' : ''}`
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
                                newDate = isSimulcast ? date : date.slice(0, -1);
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
    isTimestamp: false,
    onConfirm: () => null,
};

export default NexusDateTimePicker;
