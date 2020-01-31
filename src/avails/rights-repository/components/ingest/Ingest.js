import React from 'react';
import PropTypes from 'prop-types';
import IngestTitle from '../../../ingest-panel/components/ingest-title/IngestTitle';
import IngestStatus from '../../../ingest-panel/components/ingest-status/IngestStatus';
import IngestReport from '../../../ingest-panel/components/ingest-report/IngestReport';
import DownloadIcon from '../../../../assets/action-download.svg';
import Email from '../../../../assets/email.svg';
import CrossCircle from '../../../../assets/action-cross-circle.svg';
import './Ingest.scss';
import Constants from '../../../ingest-panel/constants';
import NexusTooltip from '../../../../ui-elements/nexus-tooltip/NexusTooltip';
import {historyService} from '../../../../containers/avail/service/HistoryService';

const Ingest = ({ingest, filterByStatus, attachment, deselectIngest}) => {
    const {attachments = [{}], ingestType, provider, received} = ingest;
    const {link, status, ingestReport = {}} = attachment;
    const {attachmentTypes: {EMAIL}} = Constants;
    const emails = attachments.filter(a => a.attachmentType && a.attachmentType === EMAIL);

    const getDownloadLink = (email) => {
        if (!email.id) return;

        let filename = 'Unknown';
        if (email.link) {
            filename = email.link.split(/(\\|\/)/g).pop();
        }

        historyService.getAvailHistoryAttachment(email.id)
            .then(response => {
                if (response && response.data && response.data.downloadUrl) {
                    const link = document.createElement('a');
                    link.href = response.data.downloadUrl;
                    link.setAttribute('download', filename);
                    link.click();
                }
            })
            .catch(() => {
                this.setState({
                    errorMessage: 'Download Failed. Url not available.'
                });
            });
    }

    return ingest ? (
        <div className='nexus-c-avails-ingest'>
            <div className='nexus-c-avails-ingest__cross-icon'>
                <CrossCircle onClick={deselectIngest} />
            </div>
            <div className='nexus-c-avails-ingest__details'>
                <IngestTitle
                    ingestType={ingestType}
                    provider={provider}
                    link={link}
                />
                <IngestStatus
                    status={status}
                    date={received}
                />
            </div>
            <div className='nexus-c-avails-ingest__stats'>
                <IngestReport
                    report={ingestReport}
                    showErrorMessage={false}
                    filterClick={filterByStatus}
                />
                {emails.map(email =>
                    <div className='nexus-c-avails-ingest__email'>
                        <NexusTooltip content='Download Email'>
                            <Email key={email.id} onClick={() => getDownloadLink(email)} />
                        </NexusTooltip>
                    </div>
                )}
                <div className='nexus-c-avails-ingest__download'>
                    <NexusTooltip content='Download Attachment'>
                        <DownloadIcon />
                    </NexusTooltip>
                </div>
            </div>
        </div>
    ) : null;
};

Ingest.propTypes = {
    ingest: PropTypes.object,
    filterByStatus: PropTypes.func,
    deselectIngest: PropTypes.func
};

Ingest.defaultProps = {
    ingest: {attachments: [{}]},
    filterByStatus: () => null,
    deselectIngest: () => null
};

export default Ingest;
