import React from 'react';
import PropTypes from 'prop-types';

const Status = ({value}) => {
    return <div>{value?.length ? 'Error' : 'Success'}</div>;
};

Status.propTypes = {
    value: PropTypes.array.isRequired,
};

export default Status;
