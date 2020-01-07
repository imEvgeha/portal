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
        <div className='ingest-title'>
            <span className='ingest-title__details'>
                {
                    ingestType === UPLOAD ? <File className='ingest-title__details--type'/> : (
                        <React.Fragment>
                            <Email className='ingest-title__details--type'/>
                            <span className='ingest-title__details--provider'>{provider}</span>
                            <span className='ingest-title__details--separator'>|</span>
                        </React.Fragment>
                    )
                }
                <span className='ingest-title--filename'>{fileName}</span>
            </span>
            <StatusInfo/>
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