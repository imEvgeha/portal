// eslint-disable-next-line no-unused-vars
import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import Select from '@atlaskit/select';
import InlineEdit from '@atlaskit/inline-edit';
import './NexusDateTimePicker.scss';
import moment from 'moment';
import {useIntl} from 'react-intl';

// TODO: Move to a separate file for constants
const RELATIVE_TIME_LABEL = 'Relative';
const SIMULCAST_TIME_LABEL = 'Simulcast (UTC)';
const TIME_FORMAT = ' h:mm A';

const NexusDateTimePicker = ({
    id,
    isWithInlineEdit,
    isReadOnly,
    isLocalDate,
    displayTimeInReadView,
    onChange,
    onConfirm,
    value,
    label,
    ...restProps,
}) => {
    const [isUTC, setIsUTC] = useState(isLocalDate);
    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date format based on locale
    const dateFormat = moment()
        .locale(locale)
        .localeData()
        .longDateFormat('L')
        .concat(displayTimeInReadView ? TIME_FORMAT : '')
        .toUpperCase();

    const DatePicker = (isReadOnly) => (
        <div className="nexus-c-date-time-picker">
            {label &&
                <div className="nexus-c-date-time-picker__label">
                    {label}
                </div>
            }
            {isReadOnly
                ? moment(value).format(dateFormat)
                : (
                    <>
                        <div className="nexus-c-date-time-picker__date-time">
                            <NexusSimpleDateTimePicker
                                id={id}
                                onChange={onChange}
                                isUTC={isUTC}
                                defaultValue={value}
                                {...restProps}
                            />
                        </div>
                        <div className="nexus-c-date-time-picker__type-select">
                            <Select
                                defaultValue={
                                    isLocalDate
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
                        readView={() => moment(value).format(dateFormat) || `Enter ${label}`}
                        editView={() => DatePicker(false)}
                        defaultValue={value}
                        onConfirm={onConfirm}
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
    displayTimeInReadView: PropTypes.bool,
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

NexusDateTimePicker.defaultProps = {
    label: '',
    value: '',
    displayTimeInReadView: false,
    isWithInlineEdit: false,
    isReadOnly: false,
    isLocalDate: false,
};

export default NexusDateTimePicker;
