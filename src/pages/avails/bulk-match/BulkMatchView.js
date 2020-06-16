import React from 'react';
import PropTypes from 'prop-types';
import {uniq} from 'lodash';
import './BulkMatchView.scss';

const BulkMatchView = ({selectedRights}) => {

    const checkSelectedRights = () => {
        // all rights have coreTitleId empty and same contentType
        const emptyCoreTitle = selectedRights.every(r => r.coreTitleId === null && r.contentType === selectedRights[0].contentType);
        if(!emptyCoreTitle){
            return false;
        }
        // all rights have sourceRightId empty
        // OR all rights have sourceRightId NOT empty and all sourceRightIds are unique within selected rights
        const emptySourceRightId = selectedRights.every(r => r['sourceRightId'] === null);
        const notEmptySourceRightId = selectedRights.every(r => r['sourceRightId'] !== null);
        const sourceRightIds = selectedRights.map(r => r['sourceRightId']);
        if(emptySourceRightId || (notEmptySourceRightId && uniq(sourceRightIds).length === selectedRights.length)){
            return true;
        }
        return false;
    };

    return (
        <span
            className={`
                nx-container-margin
                table-top-text
                nexus-c-bulk-match-view
                ${selectedRights.length > 0 && checkSelectedRights() ? 'active-link' :''}
            `}
        >
            Bulk Match Titles
        </span>
    );
};

BulkMatchView.propTypes = {
    selectedRights: PropTypes.array.isRequired,
};


export default BulkMatchView;
