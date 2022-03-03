import React from 'react';
import PropTypes from 'prop-types';

const StatusLogErrors = ({errorsSet, data}) => {
    const {errors} = data;

    const value = errors ? errors.map(item => `${item.errorType} - ${item.description}`) : [];
    const setEr = () => errorsSet(value);

    return value && value.length ? (
        <div className="nexus-c-status-log-table__error-cell" onClick={setEr}>
            <h3>...</h3>
        </div>
    ) : (
        ''
    );
};

StatusLogErrors.propTypes = {
    errorsSet: PropTypes.func.isRequired,
    data: PropTypes.object,
};

StatusLogErrors.defaultProps = {
    data: {},
};

export default StatusLogErrors;
