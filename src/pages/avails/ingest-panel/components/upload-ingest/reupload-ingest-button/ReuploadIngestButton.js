import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import UploadIcon from '@vubiquity-nexus/portal-assets/action-upload.svg';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import InputForm from '../InputForm/InputForm';

const TITLE = 'Avail Ingest';

const ReuploadIngestButton = ({attachment, ingestData}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const buildForm = () => {
        return (
            <InputForm
                ingestData={ingestData}
                closeModal={closeModal}
                attachment={attachment}
                openModalCallback={openModal}
                closeModalCallback={closeModal}
            />
        );
    };

    const reUploadIngestFile = () => {
        openModal(buildForm(), {title: TITLE, width: 'small', shouldCloseOnOverlayClick: false});
    };

    return (
        <NexusTooltip content="Upload Attachment">
            <UploadIcon className="nexus-c-avails-ingest__upload-icon" onClick={reUploadIngestFile} />
        </NexusTooltip>
    );
};

ReuploadIngestButton.propTypes = {
    attachment: PropTypes.object.isRequired,
    ingestData: PropTypes.object,
};
ReuploadIngestButton.defaultProps = {
    ingestData: null,
};

export default ReuploadIngestButton;
