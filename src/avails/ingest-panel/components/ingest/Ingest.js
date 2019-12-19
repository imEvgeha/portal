import React, {useState} from 'react';
import PropTypes from 'prop-types';
import IngestTitle from '../ingest-title/IngestTitle';
import Chevron from '../../../../assets/chevron-right.svg';
import IngestStatus from '../ingest-status/IngestStatus';
import IngestReport from '../ingest-report/IngestReport';
import './Ingest.scss';

const Ingest = ({ingestType, received, provider, attachment}) => {
    const { link, status, ingestReport = {} } = attachment;
    const [showReport, setShowReport] =useState(false);
    return (
        <div className='avail-ingest'>
            <IngestTitle provider={provider} link={link} ingestType={ingestType} />
            <div className='avail-ingest__details'>
                <span
                    className={`avail-ingest__details--${showReport ? 'open' : 'close' }`}
                    onClick={() => setShowReport(!showReport)}>
                    <Chevron/>
                </span>
                <IngestStatus date={received} status={status} />
            </div>
            {
                showReport && <IngestReport report={ingestReport} />
            }
            {
                ingestReport.errorDetails && (
                    <div className='avail-ingest__error-message'>
                        {ingestReport.errorDetails}
                    </div>
                )
            }
        </div>
    );
};

Ingest.propTypes = {
    ingestType: PropTypes.string,
    received: PropTypes.string,
    provider: PropTypes.string,
    attachment: PropTypes.object,
};

Ingest.defaultProps = {
    ingestType: '',
    received: '',
    provider: '',
    attachment: {},
};

export default Ingest;