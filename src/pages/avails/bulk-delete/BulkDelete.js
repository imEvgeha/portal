import React, {useState, useEffect, memo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import Tag from '@atlaskit/tag';
import RightsURL from '../../legacy/containers/avail/util/RightsURL';
import {getLinkedToOriginalRights} from '../availsService';
import {
    HEADER,
    BULK_DELETE_WARNING_MSG,
    BULK_DELETE_LINKED_RIGHT_MSG,
    BULK_DELETE_CONTINUE_MSG,
    BULK_DELETE_BTN_DELETE,
    BULK_DELETE_BTN_CANCEL,
    DEFAULT_PAGE_SIZE,
} from './constants';
import './BulkDelete.scss';

export const BulkDelete = ({rights, onClose}) => {
    const [dependentRights, setDependentRights] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const rightIds = rights.map(right => right.id);
        const fetchData = async () => {
            const rightsWithSourceRightId = await getLinkedToOriginalRights(
                {sourceRightId: rightIds},
                DEFAULT_PAGE_SIZE
            );
            const rightsWithOriginalRightIds = await getLinkedToOriginalRights(
                {originalRightIds: rightIds},
                DEFAULT_PAGE_SIZE
            );
            setDependentRights([...rightsWithSourceRightId.data, ...rightsWithOriginalRightIds.data]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (dependentRights.length) {
            setTableData(prepareTableData(dependentRights));
        }
    }, [dependentRights]);

    const renderLinkableRightId = id => (
        <Button appearance="link" onClick={() => window.open(RightsURL.getRightUrl(id), '_blank')}>
            {id}
        </Button>
    );

    const getDependentRows = foundDeps => {
        return foundDeps.map(item => {
            const {title, id, originalRightIds, sourceRightId} = item || {};
            return {
                key: `${id}-${title}`,
                cells: [
                    {
                        key: `${id}-linkedRights`,
                        content: title,
                        width: 30,
                    },
                    {
                        key: `${id}-rightID`,
                        content: renderLinkableRightId(id),
                        width: 15,
                    },
                    {
                        key: `${id}-type`,
                        content: sourceRightId ? (
                            <Tag text="Bonus" color="greyLight" />
                        ) : (
                            <Tag text="TPR" color="greyLight" />
                        ),
                        width: 10,
                    },
                    {
                        key: `${id}-originalRight`,
                        content: originalRightIds.map(item => renderLinkableRightId(item)),
                        width: 25,
                    },
                    {
                        key: `${id}-sourceRight`,
                        content: renderLinkableRightId(sourceRightId),
                        width: 20,
                    },
                ],
            };
        });
    };

    const prepareTableData = dependentRights => {
        const dependencyRights = [];
        rights.map(right => {
            const foundDependency = dependentRights.filter(
                dep => dep.sourceRightId === right.id || dep.originalRightIds.includes(right.id)
            );
            if (foundDependency && foundDependency.length) {
                return dependencyRights.push({
                    [right.id]: {
                        original: right,
                        dependencies: [...foundDependency],
                        isSelected: true,
                        rows: getDependentRows(foundDependency),
                    },
                });
            }
            return null;
        });
        return dependencyRights;
    };
    return (
        <div className="nexus-c-bulk-delete">
            <div className="nexus-c-bulk-delete__message">{BULK_DELETE_WARNING_MSG}</div>
            <div className="nexus-c-bulk-delete__container">
                {!!tableData.length && (
                    <div className="nexus-c-bulk-delete__table">
                        <div className="nexus-c-bulk-delete__table-header">{BULK_DELETE_LINKED_RIGHT_MSG}</div>
                        {tableData.map(entry => {
                            return Object.entries(entry).map(([key, value]) => {
                                return (
                                    <div className="nexus-c-bulk-delete__table-data" key={value.original.id}>
                                        <div>
                                            {value.original.title} {renderLinkableRightId(value.original.id)}
                                        </div>
                                        <DynamicTable
                                            head={HEADER}
                                            rows={value.rows}
                                            defaultPage={1}
                                            loadingSpinnerSize="large"
                                            isLoading={false}
                                        />
                                    </div>
                                );
                            });
                        })}
                    </div>
                )}
            </div>
            <div className="nexus-c-bulk-delete__continue">{BULK_DELETE_CONTINUE_MSG}</div>
            <div className="nexus-c-bulk-delete__btn-wrapper">
                <Button
                    appearance="subtle"
                    onClick={onClose}
                    className="nexus-c-bulk-delete__cancel-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_CANCEL}
                </Button>
                <Button
                    appearance="primary"
                    onClick={() => null}
                    className="nexus-c-bulk-delete__delete-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_DELETE}
                </Button>
            </div>
        </div>
    );
};

BulkDelete.propTypes = {
    rights: PropTypes.array,
    onClose: PropTypes.func,
};

BulkDelete.defaultProps = {
    rights: [],
    onClose: () => null,
};

export default memo(BulkDelete);
