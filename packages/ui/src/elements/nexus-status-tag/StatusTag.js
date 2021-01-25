import React from 'react';
import PropTypes from 'prop-types';
import Constants from './Constants';
import './StatusTag.scss';

const StatusTag = ({status}) => {
    const statusClassNameModifier = status.toLowerCase().replace(/_/g, '-');
    const statusText = Constants[status.toUpperCase()] || status.replace(/_/g, ' ');
    const statusStyle = Constants[status.toUpperCase()]
        ? `nexus-status-tag nexus-status-tag--${statusClassNameModifier}`
        : `nexus-status-tag nexus-status-tag--grey`;

    return statusText ? <div className={statusStyle}>{statusText}</div> : '';
};

StatusTag.propTypes = {
    status: PropTypes.string,
};

StatusTag.defaultProps = {
    status: '',
};

export default StatusTag;
