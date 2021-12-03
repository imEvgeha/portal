import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import config from 'react-global-configuration';
import InputForm from '../InputForm/InputForm';
import './UploadIngestButton.scss';

const TITLE = 'AVAIL INGEST';

const UploadIngestButton = ({ingestData, withModal, icon, uploadCallback}) => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const {openModal, closeModal} = useContext(NexusModalContext);
    const openModalCallback = useCallback((node, params) => openModal(node, params), []);
    const closeModalCallback = useCallback(() => closeModal(), []);

    const closeUploadModal = useCallback(() => {
        setFile(null);
        closeModalCallback();
    }, []);

    const browseClick = useCallback(() => {
        closeUploadModal();
        inputClick();
    }, [closeUploadModal]);

    const buildForm = useCallback(() => {
        return (
            <InputForm
                ingestData={ingestData}
                closeModal={closeUploadModal}
                file={file}
                browseClick={browseClick}
                openModalCallback={openModalCallback}
                closeModalCallback={closeModalCallback}
            />
        );
    }, [browseClick, closeUploadModal, file]);

    useEffect(() => {
        if (file && withModal) {
            openModalCallback(buildForm(), {title: TITLE, width: 'medium', shouldCloseOnOverlayClick: false});
        }
        if (file && uploadCallback) uploadCallback(file);
    }, [buildForm, file]);

    const inputClick = () => inputRef && inputRef.current && inputRef.current.click();

    const handleUpload = e => {
        const {files} = e.target;
        if (files && files.length > 0) {
            setFile(Array.from(files)[0]);
            e.target.value = null;
        } 
    };

    return (
        <div className={withModal ? "ingest-upload-with-border" : "ingest-upload"}>
            <input
                className="ingest-upload__input"
                type="file"
                accept={config.get('avails.upload.extensions')}
                ref={inputRef}
                onInput={handleUpload}
            />
            {ingestData ? (
                <button className="btn btn-primary" onClick={inputClick}>
                    Upload
                </button>
            ) : (
                <IconButton icon={icon} onClick={inputClick} label="Upload Ingest" />
            )}
        </div>
    );
};

UploadIngestButton.propTypes = {
    ingestData: PropTypes.object,
    withModal: PropTypes.bool,
    icon: PropTypes.any.isRequired,
    uploadCallback: PropTypes.func,
};

UploadIngestButton.defaultProps = {
    ingestData: null,
    withModal: false,
    uploadCallback: () => null,
};

export default UploadIngestButton;
