import React from 'react';
import PropTypes from 'prop-types';
import './TitleMetadataTableStatusBar.scss';

const TitleMetadataTableStatusBar = ({paginationData}) => {
    const {pageSize = 0, totalCount = 0} = paginationData || {};
    return (
        <div className="nexus-c-title-metadata-table-status-bar">
            <span className="nexus-c-title-metadata-table-status-bar__description">
                Rows:{' '}
                <span className="nexus-c-title-metadata-table-status-bar__value">
                    {pageSize} of {totalCount}
                </span>
            </span>
        </div>
    );
};

TitleMetadataTableStatusBar.propTypes = {
    paginationData: PropTypes.object,
};

TitleMetadataTableStatusBar.defaultProps = {
    paginationData: {},
};

export default TitleMetadataTableStatusBar;
