import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import UploadIcon from '../../../../../../assets/action-upload.svg';
import {NexusModalContext} from '../../../../../../ui/elements/nexus-modal/NexusModal';
import NexusTooltip from '../../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import InputForm from '../InputForm/InputForm';

const TITLE = 'Avail Ingest';

const ReuploadIngestButton = ({attachment}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const openModalCallback = useCallback((node, params) => openModal(node, params), []);
    const closeModalCallback = useCallback(() => closeModal(), []);

    const closeUploadModal = useCallback(() => {
        closeModalCallback();
    }, []);

    const buildForm = () => {
        return (
            <InputForm
                closeModal={closeUploadModal}
                attachment={attachment}
                openModalCallback={openModalCallback}
                closeModalCallback={closeModalCallback}
            />
        );
    };

    const reUploadIngestFile = () => {
        openModal(buildForm(), {title: TITLE, width: 'small', shouldCloseOnOverlayClick: false});
    };

    return (
        <NexusTooltip content="Upload Attachment">
            <UploadIcon className="nexus-c-avails-ingest__download-icon" onClick={reUploadIngestFile} />
        </NexusTooltip>
    );
};

ReuploadIngestButton.propTypes = {
    attachment: PropTypes.object.isRequired,
};

export default ReuploadIngestButton;
