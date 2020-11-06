import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import './BulkDeleteSelectedRight.scss';

const BulkDeleteSelectedRight = ({rightId, title, isSelected, renderLinkableRightId, onCheckedChanged}) => {
    return (
        <div className="nexus-c-bulk-delete__selected-right">
            <div className="nexus-c-bulk-delete__selected-right-id-row">
                <div className="nexus-c-bulk-delete__checkbox">
                    <Checkbox isChecked={isSelected} onChange={() => onCheckedChanged(rightId)} />
                </div>
                <div className="nexus-c-bulk-delete__selected-right-id-label">Right ID</div>
                <div className="nexus-c-bulk-delete__selected-right-id">{renderLinkableRightId(rightId)}</div>
            </div>
            <div className="nexus-c-bulk-delete__selected-right-title-row">
                <div className="nexus-c-bulk-delete__checkbox" />
                <div className="nexus-c-bulk-delete__selected-right-title-label">Title</div>
                <div className="nexus-c-bulk-delete__selected-title">{title}</div>
            </div>
        </div>
    );
};

BulkDeleteSelectedRight.propTypes = {
    rightId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    renderLinkableRightId: PropTypes.func,
    onCheckedChanged: PropTypes.func,
};

BulkDeleteSelectedRight.defaultProps = {
    renderLinkableRightId: () => null,
    onCheckedChanged: () => null,
};

export default BulkDeleteSelectedRight;
