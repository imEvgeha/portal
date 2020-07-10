import React from 'react';

const PublishErrors = ({setErrors, value}) => {
    const setErrorsData = () => setErrors(value);

    return (
        (value && value.length) ? (
            <div className='nexus-c-sync-log-table__error-cell' onClick={setErrorsData}>
                Show Errors
            </div>
        ) : ''
    );
};

export default PublishErrors;