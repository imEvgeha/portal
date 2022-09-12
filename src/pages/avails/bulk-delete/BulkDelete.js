import React, {useState, useEffect, memo} from 'react';
import PropTypes from 'prop-types';
import {SimpleTag as Tag} from '@atlaskit/tag';
import {Button} from '@portal/portal-components';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import RightsURL from '../../legacy/containers/avail/util/RightsURL';
import {getLinkedRights, clearLinkedRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import BulkDeleteActions from './components/bulk-delete-actions/BulkDeleteActions';
import BulkDeleteTable from './components/bulk-delete-table/BulkDeleteTable';
import {HEADER, BULK_DELETE_WARNING_MSG, BULK_DELETE_LINKED_RIGHT_MSG} from './constants';
import './BulkDelete.scss';

export const BulkDelete = ({rights, onClose, rightsWithDeps, getLinkedRights, clearLinkedRights}) => {
    const [tableData, setTableData] = useState({});
    const routeParams = useParams();

    useEffect(() => {
        if (rights.length) {
            getLinkedRights({rights});
        }
        return () => {
            clearLinkedRights();
        };
    }, [rights, getLinkedRights]);

    useEffect(() => {
        if (!isEmpty(rightsWithDeps)) {
            insertTableRowsData(rightsWithDeps);
        }
    }, [rightsWithDeps]);

    const renderLinkableRightId = id => (
        <Button
            key={id}
            label={id}
            className="p-button-link"
            onClick={() => window.open(RightsURL.getRightUrl(id, undefined, routeParams.realm), '_blank')}
        />
    );

    const renderCustomTypeTag = text => (
        <div className="nexus-c-bulk-delete__tag">
            <Tag text={text} color="greyLight" />
        </div>
    );

    const getDependentRows = dependencies => {
        return dependencies.map(item => {
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
                        content: renderCustomTypeTag(sourceRightId ? 'Bonus' : 'TPR'),
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

    const deselectRightForDeletion = key => {
        const selectedRight = tableData[key];
        selectedRight.isSelected = !selectedRight.isSelected;
        setTableData({...tableData});
    };

    const insertTableRowsData = rightsWithDeps => {
        const rightsKeys = Object.keys(rightsWithDeps);
        const rightsWithRows = {...rightsWithDeps};
        rightsKeys.forEach(key => {
            rightsWithRows[key].rows = getDependentRows(rightsWithRows[key].dependencies);
        });
        setTableData(rightsWithRows);
    };

    return (
        <div className="nexus-c-bulk-delete">
            <div className="nexus-c-bulk-delete__message">{BULK_DELETE_WARNING_MSG}</div>
            <div className="nexus-c-bulk-delete__container">
                {!isEmpty(tableData) && (
                    <div className="nexus-c-bulk-delete__table">
                        <div className="nexus-c-bulk-delete__table-header">{BULK_DELETE_LINKED_RIGHT_MSG}</div>
                        {Object.entries(tableData).map(([key, value]) => {
                            return (
                                <BulkDeleteTable
                                    key={key}
                                    rightKey={key}
                                    rightId={value.original.id}
                                    title={value.original.title}
                                    tableHeader={HEADER}
                                    rows={value.rows}
                                    isSelected={value.isSelected}
                                    deselectRightForDeletion={deselectRightForDeletion}
                                    renderLinkableRightId={renderLinkableRightId}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
            <BulkDeleteActions onClose={onClose} onSubmit={() => null} />
        </div>
    );
};

BulkDelete.propTypes = {
    rights: PropTypes.array,
    rightsWithDeps: PropTypes.object,
    onClose: PropTypes.func,
    getLinkedRights: PropTypes.func,
    clearLinkedRights: PropTypes.func,
};

BulkDelete.defaultProps = {
    rights: [],
    rightsWithDeps: {},
    onClose: () => null,
    getLinkedRights: () => null,
    clearLinkedRights: () => null,
};

const mapStateToProps = () => {
    const rightsWithDependenciesSelector = selectors.createRightsWithDependenciesSelector();

    return (state, props) => ({
        rightsWithDeps: rightsWithDependenciesSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getLinkedRights: payload => dispatch(getLinkedRights(payload)),
    clearLinkedRights: () => dispatch(clearLinkedRights()),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(BulkDelete));
