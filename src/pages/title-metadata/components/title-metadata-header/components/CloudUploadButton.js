import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import CloudUploadIcon from '@vubiquity-nexus/portal-assets/action-cloud-upload.svg';
import config from 'react-global-configuration';
import {connect} from 'react-redux';
import './CloudUploadButton.scss';
import {uploadMetadata} from '../../../titleMetadataActions';

const CloudUploadButton = ({uploadMetadata, catalogueOwner}) => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);

    const inputClick = () => inputRef && inputRef.current && inputRef.current.click();

    useEffect(() => {
        if (file) uploadHandler();
    }, [file]);

    const uploadHandler = () => {
        const params = {
            tenantCode: catalogueOwner.toUpperCase(), // VU
            file,
        };
        uploadMetadata(params);
    };

    const handleUpload = e => {
        const {files} = e.target;
        if (files && files.length > 0) {
            setFile(Array.from(files)[0]);
            e.target.value = null;
        }
    };

    return (
        <div onClick={inputClick} className="cloud-upload-button">
            <input type="file" accept={config.get('avails.upload.extensions')} ref={inputRef} onInput={handleUpload} />
            <span className="cloud-upload-button__wrapper">
                <CloudUploadIcon />
            </span>
        </div>
    );
};

CloudUploadButton.propTypes = {
    uploadMetadata: PropTypes.func,
    catalogueOwner: PropTypes.string,
};

CloudUploadButton.defaultProps = {
    uploadMetadata: () => null,
    catalogueOwner: '',
};

const mapDispatchToProps = dispatch => ({
    uploadMetadata: payload => {
        return dispatch(uploadMetadata(payload));
    },
});

export default connect(null, mapDispatchToProps)(CloudUploadButton);
