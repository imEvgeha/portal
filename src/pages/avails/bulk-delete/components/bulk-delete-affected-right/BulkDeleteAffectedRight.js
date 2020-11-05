import React from 'react';
import PropTypes from 'prop-types';
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
        <div className="nexus-c-bulk-delete-affected-entry" key={rightId}>
            <div className="nexus-c-bulk-delete__affected-linked-id-row">
                <div className="nexus-c-bulk-delete__affected-linked-id-label">Linked Right ID</div>
                <div className="nexus-c-bulk-delete__affected-linked-id">{renderLinkableRightId(rightId)}</div>
                <div className="nexus-c-bulk-delete__affected-linked-tag">{renderCustomTypeTag('TPR')}</div>
            </div>
            <div className="nexus-c-bulk-delete__affected-title-row">
                <div className="nexus-c-bulk-delete__affected-title-label">Title</div>
                <div className="nexus-c-bulk-delete__affected-title">{title}</div>
            </div>
            <div className="nexus-c-bulk-delete__affected-tpr-row">
                <div className="nexus-c-bulk-delete__affected-tpr-label">TPR Original Rights</div>
                <div className="nexus-c-bulk-delete__affected-tpr-ids">
                    {originalRightIds.map(id => (
                        <div className="nexus-c-bulk-delete__affected-tpr-id" key={id}>
                            {renderLinkableRightId(id)}
                        </div>
                    ))}
                </div>
            </div>
            <div className="nexus-c-bulk-delete__affected-bonus-row">
                <div className="nexus-c-bulk-delete__affected-bonus-label">Bonus Source Right</div>
                <div className="nexus-c-bulk-delete__affected-bonus-id">
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
