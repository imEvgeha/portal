import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './ModalCustomLabel.scss';

const ModalCustomLabel = ({isError, htmlFor, children}) => {
    return (
        <label
            className={classnames('nexus-c-modal-custom-label', {
                'nexus-c-modal-custom-label--is-error': isError,
            })}
            htmlFor={htmlFor}
        >
            {children}
        </label>
    );
};

ModalCustomLabel.propTypes = {
    isError: PropTypes.bool,
    htmlFor: PropTypes.string,
};

ModalCustomLabel.defaultProps = {
    isError: false,
    htmlFor: null,
};

export default ModalCustomLabel;
