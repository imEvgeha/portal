// eslint-disable-next-line no-unused-vars
import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import NexusSimpleDateTimePicker from '../nexus-simple-date-time-picker/NexusSimpleDateTimePicker';
import Select from '@atlaskit/select';
import InlineEdit from '@atlaskit/inline-edit';
import './NexusDateTimePicker.scss';

// TODO: Move to a separate file for constants
const RELATIVE_TIME_LABEL = 'Relative';
const SIMULCAST_TIME_LABEL = 'Simulcast (UTC)';

const NexusDateTimePicker = ({
    id,
    isEdit,
    onChange,
    onConfirm,
    value,
    label,
    ...restProps,
}) => {
    const [isUTC, setIsUTC] = useState(false);
    const DatePicker = (
        <div className="nexus-c-date-time-picker">
            {label &&
            <div className="nexus-c-date-time-picker__label">
                {label}
            </div>
            }
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
                    defaultValue={{label: RELATIVE_TIME_LABEL, value: false}}
                    options={[
                        {label: RELATIVE_TIME_LABEL, value: false},
                        {label: SIMULCAST_TIME_LABEL, value: true},
                    ]}
                    onChange={type => setIsUTC(type.value)}
                />
            </div>
        </div>
    );

    return (
        <>
            {isEdit
                ? (
                    <InlineEdit
                        readView={() => value || `Enter ${label}`}
                        editView={() => DatePicker}
                        defaultValue={value}
                        onConfirm={onConfirm}
                        readViewFitContainerWidth
                        {...restProps}
                    />
                )
                : DatePicker
            }
        </>
    );
};

NexusDateTimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    id: PropTypes.string.isRequired,
    isEdit: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
};

NexusDateTimePicker.defaultProps = {
    label: '',
    isEdit: false,
};

export default NexusDateTimePicker;
