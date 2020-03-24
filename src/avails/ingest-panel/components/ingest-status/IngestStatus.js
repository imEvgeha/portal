import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import StatusTag from '../../../../ui/elements/nexus-status-tag/StatusTag';
import './IngestStatus.scss';

const IngestStatus = ({date, status}) => {
    const dateFormatted = date && moment(date).format('ddd, MMM D, YYYY | hh:mm:ss A');
    return (
        <div className='ingest-status'>
            <span className='ingest-status__date'>{dateFormatted}</span>
            {status && <StatusTag status={status} />}
        </div>
    );
};

IngestStatus.propTypes = {
    date: PropTypes.string,
    status: PropTypes.string,
};

IngestStatus.defaultProps = {
    date: '',
    status: '',
};

export default IngestStatus;
