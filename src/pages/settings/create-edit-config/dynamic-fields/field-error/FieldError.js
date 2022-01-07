import React from 'react';
import PropTypes from 'prop-types';

const FieldError = ({error}) => {
    const getErrorMessage = () => {
        if (error?.length) {
            return error?.map(e => e.message)?.join('. ');
        }
        return error.message;
    };
    return error ? (
        <span className="p-error-message d-inline-flex align-items-center">
            <i className="pi pi-exclamation-circle mx-1" />
            {getErrorMessage()}
        </span>
    ) : null;
};
FieldError.propTypes = {
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

FieldError.defaultProps = {
    error: undefined,
};

export default FieldError;
