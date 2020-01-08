// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import InlineEdit from '@atlaskit/inline-edit';
import {DatePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form/Messages';
import moment from 'moment';
import {useIntl} from 'react-intl';
import {getDateFormatBasedOnLocale, parseSimulcast} from '../../../util/Common';
import './NexusDatePicker.scss';
import {RELATIVE_DATE_FORMAT, SIMULCAST_DATE_FORMAT} from '../constants';

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

    const DatePickerComponent = (isReadOnly) => (
        <>
            {label &&
                <>
                    {label}
                </>
            }
            {isReadOnly
                ? parseSimulcast(value, dateFormat)
                : (
                    <DatePicker
                        id={id}
                        locale={locale}
                        placeholder={dateFormat}
                        onChange={date => {
                            setDate(date);
                            onChange(
                                isTimestamp
                                    ? moment(date).toISOString()
                                    : `${moment(date).format(isSimulcast
                                        ? SIMULCAST_DATE_FORMAT
                                        : RELATIVE_DATE_FORMAT)
                                    }`
                            );
                        }}
                        defaultValue={moment(value).isValid() ? value : ''}
                        value={date}
                        {...restProps}
                    />
                )
            }
            {error &&
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            }
        </>
    );

    return (
        <>
            {isWithInlineEdit && !isReadOnly
                ? (
                    <InlineEdit
                        readView={() => (
                            <div className="nexus-c-date-picker__read-view-container">
                                {(moment(value).isValid() && parseSimulcast(value, dateFormat))
                                || <div className="read-view-container__placeholder">
                                    Enter date
                                </div>}
                            </div>
                        )}
                        editView={() => DatePickerComponent(false)}
                        defaultValue={moment(value).isValid() ? value : ''}
                        onConfirm={onConfirm}
                        readViewFitContainerWidth
                        {...restProps}
                    />
                )
                : DatePickerComponent(isReadOnly)
            }
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
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

NexusDatePicker.defaultProps = {
    label: '',
    value: '',
    error: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    isTimestamp: false,
    onConfirm: () => null,
};

export default NexusDatePicker;
