import React from 'react';
import PropTypes from 'prop-types';
import LoadingEllipsis from '@vubiquity-nexus/portal-assets/img/ajax-loader.gif';
import Constants from './StatusConstants';
import './StatusIcon.scss';

const StatusIcon = ({status, title}) => {
    const {COMPLETED, FAILED, MANUAL, PENDING} = Constants;
    const className = `status-${status.toLowerCase()}`;
    if (status) {
        switch (status) {
            case COMPLETED:
                return (
                    <span className={className}>
                        <i className="fas fa-check-circle" />
                    </span>
                );
            case FAILED:
                return (
                    <span title={title} className={className}>
                        <i className="fas fa-exclamation-circle" />
                    </span>
                );
            case MANUAL:
                return (
                    <span className={className}>
                        <i className="fas fa-circle"> </i>
                    </span>
                );
            case PENDING:
                return <img className="status-img" alt="Pending" src={LoadingEllipsis} />;
            default:
                return status;
        }
    }
    return '';
};

StatusIcon.propTypes = {
    status: PropTypes.string,
    title: PropTypes.string,
};

StatusIcon.defaultProps = {
    status: '',
    title: '',
};

export default StatusIcon;
