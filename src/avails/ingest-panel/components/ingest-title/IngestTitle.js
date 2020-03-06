import React from 'react';
import PropTypes from 'prop-types';
import File from '../../../../assets/file.svg';
import './IngestTitle.scss';

const IngestTitle = ({link}) => {
    const fileName = link.split('/').pop();
    return (
        <div className='nexus-c-ingest-title'>
            <div className='nexus-c-ingest-title__details'>
                <File className='nexus-c-ingest-title__type' />
                <span title={fileName} className='nexus-c-ingest-title__filename'>{fileName}</span>
            </div>
        </div>
    );
};

IngestTitle.propTypes = {
    provider: PropTypes.string,
    link: PropTypes.string,
    ingestType: PropTypes.string,
};

IngestTitle.defaultProps = {
    provider: '',
    link: '',
    ingestType: '',
};

export default IngestTitle;
