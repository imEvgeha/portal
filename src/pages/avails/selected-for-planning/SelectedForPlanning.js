import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {compose} from 'redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import {prepareSelectForPlanningData} from './utils';
import {COLUMN_MAPPINGS, DOP_PROJECT_URL, SELECTED_FOR_PLANNING_TAB} from './constants';

const SelectedForPlanningTable = compose(
    withFilterableColumns(),
    withColumnsResizing(),
    withSideBar(),
    withSorting(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

const SelectedForPlanning = ({
    activeTab,
    isPlanningTabRefreshed,
    setSelectedForPlanningGridApi,
    setSelectedForPlanningColumnApi,
}) => {
    const [updatedColDef, setUpdatedColDef] = useState([]);
    const [externalSort, setExternalSort] = useState({});

    const mappings = COLUMN_MAPPINGS.map(col =>
        col.colId === 'projectId'
            ? {
                  ...col,
                  cellRendererParams: {
                      link: `${config.get('gateway.DOPUrl')}${DOP_PROJECT_URL}`,
                  },
              }
            : col
    );

    const onGridReady = ({type, columnApi, api}) => {
        switch (type) {
            case GRID_EVENTS.READY: {
                setSelectedForPlanningColumnApi(columnApi);
                setSelectedForPlanningGridApi(api);
                break;
            }
            default:
            // no-op;
        }
    };

    const onSortChanged = ({api}) => {
        // prepare sorting as a payload
        const sortModel = api.getSortModel();
        if (sortModel.length) {
            const sortCriterion = [
                {
                    fieldName: sortModel[0].colId,
                    ascending: sortModel[0].sort === 'asc',
                },
            ];
            setExternalSort(prevData => {
                return {
                    ...prevData,
                    sortCriterion,
                };
            });
        } else {
            setExternalSort({});
        }
    };

    const dragStoppedHandler = event => {
        const updatedMappings = updatedColDef.length ? cloneDeep(updatedColDef) : cloneDeep(mappings);
        const columnHeader = event.target.textContent.trim();
        const columns = event.columnApi.columnController.gridColumns;

        const moveTo = columns.findIndex(col => col.colDef.headerName === columnHeader);
        const moveFrom = updatedMappings.findIndex(col => col.headerName === columnHeader);
        const [movedColumn] = updatedMappings.splice(moveFrom, 1);
        updatedMappings.splice(moveTo, 0, movedColumn);

        setUpdatedColDef(updatedMappings);
    };

    return (
        <SelectedForPlanningTable
            id="selectedForPlanningRepo"
            columnDefs={updatedColDef.length ? updatedColDef : mappings}
            mapping={COLUMN_MAPPINGS}
            rowSelection="multiple"
            suppressRowClickSelection
            isGridHidden={activeTab !== SELECTED_FOR_PLANNING_TAB}
            key={`planning_table_${isPlanningTabRefreshed}`}
            onGridEvent={onGridReady}
            dragStopped={dragStoppedHandler}
            onSortChanged={onSortChanged}
            externalFilter={externalSort}
        />
    );
};

SelectedForPlanning.propTypes = {
    activeTab: PropTypes.string.isRequired,
    isPlanningTabRefreshed: PropTypes.bool.isRequired,
    setSelectedForPlanningGridApi: PropTypes.func,
    setSelectedForPlanningColumnApi: PropTypes.func,
};

SelectedForPlanning.defaultProps = {
    setSelectedForPlanningGridApi: () => null,
    setSelectedForPlanningColumnApi: () => null,
};

export default SelectedForPlanning;
