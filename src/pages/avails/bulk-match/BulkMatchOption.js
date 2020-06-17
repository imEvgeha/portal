import React from 'react';
import PropTypes from 'prop-types';
import {uniq} from 'lodash';
import classNames from 'classnames';
import './BulkMatchOption.scss';
import {NexusTooltip} from '../../../ui/elements';
import {WARNING_MSG, LABEL} from './bulkMatchConstants';

const BulkMatchOption = ({selectedRights = []}) => {

    const checkSelectedRights = () => {
        if (selectedRights.length <= 0) {
            return false;
        }

        // all rights have coreTitleId empty and same contentType
        const emptyCoreTitle = selectedRights.every(r => r.coreTitleId === null && r.contentType === selectedRights[0].contentType);
        if (!emptyCoreTitle) {
            return false;
        }

        // all rights have sourceRightId empty
        // OR all rights have sourceRightId NOT empty and all sourceRightIds are unique within selected rights
        const emptySourceRightId = selectedRights.every(r => r['sourceRightId'] === null);
        const notEmptySourceRightId = selectedRights.every(r => r['sourceRightId'] !== null);
        const sourceRightIds = selectedRights.map(r => r['sourceRightId']);

        return emptySourceRightId || (notEmptySourceRightId && uniq(sourceRightIds).length === selectedRights.length);
    };

    const addSpan = () => {
        return (
            <span
                className={classNames(
                    'nx-container-margin',
                    'table-top-text',
                    'nexus-c-bulk-match-option',
                    checkSelectedRights() && 'active-link'
                )}
            >
                {LABEL}
            </span>
        );
    };

    return (
        <NexusTooltip content={`${!checkSelectedRights() ? WARNING_MSG : ''}`}>
            {addSpan()}
        </NexusTooltip>
    );
};

BulkMatchOption.propTypes = {
    selectedRights: PropTypes.array.isRequired,
};

export default BulkMatchOption;
