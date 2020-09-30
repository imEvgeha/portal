import React from 'react';
import PropTypes from 'prop-types';

const PublishErrors = ({setErrors, value}) => {
    const setErrorsData = () => setErrors(value);

    return value && value.length ? (
        <div className="nexus-c-sync-log-table__error-cell" onClick={setErrorsData}>
            Show Errors
        </div>
    ) : (
        ''
    );
};

PublishErrors.propTypes = {
    setErrors: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
};

export default PublishErrors;
