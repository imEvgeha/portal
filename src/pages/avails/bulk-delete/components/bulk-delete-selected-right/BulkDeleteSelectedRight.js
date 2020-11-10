import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {RIGHT_ID, TITLE} from '../../constants';
import './BulkDeleteSelectedRight.scss';

const BulkDeleteSelectedRight = ({rightId, title, isSelected, renderLinkableRightId, onCheckedChanged}) => {
    return (
        <div className="nexus-c-bulk-delete-selected-right">
            <div className="nexus-c-bulk-delete-selected-right__id-row">
                <div className="nexus-c-bulk-delete-selected-right__checkbox">
                    <Checkbox isChecked={isSelected} onChange={() => onCheckedChanged(rightId)} />
                </div>
                <div className="nexus-c-bulk-delete-selected-right__id-label">{RIGHT_ID}</div>
                <div className="nexus-c-bulk-delete-selected-right__id">{renderLinkableRightId(rightId)}</div>
            </div>
            <div className="nexus-c-bulk-delete-selected-right__title-row">
                <div className="nexus-c-bulk-delete-selected-right__checkbox" />
                <div className="nexus-c-bulk-delete-selected-right__title-label">{TITLE}</div>
                <div className="nexus-c-bulk-delete-selected-right__title">{title}</div>
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
