import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import { defineCheckboxSelectionColumn } from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {isEmpty} from 'lodash';
import {compose} from 'redux';
import {NexusGrid} from '../../../../../ui/elements';
import { ERROR_TABLE_COLUMNS, ERROR_TABLE_TITLE } from '../../../../sync-log/syncLogConstants';
import {STATUS_TAB} from '../../../rights-repository/constants';
import columnMappings from '../../columnMappings';

const SelectedStatusGrid = compose(
    withColumnsResizing(),
    withSideBar(),
    withEditableColumns(),
)(NexusGrid);

const SelectedStatusTable = ({
    activeTab,
    selectedRights,
    username,
    setSelectedStatusRights,
}) => {
    const [selectedGridApi, setSelectedGridApi] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [errorsData, setErrorsData] = useState([]);
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);

    const setErrors = data => {
        setErrorsData(data);
        setShowDrawer(true);
    };

    const closeDrawer = () => setShowDrawer(false);

    const columnDefs = columnMappings.map(col => ({
        ...col,
        cellRendererParams: {
            setErrors,
        },
    }));

    useEffect(() => {
        if (!isEmpty(selectedRights) && username) {
            setCurrentUserSelectedRights(Object.values(selectedRights));
        }
    }, [activeTab === STATUS_TAB]);

    useEffect(() => {
        if (
            !isEmpty(selectedRights) &&
            username &&
            currentUserSelectedRights &&
            selectedGridApi &&
            selectedGridApi?.forEachNode
        ) {
            selectedGridApi.forEachNode(node => node?.setSelected(true));
        }
    }, [activeTab]);
    

    const onGridReady = ({type, api}) => {
        const {READY, SELECTION_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;
        switch (type) {
            case FIRST_DATA_RENDERED:
                if(api && api?.forEachNode) {
                    api.forEachNode(node => node?.setSelected(true));
                }
                break;
            case READY:
                api.sizeColumnsToFit();

                if(api && api?.forEachNode) {
                    api.forEachNode(node => node?.setSelected(true));
                }
                break;
            case SELECTION_CHANGED: {
                if (activeTab === STATUS_TAB) {
                    const allSelectedRowsIds = api?.getSelectedNodes()?.map(row => row.data.id);

                    // Get ID of a right to be deselected
                    const toDeselectIds = selectedRights
                        .map(({id}) => id)
                        .filter(selectedRepoId => !allSelectedRowsIds.includes(selectedRepoId));

                    // Get all selected nodes from main ag-grid table and filter only ones to deselect
                    const nodesToDeselect = api
                        ?.getSelectedNodes()
                        ?.filter(({data = {}}) => toDeselectIds.includes(data.id));

                    if(nodesToDeselect) {
                        nodesToDeselect.forEach(node => node?.setSelected(false));
                    }

                    const updateSelectedRowsIds = api?.getSelectedNodes()?.map(row => row.data.id);

                    const updatedState = currentUserSelectedRights.filter(right =>
                        updateSelectedRowsIds.includes(right.id)
                    );

                    setSelectedStatusRights(updatedState);
                }
                break;
            }

            default:
                break;
        }
    };

    const checkboxSelectionWithHeaderColumnDef = defineCheckboxSelectionColumn({
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
    });

    return (
        <div className="nexus-c-status-log-table">
            <SelectedStatusGrid
                rowSelection="multiple"
                suppressRowClickSelection={true}
                singleClickEdit
                className="nexus-c-status-log-grid"
                rowData={currentUserSelectedRights}
                columnDefs={[checkboxSelectionWithHeaderColumnDef, ...columnDefs]}
                mapping={columnMappings}
                onGridEvent={onGridReady}
                isGridHidden={activeTab !== STATUS_TAB}
                setSelectedGridApi={setSelectedGridApi}
            />

            <NexusDrawer onClose={closeDrawer} isOpen={showDrawer} title={ERROR_TABLE_TITLE} width="wider">
                <div className="nexus-c-sync-log-table__errors-table">
                    {ERROR_TABLE_COLUMNS.map(column => (
                        <div className="nexus-c-sync-log-table__errors-table--header-cell" key={column}>
                            {column.toUpperCase()}
                        </div>
                    ))}
                    {errorsData.map((error, i) =>
                        ERROR_TABLE_COLUMNS.map(key => (
                            <div className="nexus-c-sync-log-table__errors-table--cell" key={`error-${i}-${key}`}>
                                {error.split(' - ')[key === 'type' ? 0 : 1]}
                            </div>
                        ))
                    )}
                </div>
            </NexusDrawer>
        </div>
    );
};

SelectedStatusTable.propTypes = {
    activeTab: PropTypes.string.isRequired,
    selectedRights: PropTypes.array,
    username: PropTypes.string,
    setSelectedStatusRights: PropTypes.func,
};

SelectedStatusTable.defaultProps = {
    selectedRights: [],
    username: {},
    setSelectedStatusRights: () => null,
};

export default SelectedStatusTable;
