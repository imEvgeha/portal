import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@atlaskit/icon/glyph/add';
import config from 'react-global-configuration';
import IconButton from '../../../../../../ui/atlaskit/icon-button/IconButton';
import {NexusModalContext} from '../../../../../../ui/elements/nexus-modal/NexusModal';
import InputForm from '../InputForm/InputForm';
import './UploadIngestButton.scss';

const TITLE = 'Avail Ingest';

const UploadIngestButton = ({ingestData}) => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const {openModal, closeModal} = useContext(NexusModalContext);

    const closeUploadModal = useCallback(() => {
        setFile(null);
        closeModal();
    }, [closeModal]);

    const browseClick = useCallback(() => {
        closeUploadModal();
        inputClick();
    }, [closeUploadModal]);

    const buildForm = useCallback(() => {
        return <InputForm ingestData={ingestData} closeModal={closeUploadModal} file={file} browseClick={browseClick} />;
    }, [browseClick, closeUploadModal, file, ingestData]);

    useEffect(() => {
        if (file) {
            openModal(buildForm(), TITLE,'small');
        }
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
        <div className="ingest-upload">
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
                <IconButton icon={AddIcon} onClick={inputClick} label="Upload Ingest" />
            )}
        </div>
    );
};

UploadIngestButton.propTypes = {
    ingestData: PropTypes.object,
};

UploadIngestButton.defaultProps = {
    ingestData: null,
};

export default UploadIngestButton;
