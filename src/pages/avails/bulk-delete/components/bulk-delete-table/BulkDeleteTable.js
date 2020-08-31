import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import DynamicTable from '@atlaskit/dynamic-table';
import './BulkDeleteTable.scss';

const BulkDeleteTable = ({
    rightKey,
    rightId,
    title,
    tableHeader,
    rows,
    isSelected,
    deselectRightForDeletion,
    renderLinkableRightId,
}) => {
    return (
        <div className="nexus-c-bulk-delete-table__data">
            <div className="nexus-c-bulk-delete-table__entry-header">
                <Checkbox isChecked={isSelected} onChange={() => deselectRightForDeletion(rightKey)} />
                <div className="nexus-c-bulk-delete-table__entry-title">{title}</div>
                {renderLinkableRightId(rightId)}
            </div>
            <DynamicTable head={tableHeader} rows={rows} defaultPage={1} loadingSpinnerSize="large" isLoading={false} />
        </div>
    );
};

BulkDeleteTable.propTypes = {
    rightKey: PropTypes.string,
    rightId: PropTypes.string,
    title: PropTypes.string,
    tableHeader: PropTypes.object,
    rows: PropTypes.array,
    isSelected: PropTypes.bool,
    deselectRightForDeletion: PropTypes.func,
    renderLinkableRightId: PropTypes.func,
};

BulkDeleteTable.defaultProps = {
    rightKey: '',
    rightId: '',
    title: '',
    tableHeader: null,
    rows: [],
    isSelected: false,
    deselectRightForDeletion: () => null,
    renderLinkableRightId: () => null,
};

export default BulkDeleteTable;
