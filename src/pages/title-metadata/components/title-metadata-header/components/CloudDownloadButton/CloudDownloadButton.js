import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import DownloadEmetModal from '../DownloadEmetModal/DownloadEmetModal';
import './CloudDownloadButton.scss';

const CloudDownloadButton = ({showSuccess}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const handleOpenModal = () => {
        openModal(<DownloadEmetModal closeModal={closeModal} showSuccess={showSuccess} />, {
            title: 'Download',
            width: 'medium',
        });
    };

    return (
        <div className="nexus-c-button-cloud-download">
            <IconButton icon={CloudDownloadIcon} onClick={handleOpenModal} label="Download" />
        </div>
    );
};

CloudDownloadButton.propTypes = {
    showSuccess: PropTypes.func.isRequired,
};

export default CloudDownloadButton;
