import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {download} from '../../../util/Common';
import {DOWNLOAD, JSON_MIME} from './constants';

const NexusDownload = ({data, filename, mimeType, label}) => {
    const handleDownload = () => {
        download(JSON.stringify(data), filename, mimeType);
    };

    return (
        <Button onClick={handleDownload}>{label}</Button>
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
