import React, {useState} from 'react';
import PropTypes from 'prop-types';
import IngestTitle from '../ingest-title/IngestTitle';
import Chevron from '../../../../assets/chevron-right.svg';
import IngestStatus from '../ingest-status/IngestStatus';
import IngestReport from '../ingest-report/IngestReport';
import './Ingest.scss';

const Ingest = ({received, attachment, selected, ingestClick, inBundle, ingestId}) => {
    const [showReport, setShowReport] = useState(false);
    const { link, status, ingestReport } = attachment;

    const onChevronClick = e => {
        e.stopPropagation();
        setShowReport(!showReport);
    };

    return (
        <div
            className={`nexus-c-avail-ingest ${selected ? 'nexus-c-avail-ingest--is-selected' : ''} ${inBundle? 'nexus-c-avail-ingest--is-in-bundle' : ''} `}
            onClick={ingestClick}
        >
            <IngestTitle link={link} />
            <div className='nexus-c-avail-ingest__details'>
                {
                    ingestReport && (
                    <span
                        className={`nexus-c-avail-ingest__chevron nexus-c-avail-ingest__chevron--is-${showReport ? 'opened' : 'closed'}`}
                        onClick={onChevronClick}
                    >
                        <Chevron />
                    </span>
                  )}
                <div className={`nexus-c-avail-ingest__status nexus-c-avail-ingest__status--is-${ingestReport ? 'expandable' : 'not-expandable'}`}>
                    <IngestStatus date={received} status={status} />
                </div>
            </div>
            {
                showReport && ingestReport && <IngestReport report={ingestReport} ingestId={ingestId} />
            }
        </div>
    );
};

Ingest.propTypes = {
    received: PropTypes.string,
    attachment: PropTypes.object,
    selected: PropTypes.bool,
    ingestClick: PropTypes.func,
    inBundle: PropTypes.bool,
    ingestId: PropTypes.string
};

Ingest.defaultProps = {
    received: '',
    attachment: {},
    selected: false,
    inBundle: false,
    ingestId: ''
};

export default Ingest;
