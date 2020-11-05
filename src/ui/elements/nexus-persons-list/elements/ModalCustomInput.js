import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './ModalCustomInput.scss';

const ModalCustomInput = ({isError, isReadOnly, onChange, placeholder, name, value}) => {
    return isReadOnly ? (
        <input
            className={classnames('nexus-c-modal-custom-input nexus-c-modal-custom-input--read-only', {
                'nexus-c-modal-custom-input--isError': isError,
            })}
            name={name}
            value={value}
            readOnly
            disabled
        />
    ) : (
        <input
            className={classnames('nexus-c-modal-custom-input', {
                'nexus-c-modal-custom-input--isError': isError,
            })}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

ModalCustomInput.propTypes = {
    isError: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
};

ModalCustomInput.defaultProps = {
    isError: false,
    isReadOnly: false,
    onChange: () => null,
    placeholder: null,
    name: null,
    value: null,
};

export default ModalCustomInput;
