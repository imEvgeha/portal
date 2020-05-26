import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {saveAs} from 'file-saver';
import {DOWNLOAD, JSON_MIME} from './constants';

const NexusDownload = ({data, filename, mimeType, label, ...restProps}) => {
    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(data)], {type: mimeType});
        saveAs(blob, filename);
    };

    return (
        <Button
            className="nexus-c-download"
            onClick={handleDownload}
            {...restProps}
        >
            {label}
        </Button>
    );
};

NexusDownload.propTypes = {
    data: PropTypes.object.isRequired,
    filename: PropTypes.string.isRequired,
    mimeType: PropTypes.string,
    label: PropTypes.string,
};

NexusDownload.defaultProps = {
    label: DOWNLOAD,
    mimeType: JSON_MIME,
};

export default NexusDownload;
