import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import UploadIcon from '../../../../../../assets/action-upload.svg';
import {NexusModalContext} from '../../../../../../ui/elements/nexus-modal/NexusModal';
import NexusTooltip from '../../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import InputForm from '../InputForm/InputForm';

const TITLE = 'Avail Ingest';

const ReuploadIngestButton = ({attachment}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const buildForm = () => {
        return (
            <InputForm
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
};

export default ReuploadIngestButton;