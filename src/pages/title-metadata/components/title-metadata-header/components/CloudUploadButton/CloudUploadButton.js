import React, {useRef, useState} from 'react';
import CloudUploadIcon from '@vubiquity-nexus/portal-assets/action-cloud-upload.svg';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import config from 'react-global-configuration';
import './CloudUploadButton.scss';

const CloudUploadButton = () => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);

    const inputClick = () => inputRef && inputRef.current && inputRef.current.click();

    const handleUpload = e => {
        const {files} = e.target;
        if (files && files.length > 0) {
            setFile(Array.from(files)[0]);
            e.target.value = null;
        }
    };

    return (
        <div className="cloud-upload-button">
            <input type="file" accept={config.get('avails.upload.extensions')} ref={inputRef} onInput={handleUpload} />
            <IconButton icon={CloudUploadIcon} onClick={inputClick} label="Upload Emmet" />
        </div>
    );
};

export default CloudUploadButton;
