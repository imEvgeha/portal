// eslint-disable-next-line no-unused-vars
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import InlineEdit from '@atlaskit/inline-edit';
import {DatePicker} from '@atlaskit/datetime-picker';
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
    label,
    ...restProps,
}) => {
    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date placeholder based on locale
    const dateFormat = getDateFormatBasedOnLocale(locale);

    const DatePickerComponent = (isReadOnly) => (
        <div className="nexus-c-date-picker">
            {label &&
            <div className="nexus-c-date-picker__label">
                {label}
            </div>
            }
            {isReadOnly
                ? moment(value).format(dateFormat)
                : (
                    <div className="nexus-c-date-picker__date">
                        <DatePicker
                            id={id}
                            locale={locale}
                            onChange={date => onChange(moment(date).toISOString())}
                            defaultValue={value}
                            {...restProps}
                        />
                    </div>
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
                            <div className="nexus-c-date-picker__read-view-container">
                                {(moment(value).isValid() && moment(value).format(dateFormat))
                                    || 'Enter date'}
                            </div>
                        )}
                        editView={() => DatePickerComponent(false)}
                        defaultValue={value}
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
    isWithInlineEdit: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

NexusDatePicker.defaultProps = {
    label: '',
    value: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    onConfirm: () => null,
};

export default NexusDatePicker;
