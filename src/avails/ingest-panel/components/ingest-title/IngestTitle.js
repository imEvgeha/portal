import React from 'react';
import PropTypes from 'prop-types';
import File from '../../../../assets/file.svg';
import './IngestTitle.scss';

const IngestTitle = ({link, className}) => {
    const fileName = link.split('/').pop();
    return (
        <div className={className? `nexus-c-ingest-title nexus-c-ingest-title--${className}` : 'nexus-c-ingest-title'}>
            <div className='nexus-c-ingest-title__details'>
                <File className='nexus-c-ingest-title__type' />
                <span title={fileName} className='nexus-c-ingest-title__filename'>{fileName}</span>
            </div>
        </div>
    );
};

IngestTitle.propTypes = {
    link: PropTypes.string,
};

IngestTitle.defaultProps = {
    link: '',
};

export default IngestTitle;
