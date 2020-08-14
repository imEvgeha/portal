import React from 'react';
import PropTypes from 'prop-types';
import Constants from './Constants';
import './StatusTag.scss';

const StatusTag = ({status}) => {
    const statusClassNameModifier = status.toLowerCase().replace(/_/g, '-');
    return <div className={`nexus-status-tag nexus-status-tag--${statusClassNameModifier}`}>{Constants[status]}</div>;
};

StatusTag.propTypes = {
    status: PropTypes.string,
};

StatusTag.defaultProps = {
    status: '',
};

export default StatusTag;
