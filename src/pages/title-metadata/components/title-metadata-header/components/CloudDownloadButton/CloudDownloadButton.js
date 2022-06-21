import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog} from '@portal/portal-components';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {exportService} from '../../../../../legacy/containers/avail/service/ExportService';
import DownloadEmetModal from '../DownloadEmetModal/DownloadEmetModal';
import './CloudDownloadButton.scss';
import {createInitialValues} from '../utils';
import {
    cancelButton,
    downloadButton,
    downloadFormFields,
    failureDownloadDesc,
    successDownloadDesc,
    successDownloadingStarted,
} from '../constants';

const CloudDownloadButton = ({showSuccess}) => {
    const initialValues = createInitialValues(downloadFormFields);
    const [displayModal, setDisplayModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const isDisabled = values ? !Object.values(values).every(value => Boolean(value) === true) : true;

    const openModal = () => setDisplayModal(true);
    const closeModal = () => {
        setDisplayModal(false);
        setValues(initialValues);
    };

    const handleDownload = () => {
        closeModal();
        showSuccess(successDownloadingStarted);
        exportService.bulkExportMetadata(values, {errorMessage: failureDownloadDesc}).then(response => {
            showSuccess(successDownloadDesc);
            downloadFile(response, 'Editorial_Metadata');
        });
    };

    const renderFooter = () => {
        return (
            <div>
                <Button onClick={closeModal} className="p-button-outlined p-button-secondary" label={cancelButton} />
                <Button
                    label={downloadButton}
                    onClick={handleDownload}
                    className="p-button-outlined"
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
                closable={false}
            >
                <DownloadEmetModal values={values} setValues={setValues} />
            </Dialog>
        </div>
    );
};

CloudDownloadButton.propTypes = {
    showSuccess: PropTypes.func,
};

CloudDownloadButton.defaultProps = {
    showSuccess: () => null,
};

export default CloudDownloadButton;
