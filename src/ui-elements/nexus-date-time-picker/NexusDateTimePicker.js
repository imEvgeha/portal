// eslint-disable-next-line no-unused-vars
import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useIntl} from 'react-intl';
import Select from '@atlaskit/select';
import InlineEdit from '@atlaskit/inline-edit';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import {getDateFormatBasedOnLocale} from '../../util/Common';
import './NexusDateTimePicker.scss';

// TODO: Move to a separate file for constants
const RELATIVE_TIME_LABEL = 'Relative';
const SIMULCAST_TIME_LABEL = 'Simulcast (UTC)';
const TIME_FORMAT = ' h:mm A';

const NexusDateTimePicker = ({
    id,
    isWithInlineEdit,
    isReadOnly,
    isLocalDate,
    onChange,
    onConfirm,
    value,
    label,
    ...restProps,
}) => {
    const [isUTC, setIsUTC] = useState(!isLocalDate);

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date format based on locale
    const dateFormat = getDateFormatBasedOnLocale(locale)
        .toUpperCase()
        .concat(TIME_FORMAT);

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
                                value={value}
                                isUTC={isUTC}
                                defaultValue={isUTC ? value : moment(value).local().format(dateFormat)}
                                {...restProps}
                            />
                        </div>
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
                                ?`${moment(value).utc(!isUTC).format(dateFormat)}
                                 ${isUTC ? ' (UTC)' : ''}`
                                : <div className="read-view-container__placeholder">
                                        {`Enter ${name}`}
                                </div>}
                            </div>
                        )}
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
    onConfirm: PropTypes.func,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

NexusDateTimePicker.defaultProps = {
    label: '',
    value: '',
    isWithInlineEdit: false,
    isReadOnly: false,
    isLocalDate: false,
};

export default NexusDateTimePicker;
