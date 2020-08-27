import React, {useState, useEffect, memo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import DynamicTable from '@atlaskit/dynamic-table';
import Tag from '@atlaskit/tag';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import RightsURL from '../../legacy/containers/avail/util/RightsURL';
import {getLinkedRights, clearLinkedRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import {
    HEADER,
    BULK_DELETE_WARNING_MSG,
    BULK_DELETE_LINKED_RIGHT_MSG,
    BULK_DELETE_CONTINUE_MSG,
    BULK_DELETE_BTN_DELETE,
    BULK_DELETE_BTN_CANCEL,
} from './constants';
import './BulkDelete.scss';

export const BulkDelete = ({rights, onClose, rightsWithDeps, getLinkedRights, clearLinkedRights}) => {
    const [tableData, setTableData] = useState({});

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
            className="nexus-c-bulk-delete__link"
            key={id}
            appearance="link"
            onClick={() => window.open(RightsURL.getRightUrl(id), '_blank')}
        >
            {id}
        </Button>
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
                        content: sourceRightId ? (
                            <Tag className="nexus-c-bulk-delete__tag" text="Bonus" color="greyLight" />
                        ) : (
                            <Tag className="nexus-c-bulk-delete__tag" text="TPR" color="greyLight" />
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
                                <div className="nexus-c-bulk-delete__table-data" key={value.original.id}>
                                    <div className="nexus-c-bulk-delete__table-entry-header">
                                        <Checkbox
                                            isChecked={value.isSelected}
                                            onChange={() => deselectRightForDeletion(key)}
                                        />
                                        <div className="nexus-c-bulk-delete__table-entry-title">
                                            {value.original.title}
                                        </div>
                                        {renderLinkableRightId(value.original.id)}
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
