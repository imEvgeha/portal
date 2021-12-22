import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {exportService} from '../../../../../legacy/containers/avail/service/ExportService';
import DownloadEmetModal from '../DownloadEmetModal/DownloadEmetModal';
import './CloudDownloadButton.scss';
import {createInitialValues} from '../utils';
import {cancelButton, downloadButton, downloadFormFields} from '../constants';

const CloudDownloadButton = ({showSuccess, showError}) => {
    const initialValues = createInitialValues(downloadFormFields);
    const [displayModal, setDisplayModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const isDisabled = values ? !Object.values(values).every(value => Boolean(value) === true) : true;

    const openModal = () => setDisplayModal(true);
    const closeModal = () => setDisplayModal(false);

    const handleDownload = () => {
        closeModal();
        exportService
            .bulkExportMetadata(values)
            .then(response => {
                const buffer = new Uint8Array(response.value).buffer;
                const buftype = 'application/vnd.ms-excel;charset=utf-8';
                const blob = new Blob([buffer], {type: buftype});
                showSuccess();
                downloadFile(blob, 'Editorial_Metadata');
            })
            .catch(err => showError(err.message));
    };

    const renderFooter = () => {
        return (
            <div className="nexus-c-download-emet-modal__buttons">
                <Button
                    onClick={closeModal}
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
    };

    return (
        <div className="nexus-c-button-cloud-download">
            <Button
                icon={CloudDownloadIcon}
                onClick={openModal}
                tooltip="Download"
                className="p-button-text"
                tooltipOptions={{position: 'bottom'}}
            />
            <Dialog
                header="Download"
                visible={displayModal}
                style={{width: '35vw', minWidth: '505px'}}
                footer={renderFooter()}
                onHide={closeModal}
                className="nexus-c-button-dialog-for-emet-download"
            >
                <DownloadEmetModal
                    values={values}
                    setValues={setValues}
                />
            </Dialog>
        </div>
    );
};

CloudDownloadButton.propTypes = {
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
};

export default CloudDownloadButton;
