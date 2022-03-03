import React from 'react';
import PropTypes from 'prop-types';

const StatusLogErrors = ({setErrors, data}) => {
    const {errors} = data;

    const value = errors ? errors.map(item => `${item.errorType} - ${item.description}`) : [];
    const setErrorsData = () => setErrors(value);

    return value && value.length ? (
        <div className="nexus-c-status-log-table__error-cell" onClick={setErrorsData}>
            <h3>...</h3>
        </div>
    ) : (
        ''
    );
};

StatusLogErrors.propTypes = {
    setErrors: PropTypes.func.isRequired,
    data: PropTypes.object,
};

StatusLogErrors.defaultProps = {
    data: {},
};

export default StatusLogErrors;
