import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';
import config from 'react-global-configuration';
import './NexusUploadButton.scss';

const NexusUploadButton = ({title, buttonTitle, ingestData, modalCallback, icon, uploadCallback, modalContext}) => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const contextFromModal = useContext(modalContext);
    const {openModal, closeModal} = contextFromModal || {openModal: () => null, closeModal: () => null};
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

    const modalCallbackData = {ingestData, closeUploadModal, file, browseClick, openModalCallback, closeModalCallback};

    useEffect(() => {
        if (file && modalCallback) {
            openModalCallback(modalCallback(modalCallbackData), {
                title,
                width: 'medium',
                shouldCloseOnOverlayClick: false,
            });
        }
        if (file && uploadCallback) uploadCallback(file);
    }, [file]);

    const inputClick = () => inputRef && inputRef.current && inputRef.current.click();

    const handleUpload = e => {
        const {files} = e.target;
        if (files && files.length > 0) {
            setFile(Array.from(files)[0]);
            e.target.value = null;
        }
    };

    return (
        <div className={modalCallback(modalCallbackData) === undefined ? 'ingest-upload-with-border' : 'ingest-upload'}>
            <input
                className="ingest-upload__input"
                type="file"
                accept={config.get('avails.upload.extensions')}
                ref={inputRef}
                onInput={handleUpload}
            />
            {ingestData ? (
                <button className="btn btn-primary" onClick={inputClick}>
                    {buttonTitle}
                </button>
            ) : (
                <Button
                    className="p-button-text"
                    icon={icon}
                    onClick={inputClick}
                    tooltip="Upload"
                    tooltipOptions={{position: 'bottom'}}
                />
            )}
        </div>
    );
};

NexusUploadButton.propTypes = {
    title: PropTypes.string,
    buttonTitle: PropTypes.string,
    ingestData: PropTypes.object,
    modalCallback: PropTypes.func,
    icon: PropTypes.any.isRequired,
    uploadCallback: PropTypes.func,
    modalContext: PropTypes.any,
};

NexusUploadButton.defaultProps = {
    title: '',
    buttonTitle: 'Upload',
    ingestData: null,
    modalCallback: () => null,
    uploadCallback: () => null,
    modalContext: {},
};

export default NexusUploadButton;
