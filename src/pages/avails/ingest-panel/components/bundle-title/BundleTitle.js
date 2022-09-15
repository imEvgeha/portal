import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import './BundleTitle.scss';

const BundleTitle = ({licensor, totalAttachments}) => (
    <div className="nexus-c-bundle-title">
        <div className="nexus-c-bundle-title__details">
            <i className="po po-folder nexus-c-bundle-title__folder" />
            <div className="nexus-c-bundle-title__licensor-and-count">
                <span className="nexus-c-bundle-title__licensor">{licensor}</span>
                <Badge>{totalAttachments}</Badge>
            </div>
        </div>
    </div>
);

BundleTitle.propTypes = {
    licensor: PropTypes.string,
    totalAttachments: PropTypes.number,
};

BundleTitle.defaultProps = {
    licensor: '',
    totalAttachments: 0,
};

export default BundleTitle;
