import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import StatusTag from '../../../../../ui/elements/nexus-status-tag/StatusTag';
import UploadIcon from '@atlaskit/icon/glyph/upload';
import EmailIcon from '@atlaskit/icon/glyph/email';
import './IngestStatus.scss';

const IngestStatus = ({date, status, ingestType}) => {
    const dateFormatted = date && moment(date).format('ddd, MMM D, YYYY | hh:mm:ss A');
    return (
        <div className='ingest-status'>
            <div>
                <span className='ingest-status__date'>{dateFormatted}</span>
                {ingestType && (
                    <span className='ingest-status__type' title={`Ingest via ${ingestType}`}>
                        {ingestType === 'Upload' ? <UploadIcon size="small" /> : <EmailIcon size="small" />}
                    </span>
                  )}
            </div>
            {status && <StatusTag status={status} />}
        </div>
    );
};

IngestStatus.propTypes = {
    date: PropTypes.string,
    status: PropTypes.string,
    ingestType: PropTypes.string,
};

IngestStatus.defaultProps = {
    date: '',
    status: '',
    ingestType: '',
};

export default IngestStatus;
