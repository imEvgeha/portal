import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import { downloadFile } from '@vubiquity-nexus/portal-utils/lib/Common';
import {Button} from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { exportService } from '../../../../../legacy/containers/avail/service/ExportService';
import DownloadEmetModal from '../DownloadEmetModal/DownloadEmetModal';
import './CloudDownloadButton.scss';
import { createInitialValues } from '../utils';
import { cancelButton, downloadButton, downloadFormFields } from '../constants';

const CloudDownloadButton = ({showSuccess}) => {
    const initialValues = createInitialValues(downloadFormFields);
    const [displayModal, setDisplayModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const isDisabled = values ? !Object.values(values).every(value => Boolean(value) === true) : true;

    const openModal = () => setDisplayModal(true);
    const closeModal = () => setDisplayModal(false);

    const handleDownload = () => {
        exportService
            .bulkExportMetadata(values)
            .then(response => {
                const buffer = new Uint8Array(response.value).buffer;
                const buftype = 'application/vnd.ms-excel;charset=utf-8';
                const blob = new Blob([buffer], {type: buftype});
                showSuccess();
                closeModal()
                downloadFile(blob, 'Editorial_Metadata');
            }).catch(err => err)
    };

    const renderFooter = () => {
        return (
            <div className="nexus-c-download-emet-modal__buttons">
                <Button
                    onClick={() => {
                        closeModal();
                    }}
                    className="p-button-outlined p-button-secondary nexus-c-cancel-button"
                    label={cancelButton}
                />
                <Button
                    label={downloadButton}
                    onClick={handleDownload}
                    className="p-button-outlined nexus-c-download-emet-modal__button"
                    disabled={isDisabled}
                />
            </div>
        );
    }

    return (
        <div className="nexus-c-button-cloud-download">
            <Button
                icon={CloudDownloadIcon}
                onClick={openModal}
                tooltip='Download'
                className="p-button-text"
                tooltipOptions={{position: 'bottom'}}
            />
            <Dialog header="Download" visible={displayModal} style={{ width: '50vw' }} footer={renderFooter()} onHide={closeModal}>
                <DownloadEmetModal closeModal={closeModal} showSuccess={showSuccess} values={values} setValues={setValues} />
            </Dialog>
        </div>
    );
};

CloudDownloadButton.propTypes = {
    showSuccess: PropTypes.func.isRequired,
};

export default CloudDownloadButton;
