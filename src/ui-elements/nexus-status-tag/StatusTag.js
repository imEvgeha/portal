import React from 'react';
import PropTypes from 'prop-types';
import Constants from './Constants';
import './StatusTag.scss';

function StatusTag({status}) {
    return (
        <div className={`nexus-status-tag ${status.toLowerCase()}`}>
            {Constants[status]}
        </div>
    );
}

StatusTag.propTypes = {
    status: PropTypes.string,
};

StatusTag.defaultProps = {
    status: '',
};

export default StatusTag;