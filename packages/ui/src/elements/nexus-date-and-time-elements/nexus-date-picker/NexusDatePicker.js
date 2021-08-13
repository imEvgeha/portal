import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {DatePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form/Messages';
import InlineEdit from '@atlaskit/inline-edit';
import {getDateFormatBasedOnLocale, parseSimulcast} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import classnames from 'classnames';
import moment from 'moment';
import {useIntl} from 'react-intl';
import ClearButton from '../clear-button/ClearButton';
import {RELATIVE_DATE_FORMAT, SIMULCAST_DATE_FORMAT, RELATIVE_DATE_FORMAT_WITHOUT_TIME} from '../constants';
import './NexusDatePicker.scss';

const NexusDatePicker = ({
    id,
    isWithInlineEdit, // If set, allows for switching between read and edit modes
    isReadOnly,
    isTimestamp, // If set, value includes milliseconds and return value is in ISO format
    onChange,
    onConfirm,
    value,
    error,
    label,
    isLabelHidden, // TODO: Remove when RightDetails gets refactored/redesigned
    isReturningTime,
    isClearable,
    isRequired,
    ...restProps
}) => {
    const [date, setDate] = useState(value || '');
    const [isSimulcast, setIsSimulcast] = useState(false);

    useEffect(() => {
        setDate(value || '');
    }, [value]);

    // Due to requirements, we check if the provided value is "zoned" and set isSimulcast accordingly
    useEffect(() => {
        typeof value === 'string' && setIsSimulcast(value.endsWith('Z'));
    }, []);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date placeholder based on locale
    const dateFormat = `${getDateFormatBasedOnLocale(locale)}`;

    const RELATIVE_FORMAT = isReturningTime ? RELATIVE_DATE_FORMAT : RELATIVE_DATE_FORMAT_WITHOUT_TIME;

    const onDateChange = date => {
        if (date) {
            setDate(date);
            // Don't use onChange if the component has InlineEdit
            // onConfirm will handle changes
            !isWithInlineEdit &&
                onChange(
                    isTimestamp
                        ? moment(date).utc(true).toISOString()
                        : `${moment.utc(date).format(isSimulcast ? SIMULCAST_DATE_FORMAT : RELATIVE_FORMAT)}`
                );
        } else {
            setDate('');
            onChange('');
        }
    };

    const DatePickerComponent = isReadOnly => {
        return (
            <div className="nexus_c_date_picker_filter">
                {!isLabelHidden && label && (
                    <label htmlFor={id} className={classnames(isRequired && 'required')}>
                        {label}
                    </label>
                )}
                {isReadOnly ? (
                    parseSimulcast(value, dateFormat, false)
                ) : (
                    <div className="nexus-c-date-picker__date-clear-wrapper">
                        <DatePicker
                            name={id}
                            id={id}
                            locale={locale}
                            placeholder={dateFormat}
                            onChange={onDateChange}
                            defaultValue={moment(value).isValid() ? value : ''}
                            value={date}
                            {...restProps}
                        />
                        {isClearable && <ClearButton onClear={() => onDateChange('')} />}
                    </div>
                )}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </div>
        );
    };

    return (
        <>
            {' '}
            {isWithInlineEdit && !isReadOnly ? (
                <InlineEdit
                    readView={() => (
                        <div className="nexus-c-date-picker__read-view-container">
                            {(moment(value).isValid() && parseSimulcast(value, dateFormat, false)) || (
                                <div className="read-view-container__placeholder">{`Enter ${label}`}</div>
                            )}
                        </div>
                    )}
                    editView={() => DatePickerComponent(false)}
                    defaultValue={moment(value).isValid() ? value : ''}
                    onConfirm={() => onConfirm(date)}
                    readViewFitContainerWidth
                    {...restProps}
                />
            ) : (
                DatePickerComponent(isReadOnly)
            )}
        </>
    );
};

NexusDatePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    isWithInlineEdit: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isTimestamp: PropTypes.bool,
    isLabelHidden: PropTypes.bool,
    isReturningTime: PropTypes.bool,
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    isClearable: PropTypes.bool,
    isRequired: PropTypes.bool,
};

NexusDatePicker.defaultProps = {
    label: '',
    value: '',
    error: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    isTimestamp: false,
    isLabelHidden: false,
    isReturningTime: false,
    onConfirm: () => null,
    onChange: () => null,
    isClearable: false,
    isRequired: false,
};

export default NexusDatePicker;
