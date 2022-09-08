import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import InlineEdit from '@atlaskit/inline-edit';
import Select from '@atlaskit/select';
import {isUtc} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import moment from 'moment';
import {useIntl} from 'react-intl';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import './NexusDateTimePicker.scss';
import {getDisplayDate, getDateFormat} from '../utils';
import {
    RELATIVE_TIME_LABEL,
    SIMULCAST_TIME_LABEL,
    TIMESTAMP_DATE_FORMAT,
    SIMULCAST_DATE_FORMAT,
    RELATIVE_DATE_FORMAT,
} from '../constants';

const NexusDateTimePicker = ({
    id,
    elementId,
    isWithInlineEdit, // If set, allows for switching between read and edit modes
    isReadOnly,
    isViewModeDisabled, // show atlaskit component instead of view mode
    isTimestamp, // If set, value includes milliseconds and return value is in ISO format
    onChange,
    onConfirm,
    value,
    label,
    isLabelHidden, // TODO: Remove when RightDetails gets refactored/redesigned
    isClearableOnly,
    ...restProps
}) => {
    const [date, setDate] = useState(value);
    const [firstRun, setFirstRun] = useState(true);

    // set isSimulcast as computed property (fix for 3825)
    const isSimulcast = isUtc(value || '');

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};
    const dateFormat = getDateFormat(locale, isTimestamp, isSimulcast);
    const displayDate = getDisplayDate(value, locale, isTimestamp, isSimulcast);

    useEffect(() => {
        date &&
            setDate(
                moment
                    .utc(date)
                    .format(
                        isTimestamp ? TIMESTAMP_DATE_FORMAT : isSimulcast ? SIMULCAST_DATE_FORMAT : RELATIVE_DATE_FORMAT
                    )
            );
    }, [isSimulcast, isTimestamp]);

    const onFormatChange = isSimulcast =>
        setDate(
            moment
                .utc(date)
                .format(
                    isTimestamp ? TIMESTAMP_DATE_FORMAT : isSimulcast ? SIMULCAST_DATE_FORMAT : RELATIVE_DATE_FORMAT
                )
        );

    useEffect(() => {
        !firstRun && !isWithInlineEdit && onChange(date);
        setFirstRun(false);
    }, [date]);

    const DatePicker = isReadOnly => {
        return (
            <>
                {!isLabelHidden && label && <div className="nexus-c-date-time-picker__label">{label}</div>}
                {isReadOnly && !isViewModeDisabled ? (
                    displayDate
                ) : (
                    <div className="nexus-c-date-time-picker">
                        <div className="nexus-c-date-time-picker__date-time">
                            <NexusSimpleDateTimePicker
                                id={id}
                                onChange={e => {
                                    setDate(e);
                                }}
                                value={value || ''}
                                isSimulcast={isSimulcast}
                                isTimestamp={isTimestamp}
                                defaultValue={isSimulcast ? value : moment(value).local().format(dateFormat)}
                                isClearableOnly={isClearableOnly}
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
                                    onChange={type => onFormatChange(type.value)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <div id={elementId}>
            {' '}
            {isWithInlineEdit && !isReadOnly && !isViewModeDisabled ? (
                <InlineEdit
                    readView={() => (
                        <div className="nexus-c-date-time-picker__read-view-container">
                            {moment(value).isValid() ? (
                                displayDate
                            ) : (
                                <div className="read-view-container__placeholder">{`Enter ${label}`}</div>
                            )}
                        </div>
                    )}
                    editView={() => DatePicker(false)}
                    defaultValue={value || ''}
                    onConfirm={() => {
                        // As per requirement, timestamps are in ISO format
                        // and other dates take shorter format with no milliseconds
                        // where Simulcast(UTC) dates are with 'Z' at the end
                        if (isTimestamp) {
                            onConfirm(moment(date).toISOString()); // YYYY-MM-DD[T]HH:mm:ss.SSS[Z]
                        } else if (date && date.endsWith('Z')) {
                            onConfirm(isSimulcast ? date : date.slice(0, -1)); // YYYY-MM-DD[T]HH:mm:ss(Z)
                        } else {
                            onConfirm(isSimulcast ? `${date}Z` : date); // YYYY-MM-DD[T]HH:mm:ss(Z)
                        }
                    }}
                    readViewFitContainerWidth
                    {...restProps}
                />
            ) : (
                DatePicker(isReadOnly)
            )}
        </div>
    );
};

NexusDateTimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    isWithInlineEdit: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isClearableOnly: PropTypes.bool,
    isViewModeDisabled: PropTypes.bool,
    isTimestamp: PropTypes.bool,
    isLabelHidden: PropTypes.bool,
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    elementId: PropTypes.string,
};

NexusDateTimePicker.defaultProps = {
    label: '',
    value: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    isClearableOnly: false,
    isViewModeDisabled: false,
    isTimestamp: false,
    isLabelHidden: false,
    onConfirm: () => null,
    elementId: '',
};

export default NexusDateTimePicker;
