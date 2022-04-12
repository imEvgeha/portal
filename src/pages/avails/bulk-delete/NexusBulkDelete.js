import React, {useState, useEffect, memo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {SimpleTag as Tag} from '@atlaskit/tag';
import {isEmpty} from 'lodash';
import {useParams} from 'react-router-dom';
import RightsURL from '../../legacy/containers/avail/util/RightsURL';
import BulkDeleteActions from './components/bulk-delete-actions/BulkDeleteActions';
import BulkDeleteAffectedRight from './components/bulk-delete-affected-right/BulkDeleteAffectedRight';
import BulkDeleteSelectedRight from './components/bulk-delete-selected-right/BulkDeleteSelectedRight';
import {SELECTED_RIGHTS, AFFECTED_RIGHTS, BULK_DELETE_REMAINING_MSG} from './constants';
import './NexusBulkDelete.scss';

export const NexusBulkDelete = ({rightsWithDeps, onClose, onSubmit, deletedRightsCount}) => {
    const [tableData, setTableData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const routeParams = useParams();

    useEffect(() => {
        if (!isEmpty(rightsWithDeps)) {
            setTableData(rightsWithDeps);
        }
    }, [rightsWithDeps]);

    const renderLinkableRightId = id => (
        <Button
            key={id}
            appearance="link"
            onClick={() => window.open(RightsURL.getRightUrl(id, undefined, routeParams.realm), '_blank')}
        >
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

    const onSubmitHandler = () => {
        setIsLoading(true);
        onSubmit(tableData);
    };

    const getSelectedRightsCount = rightsWithDeps => {
        return Object.values(rightsWithDeps).reduce(
            (acc, i) => (i.isSelected ? acc + i.dependencies.length + 1 : acc),
            0
        );
    };

    return (
        <div className="nexus-c-bulk-delete">
            <div className="nexus-c-bulk-delete__container">
                <div className="nexus-c-bulk-delete__message">
                    {BULK_DELETE_REMAINING_MSG(deletedRightsCount, Object.keys(rightsWithDeps).length)}
                </div>
                <div className="nexus-c-bulk-delete__heading">
                    <div className="nexus-c-bulk-delete__selected">{SELECTED_RIGHTS}</div>
                    <div className="nexus-c-bulk-delete__affected">{AFFECTED_RIGHTS}</div>
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
                                    {Object.values(tableData).map(
                                        value =>
                                            value.isSelected &&
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
                onSubmit={onSubmitHandler}
                rightsDeletionCount={getSelectedRightsCount(tableData)}
                isLoading={isLoading}
                isDisabled={getSelectedRightsCount(tableData) === 0}
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
