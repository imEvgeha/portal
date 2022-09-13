import React, {useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BundleTitle from '../bundle-title/BundleTitle';
import IngestStatus from '../ingest-status/IngestStatus';
import Ingest from '../ingest/Ingest';
import './Bundle.scss';

const Bundle = ({id, ingestType, received, licensor, attachments, selectedAttachmentId, ingestClick, emailSubject}) => {
    const [showIngests, setShowIngests] = useState(false);
    const onBundleClick = () => setShowIngests(!showIngests);

    // Sorted by updatedAt
    const attachmentsSortedByUpdatedAt =
        attachments.sort(
            (a, b) =>
                b &&
                a &&
                moment.utc(b.updatedAt ? b.updatedAt : received).diff(moment.utc(a.updatedAt ? a.updatedAt : received))
        ) || [];

    return (
        <div className="nexus-c-avail-bundle">
            <div className="nexus-c-avail-bundle__cell" onClick={onBundleClick}>
                <BundleTitle licensor={licensor} totalAttachments={attachments.length} />
                <div className="nexus-c-avail-bundle__details">
                    <span
                        className={`nexus-c-avail-bundle__chevron nexus-c-avail-bundle__chevron--is-${
                            showIngests ? 'opened' : 'closed'
                        }`}
                        onClick={onBundleClick}
                    >
                        <i className="po po-chevron-right" />
                    </span>
                    <IngestStatus date={received} ingestType={ingestType} />
                </div>
            </div>
            {showIngests && (
                <div className="nexus-c-avail-bundle__ingests">
                    {attachmentsSortedByUpdatedAt.map(attachment => (
                        <Ingest
                            key={attachment.id}
                            attachment={attachment}
                            received={attachment.updatedAt || received}
                            licensor={licensor}
                            ingestType={ingestType}
                            ingestClick={() =>
                                ingestClick({
                                    availHistoryId: id,
                                    attachmentId: attachment.id,
                                    selectedAttachmentId,
                                })
                            }
                            isSelected={selectedAttachmentId === attachment.id}
                            ingestId={id}
                            isInBundle
                            emailSubject={emailSubject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

Bundle.propTypes = {
    id: PropTypes.string,
    ingestType: PropTypes.string,
    received: PropTypes.string,
    licensor: PropTypes.string,
    attachments: PropTypes.array,
    selectedAttachmentId: PropTypes.string,
    ingestClick: PropTypes.func,
    emailSubject: PropTypes.string,
};

Bundle.defaultProps = {
    id: '',
    ingestType: '',
    received: '',
    licensor: '',
    attachments: [],
    selectedAttachmentId: '',
    ingestClick: () => null,
    emailSubject: '',
};

export default Bundle;
