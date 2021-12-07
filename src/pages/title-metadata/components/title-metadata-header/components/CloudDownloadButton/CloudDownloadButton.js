import React, {useContext} from 'react';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import DownloadEmetModal from '../DownloadEmetModal/DownloadEmetModal';
import './CloudDownloadButton.scss';

const CloudDownloadButton = () => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const handleOpenModal = () => {
        openModal(<DownloadEmetModal closeModal={closeModal} />, {title: 'Download', width: 'medium'});
    };

    return (
        <div className="cloud-download-button">
            <IconButton icon={CloudDownloadIcon} onClick={handleOpenModal} label="Download Emmet" />
        </div>
    );
};

export default CloudDownloadButton;
