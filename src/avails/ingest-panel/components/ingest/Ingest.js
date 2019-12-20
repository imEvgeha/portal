import React, {useState} from 'react';
import PropTypes from 'prop-types';
import IngestTitle from '../ingest-title/IngestTitle';
import Chevron from '../../../../assets/chevron-right.svg';
import IngestStatus from '../ingest-status/IngestStatus';
import IngestReport from '../ingest-report/IngestReport';
import './Ingest.scss';

const Ingest = ({ingestType, received, provider, attachment, selected}) => {
    const { link, status, ingestReport = {} } = attachment;
    const [showReport, setShowReport] =useState(false);
    return (
        <div className={`avail-ingest ${selected ? 'selected' : ''}`}>
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
        </div>
    );
};

Ingest.propTypes = {
    ingestType: PropTypes.string,
    received: PropTypes.string,
    provider: PropTypes.string,
    attachment: PropTypes.object,
    selected: PropTypes.bool,
};

Ingest.defaultProps = {
    ingestType: '',
    received: '',
    provider: '',
    attachment: {},
    selected: false
};

export default Ingest;