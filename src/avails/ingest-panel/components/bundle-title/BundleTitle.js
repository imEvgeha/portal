import React from 'react';
import PropTypes from 'prop-types';
import Folder from '../../../../assets/folder.svg';
import './BundleTitle.scss';

const BundleTitle = ({provider, totalAttachments}) => {
    return (
        <div className='bundle-title'>
            <div className='bundle-title__details'>
                <Folder className='bundle-title__details--folder'/>
                <span className='ingest-title__details--provider'>{provider}</span>
                <span className='ingest-title__details--separator'>|</span>
                <span className='ingest-title__details--totalAttachments'>{totalAttachments} Files</span>
            </div>
        </div>
    );
};

BundleTitle.propTypes = {
    provider: PropTypes.string,
    totalAttachments: PropTypes.number
};

BundleTitle.defaultProps = {
    provider: '',
    totalAttachments: 0
};

export default BundleTitle;