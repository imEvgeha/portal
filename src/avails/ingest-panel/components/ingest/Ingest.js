import React, {useState} from 'react';
import PropTypes from 'prop-types';
import IngestTitle from '../ingest-title/IngestTitle';
import Chevron from '../../../../assets/chevron-right.svg';
import IngestStatus from '../ingest-status/IngestStatus';
import IngestReport from '../ingest-report/IngestReport';
import './Ingest.scss';

const Ingest = ({ingestType, received, provider, attachment, selected, ingestClick}) => {
    const [showReport, setShowReport] = useState(false);
    const { link, status, ingestReport = {} } = attachment;

    const onChevronClick = e => {
        e.stopPropagation();
        setShowReport(!showReport);
    };

    return (
        <div className={`avail-ingest ${selected ? 'selected' : ''}`} onClick={ingestClick}>
            <IngestTitle provider={provider} link={link} ingestType={ingestType} />
            <div className='avail-ingest__details'>
                {
                    ingestReport &&
                    <span
                        className={`avail-ingest__details--${showReport ? 'open' : 'close'}`}
                        onClick={onChevronClick}>
                        <Chevron/>
                    </span>
                }
                <div className={`avail-ingest__details--status ${ingestReport ? '' : 'not-expandable'}`}>
                    <IngestStatus date={received} status={status} />
                </div>
            </div>
            {
                showReport && ingestReport && <IngestReport report={ingestReport} />
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
    ingestClick: PropTypes.func,
};

Ingest.defaultProps = {
    ingestType: '',
    received: '',
    provider: '',
    attachment: {},
    selected: false
};

export default Ingest;