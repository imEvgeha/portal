import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import constants from '../../constants';
import IngestReport from '../ingest-report/IngestReport';
import IngestStatus from '../ingest-status/IngestStatus';
import IngestTitle from '../ingest-title/IngestTitle';
import './Ingest.scss';

const Ingest = ({received, attachment, isSelected, ingestClick, isInBundle, ingestId, ingestType, emailSubject}) => {
    const [showReport, setShowReport] = useState(false);
    const {id, link, status, ingestReport} = attachment;
    const {
        ingestTypes: {EMAIL},
    } = constants;

    const onChevronClick = e => {
        e.stopPropagation();
        setShowReport(!showReport);
    };

    return (
        <div
            className={classnames(
                'nexus-c-avail-ingest',
                isSelected && 'nexus-c-avail-ingest--is-selected',
                isInBundle && 'nexus-c-avail-ingest--is-in-bundle'
            )}
            onClick={ingestClick}
        >
            <IngestTitle link={link} />
            <div className="nexus-c-avail-ingest__details">
                {ingestReport && (
                    <span
                        className={`nexus-c-avail-ingest__chevron nexus-c-avail-ingest__chevron--is-${
                            showReport ? 'opened' : 'closed'
                        }`}
                        onClick={onChevronClick}
                    >
                        <i className="po po-chevron-right" />
                    </span>
                )}
                <div
                    className={classnames(
                        'nexus-c-avail-ingest__status',
                        `nexus-c-avail-ingest__status--is-${ingestReport ? 'expandable' : 'not-expandable'}`
                    )}
                >
                    <IngestStatus date={received} status={status} ingestType={ingestType} />
                    {ingestType === EMAIL && showReport && emailSubject ? (
                        <div className="nexus-c-avail-ingest__status--subject">Subject: {emailSubject}</div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            {showReport && ingestReport && (
                <IngestReport key={id} attachmentId={id} report={ingestReport} ingestId={ingestId} />
            )}
        </div>
    );
};

Ingest.propTypes = {
    received: PropTypes.string,
    attachment: PropTypes.object,
    isSelected: PropTypes.bool,
    ingestClick: PropTypes.func,
    ingestType: PropTypes.string,
    isInBundle: PropTypes.bool,
    ingestId: PropTypes.string,
    emailSubject: PropTypes.string,
};

Ingest.defaultProps = {
    received: '',
    attachment: {},
    isSelected: false,
    ingestClick: () => null,
    ingestType: '',
    isInBundle: false,
    ingestId: '',
    emailSubject: '',
};

export default Ingest;
