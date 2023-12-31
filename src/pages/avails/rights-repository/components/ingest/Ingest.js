import React from 'react';
import PropTypes from 'prop-types';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {NexusTooltip} from '../../../../../ui/elements';
import IngestReport from '../../../ingest-panel/components/ingest-report/IngestReport';
import IngestStatus from '../../../ingest-panel/components/ingest-status/IngestStatus';
import IngestTitle from '../../../ingest-panel/components/ingest-title/IngestTitle';
import ReuploadIngestButton from '../../../ingest-panel/components/upload-ingest/reupload-ingest-button/ReuploadIngestButton';
import Constants from '../../../ingest-panel/constants';
import './Ingest.scss';

const Ingest = ({ingest, filterByStatus, attachment, deselectIngest, downloadIngestEmail, downloadIngestFile}) => {
    const {attachments = [{}], ingestType, received, id} = ingest;
    const {id: attachmentId, link, status, ingestReport = {}} = attachment;
    const {
        attachmentTypes: {EMAIL},
    } = Constants;
    const emails = attachments.filter(a => a.attachmentType && a.attachmentType === EMAIL);

    let renderIngestId = ingest.id;
    if (ingest.dopProjectId) {
        const uri = `/index.html?launchApp=Projects&projectId=${ingest.dopProjectId}`;
        const url = getApiURI('dopPortal', uri, 0, 'dopExternal');
        renderIngestId = (
            <a href={url} target="_blank">
                {ingest.id}
            </a>
        );
    }

    return (
        ingest && (
            <div className="nexus-c-avails-ingest">
                <div className="nexus-c-avails-ingest__cross-icon">
                    <i className="po po-remove nexus-c-avails-ingest__cross-circle" onClick={deselectIngest} />
                </div>
                <div className="nexus-c-avails-ingest__details">
                    <IngestTitle ingestType={ingestType} link={link} isHeader />
                    <IngestStatus status={status} date={received} ingestType={ingestType} />
                    <div className="nexus-c-avails-ingest__avail-id">Avail History ID: {renderIngestId}</div>
                </div>
                <div className="nexus-c-avails-ingest__stats">
                    <IngestReport
                        attachmentId={attachmentId}
                        report={ingestReport}
                        isShowingError={false}
                        filterClick={filterByStatus}
                        ingestId={id}
                    />
                    {emails.map(email => (
                        <div key={email.id} className="nexus-c-avails-ingest__email">
                            <NexusTooltip content="Download Email">
                                <i
                                    key={email.id}
                                    className="po po-email nexus-c-avails-ingest__email-icon"
                                    onClick={() => downloadIngestEmail(email)}
                                />
                            </NexusTooltip>
                        </div>
                    ))}
                    <div className="nexus-c-avails-ingest__download">
                        {status === 'FAILED' && <ReuploadIngestButton ingestData={ingest} attachment={attachment} />}
                        <NexusTooltip content="Download Attachment">
                            <i
                                className="po po-download nexus-c-avails-ingest__download-icon"
                                onClick={() => downloadIngestFile(attachment)}
                            />
                        </NexusTooltip>
                    </div>
                </div>
            </div>
        )
    );
};

Ingest.propTypes = {
    ingest: PropTypes.object,
    attachment: PropTypes.object,
    filterByStatus: PropTypes.func,
    deselectIngest: PropTypes.func,
    downloadIngestEmail: PropTypes.func,
    downloadIngestFile: PropTypes.func,
};

Ingest.defaultProps = {
    ingest: {attachments: [{}]},
    attachment: {ingestReport: {}},
    filterByStatus: () => null,
    deselectIngest: () => null,
    downloadIngestEmail: () => null,
    downloadIngestFile: () => null,
};

export default Ingest;
