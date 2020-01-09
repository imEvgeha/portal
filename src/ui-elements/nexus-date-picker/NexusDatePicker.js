// eslint-disable-next-line no-unused-vars
import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import InlineEdit from '@atlaskit/inline-edit';
import {DatePicker} from '@atlaskit/datetime-picker';
import {ErrorMessage} from '@atlaskit/form/Messages';
import moment from 'moment';
import {useIntl} from 'react-intl';
import {getDateFormatBasedOnLocale} from '../../util/Common';
import './NexusDatePicker.scss';

const NexusDatePicker = ({
    id,
    isWithInlineEdit,
    isReadOnly,
    onChange,
    onConfirm,
    value,
    error,
    label,
    ...restProps
}) => {
    const [date, setDate] = useState(value || '');

    useEffect(() => setDate(value || ''), [value]);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date placeholder based on locale
    const dateFormat = getDateFormatBasedOnLocale(locale);

    const DatePickerComponent = (isReadOnly) => (
        <>
            {label &&
                <>
                    {label}
                </>
            }
            {isReadOnly
                ? moment(value).format(dateFormat)
                : (
                    <DatePicker
                        id={id}
                        locale={locale}
                        placeholder={dateFormat}
                        onChange={date => {
                            setDate(date);
                            onChange(moment(date).toISOString());
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
                                {(moment(value).isValid() && moment(value).format(dateFormat))
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
    onConfirm: () => null,
};

export default NexusDatePicker;
