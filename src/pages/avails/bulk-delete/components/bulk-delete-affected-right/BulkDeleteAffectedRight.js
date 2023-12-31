import React from 'react';
import PropTypes from 'prop-types';
import {TITLE, LINKED_RIGHT_ID, TPR_ORIGINAL_RIGHTS, BONUS_SOURCE_RIGHT} from '../../constants';
import './BulkDeleteAffectedRight.scss';

const BulkDeleteAffectedRight = ({
    rightId,
    sourceRightId,
    originalRightIds,
    title,
    renderLinkableRightId,
    renderCustomTypeTag,
}) => {
    return (
        <div className="nexus-c-bulk-delete-affected-right">
            <div className="nexus-c-bulk-delete-affected-right__linked-id-row">
                <div className="nexus-c-bulk-delete-affected-right__linked-id-label">{LINKED_RIGHT_ID}</div>
                <div className="nexus-c-bulk-delete-affected-right__linked-id">{renderLinkableRightId(rightId)}</div>
                <div className="nexus-c-bulk-delete-affected-right__linked-tag">
                    {renderCustomTypeTag(sourceRightId ? 'Bonus' : 'TPR')}
                </div>
            </div>
            <div className="nexus-c-bulk-delete-affected-right__title-row">
                <div className="nexus-c-bulk-delete-affected-right__title-label">{TITLE}</div>
                <div className="nexus-c-bulk-delete-affected-right__title">{title}</div>
            </div>
            <div className="nexus-c-bulk-delete-affected-right__tpr-row">
                <div className="nexus-c-bulk-delete-affected-right__tpr-label">{TPR_ORIGINAL_RIGHTS}</div>
                <div className="nexus-c-bulk-delete-affected-right__tpr-ids">
                    {originalRightIds.map(id => (
                        <div className="nexus-c-bulk-delete-affected-right__tpr-id" key={id}>
                            {renderLinkableRightId(id)}
                        </div>
                    ))}
                </div>
            </div>
            <div className="nexus-c-bulk-delete-affected-right__bonus-row">
                <div className="nexus-c-bulk-delete-affected-right__bonus-label">{BONUS_SOURCE_RIGHT}</div>
                <div className="nexus-c-bulk-delete-affected-right__bonus-id">
                    {sourceRightId ? renderLinkableRightId(sourceRightId) : null}
                </div>
            </div>
        </div>
    );
};

BulkDeleteAffectedRight.propTypes = {
    rightId: PropTypes.string.isRequired,
    sourceRightId: PropTypes.string,
    originalRightIds: PropTypes.array,
    title: PropTypes.string,
    renderLinkableRightId: PropTypes.func,
    renderCustomTypeTag: PropTypes.func,
};

BulkDeleteAffectedRight.defaultProps = {
    sourceRightId: '',
    originalRightIds: [],
    title: '',
    renderLinkableRightId: () => null,
    renderCustomTypeTag: () => null,
};

export default BulkDeleteAffectedRight;
