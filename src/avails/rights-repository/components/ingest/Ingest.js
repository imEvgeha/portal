import React from 'react';
import PropTypes from 'prop-types';
import IngestTitle from '../../../ingest-panel/components/ingest-title/IngestTitle';
import IngestStatus from '../../../ingest-panel/components/ingest-status/IngestStatus';
import IngestReport from '../../../ingest-panel/components/ingest-report/IngestReport';
import DownloadIcon from '../../../../assets/action-download.svg';
import './Ingest.scss';

const Ingest = ({ingest, filterByStatus}) => {
    const {attachments = [{}], ingestType, provider, received} = ingest;
    const { link, status, ingestReport = {} } = attachments[0];
    return ingest ? (
        <div className='nexus-c-avails-ingest'>
            <div className='nexus-c-avails-ingest__details'>
                <IngestTitle ingestType={ingestType} provider={provider} link={link}/>
                <IngestStatus status={status} date={received} />
            </div>
            <div className='nexus-c-avails-ingest__stats'>
                <IngestReport report={ingestReport} showErrorMessage={false} filterClick={filterByStatus} />
                <div className='nexus-c-avails-ingest__download'>
                    <DownloadIcon />
                </div>
            </div>
        </div>
    ) : null;
};

Ingest.propTypes = {
    ingest: PropTypes.object,
    filterByStatus: PropTypes.func,
};

Ingest.defaultProps = {
    ingest: { attachments: [{}] },
    filterByStatus: () => null
};

export default Ingest;