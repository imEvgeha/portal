import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {download} from '../../../../util/Common';
import {DOWNLOAD, JSON_MIME} from '../../eventManagementConstants';

const EventSectionDownload = ({data, filename}) => {
    const handleDownload = () => {
        download(JSON.stringify(data), filename, JSON_MIME);
    };

    return (
        <Button onClick={handleDownload}>{DOWNLOAD}</Button>
    );
};

EventSectionDownload.propTypes = {
    data: PropTypes.object.isRequired,
    filename: PropTypes.string.isRequired,
};

export default EventSectionDownload;
