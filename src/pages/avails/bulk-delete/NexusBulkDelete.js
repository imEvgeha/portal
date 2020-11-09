import React, {useState, useEffect, memo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tag from '@atlaskit/tag';
import {isEmpty} from 'lodash';
import RightsURL from '../../legacy/containers/avail/util/RightsURL';
import BulkDeleteActions from './components/bulk-delete-actions/BulkDeleteActions';
import BulkDeleteAffectedRight from './components/bulk-delete-affected-right/BulkDeleteAffectedRight';
import BulkDeleteSelectedRight from './components/bulk-delete-selected-right/BulkDeleteSelectedRight';
import {BULK_DELETE_REMAINING_MSG} from './constants';
import './NexusBulkDelete.scss';

export const NexusBulkDelete = ({rightsWithDeps, onClose, onSubmit, deletedRightsCount}) => {
    const [tableData, setTableData] = useState({});

    useEffect(() => {
        if (!isEmpty(rightsWithDeps)) {
            setTableData(rightsWithDeps);
        }
    }, [rightsWithDeps]);

    const renderLinkableRightId = id => (
        <Button key={id} appearance="link" onClick={() => window.open(RightsURL.getRightUrl(id), '_blank')}>
            {id}
        </Button>
    );

    const renderCustomTypeTag = text => (
        <div className="nexus-c-bulk-delete__tag">
            <Tag text={text} color="greyLight" />
        </div>
    );

    const deselectRightsForDeletion = key => {
        const selectedRight = tableData[key];
        selectedRight.isSelected = !selectedRight.isSelected;
        setTableData({...tableData});
    };

    const getSelectedRightsCount = rightsWithDeps => {
        return Object.values(rightsWithDeps).reduce((acc, i) => acc + i.dependencies.length + 1, 0);
    };

    return (
        <div className="nexus-c-bulk-delete">
            <div className="nexus-c-bulk-delete__container">
                <div className="nexus-c-bulk-delete__message">
                    {BULK_DELETE_REMAINING_MSG(deletedRightsCount, Object.keys(rightsWithDeps).length)}
                </div>
                <div className="nexus-c-bulk-delete__heading">
                    <div className="nexus-c-bulk-delete__selected">Selected Rights</div>
                    <div className="nexus-c-bulk-delete__affected">Affected Rights</div>
                </div>
                <div className="nexus-c-bulk-delete__results">
                    <div className="nexus-c-bulk-delete__rights">
                        {!isEmpty(tableData) && (
                            <>
                                <div className="nexus-c-bulk-delete__selected-wrapper">
                                    {Object.keys(tableData).map(key => (
                                        <BulkDeleteSelectedRight
                                            key={key}
                                            rightId={key}
                                            title={rightsWithDeps[key].original.title}
                                            isSelected={rightsWithDeps[key].isSelected}
                                            renderLinkableRightId={renderLinkableRightId}
                                            onCheckedChanged={deselectRightsForDeletion}
                                        />
                                    ))}
                                </div>
                                <div className="nexus-c-bulk-delete__affected-wrapper">
                                    {Object.values(tableData).map(value =>
                                        value.dependencies.map(depRight => {
                                            return (
                                                <BulkDeleteAffectedRight
                                                    key={depRight.id}
                                                    rightId={depRight.id}
                                                    sourceRightId={depRight.sourceRightId}
                                                    originalRightIds={depRight.originalRightIds}
                                                    title={depRight.title}
                                                    renderLinkableRightId={renderLinkableRightId}
                                                    renderCustomTypeTag={renderCustomTypeTag}
                                                />
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <BulkDeleteActions
                onClose={onClose}
                onSubmit={onSubmit}
                rightsDeletionCount={getSelectedRightsCount(tableData)}
            />
        </div>
    );
};

NexusBulkDelete.propTypes = {
    rightsWithDeps: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    deletedRightsCount: PropTypes.number,
};

NexusBulkDelete.defaultProps = {
    rightsWithDeps: {},
    onClose: () => null,
    onSubmit: () => null,
    deletedRightsCount: 0,
};

export default memo(NexusBulkDelete);
