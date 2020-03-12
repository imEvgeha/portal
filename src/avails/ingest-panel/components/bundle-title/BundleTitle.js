import React from 'react';
import PropTypes from 'prop-types';
import Folder from '../../../../assets/folder.svg';
import './BundleTitle.scss';

let BundleTitle = ({provider, totalAttachments}) => {
    return (
        <div className='nexus-c-bundle-title'>
            <div className='nexus-c-bundle-title__details'>
                <Folder className='nexus-c-bundle-title__folder' />
                <span className='nexus-c-bundle-title__provider'>{provider}</span>
                <span className='nexus-c-bundle-title__separator'>|</span>
                <span className='nexus-c-bundle-title__total-attachments'>{totalAttachments} Files</span>
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