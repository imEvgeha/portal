// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import InlineEdit from '@atlaskit/inline-edit';
import {DatePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form/Messages';
import moment from 'moment';
import {useIntl} from 'react-intl';
import './NexusDatePicker.scss';
import {
    RELATIVE_DATE_FORMAT,
    SIMULCAST_DATE_FORMAT,
    RELATIVE_DATE_FORMAT_WITHOUT_TIME
} from '../constants';
import ClearButton from '../clear-button/ClearButton';
import {getDateFormatBasedOnLocale, parseSimulcast} from '../../../../util/DateTimeUtils';

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
    hideLabel, // TODO: Remove when RightDetails gets refactored/redesigned
    isReturningTime,
    allowClear,
    ...restProps
}) => {
    const [date, setDate] = useState(value || '');
    const [isSimulcast, setIsSimulcast] = useState(false);

    useEffect(() => setDate(value || ''), [value]);
    // Due to requirements, we check if the provided value is "zoned" and set isSimulcast accordingly
    useEffect(() => {typeof value === 'string' && setIsSimulcast(value.endsWith('Z'));}, []);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date placeholder based on locale
    const dateFormat = `${getDateFormatBasedOnLocale(locale)}`;

    const RELATIVE_FORMAT = isReturningTime ? RELATIVE_DATE_FORMAT : RELATIVE_DATE_FORMAT_WITHOUT_TIME;

    const onDateChange = date => {
        if(date){
            setDate(date);
            // Don't use onChange if the component has InlineEdit
            // onConfirm will handle changes
            !isWithInlineEdit && onChange(
                isTimestamp
                    ? moment(date).utc(true).toISOString()
                    : `${moment(date).utc(true).format(isSimulcast
                        ? SIMULCAST_DATE_FORMAT
                        : RELATIVE_FORMAT)
                    }`
            );
        } else {
            setDate('');
            onChange('');
        }
    };

    const DatePickerComponent = (isReadOnly) => {
  return (
      <>
          {!hideLabel && label && (
          <> {label} </>
              )}
          {isReadOnly
                ? parseSimulcast(value, dateFormat, false)
                : (
                    <div className='nexus-c-date-picker__date-clear-wrapper'>
                        <DatePicker
                            id={id}
                            locale={locale}
                            placeholder={dateFormat}
                            onChange={onDateChange}
                            defaultValue={moment(value).isValid() ? value : ''}
                            value={date}
                            {...restProps}
                        />
                        {allowClear && <ClearButton onClear={() => onDateChange('')} />}
                    </div>
                )}
          {error && (
          <ErrorMessage>
              {error}
          </ErrorMessage>
              )}
      </>
);
};

    return (
        <> {isWithInlineEdit && !isReadOnly
                ? (
                    <InlineEdit
                        readView={() => (
                            <div className="nexus-c-date-picker__read-view-container">
                                {(moment(value).isValid() && parseSimulcast(value, dateFormat, false))
                                    || (
                                    <div className="read-view-container__placeholder">
                                        {`Enter ${label}`}
                                    </div>
)}
                            </div>
                        )}
                        editView={() => DatePickerComponent(false)}
                        defaultValue={moment(value).isValid() ? value : ''}
                        onConfirm={() => onConfirm(date)}
                        readViewFitContainerWidth
                        {...restProps}
                    />
                )
                : DatePickerComponent(isReadOnly)}
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
    hideLabel: PropTypes.bool,
    isReturningTime: PropTypes.bool,
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    allowClear: PropTypes.bool,
};

NexusDatePicker.defaultProps = {
    label: '',
    value: '',
    error: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    isTimestamp: false,
    hideLabel: false,
    isReturningTime: true,
    onConfirm: () => null,
    allowClear: false,
};

export default NexusDatePicker;
