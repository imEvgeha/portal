import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../../Constants';
import Email from '../../../../assets/email.svg';
import File from '../../../../assets/file.svg';
import StatusInfo from '../../../../assets/status-info.svg';
import './IngestTitle.scss';

const IngestTitle = ({provider, link, ingestType}) => {
    const fileName = link.split('/').pop();
    const {ingestTypes: {UPLOAD}} = Constants;
    return (
        <div className='nexus-c-ingest-title'>
            <div className='nexus-c-ingest-title__details'>
                {
                    ingestType === UPLOAD ? <File className='nexus-c-ingest-title__type'/> : (
                        <React.Fragment>
                            <Email className='nexus-c-ingest-title__type'/>
                            <span className='nexus-c-ingest-title__provider'>{provider}</span>
                            <span className='nexus-c-ingest-title__separator'>|</span>
                        </React.Fragment>
                    )
                }
                <span title={fileName} className='nexus-c-ingest-title__filename'>{fileName}</span>
                <StatusInfo/>
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