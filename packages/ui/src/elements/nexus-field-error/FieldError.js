import React from 'react';
import PropTypes from 'prop-types';

const FieldError = ({error, isAbsolute}) => {
    const getErrorMessage = () => {
        if (error?.length) {
            return error?.map(e => e.message)?.join('. ');
        }
        return error.message;
    };
    return error ? (
        <span className={`p-error-message ${isAbsolute && 'p-error-absolute'} d-inline-flex align-items-center`}>
            <i className="pi pi-exclamation-circle mx-1" />
            {getErrorMessage()}
        </span>
    ) : null;
};
FieldError.propTypes = {
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isAbsolute: PropTypes.bool,
};

FieldError.defaultProps = {
    error: undefined,
    isAbsolute: false,
};

export default FieldError;
