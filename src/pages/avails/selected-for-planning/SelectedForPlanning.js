import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {compose} from 'redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import {prepareSelectForPlanningData} from './utils';
import {COLUMN_MAPPINGS, DOP_PROJECT_URL, SELECTED_FOR_PLANNING_TAB} from './constants';

const SelectedForPlanningTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

const SelectedForPlanning = ({
    activeTab,
    isPlanningTabRefreshed,
    setSelectedForPlanningGridApi,
    setSelectedForPlanningColumnApi,
}) => {
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

    const [updatedColDef, setUpdatedColDef] = useState([]);

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
            rowSelection="multiple"
            suppressRowClickSelection
            isGridHidden={activeTab !== SELECTED_FOR_PLANNING_TAB}
            key={`planning_table_${isPlanningTabRefreshed}`}
            onGridEvent={onGridReady}
            dragStopped={dragStoppedHandler}
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
