import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {getConfig} from '../../../config';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import DOPService from './DOP-services';
import {prepareSelectForPlanningData} from './utils';
import {COLUMN_MAPPINGS, DOP_PROJECT_URL, SELECTED_FOR_PLANNING_TAB} from './constants';
import './SelectedForPlanning.scss';

const SelectedForPlanningTable = compose(
    withFilterableColumns(),
    withColumnsResizing(),
    withSideBar(),
    withSorting(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

export const SelectedForPlanning = ({
    activeTab,
    isPlanningTabRefreshed,
    setSelectedForPlanningGridApi,
    setSelectedForPlanningColumnApi,
    username,
}) => {
    const [updatedColDef, setUpdatedColDef] = useState([]);
    const [externalSort, setExternalSort] = useState({});
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const [allRights, setAllRights] = useState([]);

    // Fetch and set DOP projects count for current user
    useEffect(() => {
        DOPService.getUsersProjectsList(1, 1)
            .then(([response, headers]) => setAllRights(response))
            .catch(error => {});
    }, []);

    const mappings = COLUMN_MAPPINGS.map(col =>
        col.colId === 'projectId'
            ? {
                  ...col,
                  cellRendererParams: {
                      link: `${getConfig('DOP_base')}${DOP_PROJECT_URL}`,
                  },
              }
            : col
    );

    const onGridReady = ({type, columnApi, api}) => {
        switch (type) {
            case GRID_EVENTS.READY: {
                !gridApi && setGridApi(api);
                !columnApiState && setColumnApiState(columnApi);
                setSelectedForPlanningColumnApi(columnApi);
                setSelectedForPlanningGridApi(api);
                break;
            }
            default:
                break;
        }
    };

    const onSortChanged = ({columnApi}) => {
        // prepare sorting as a payload
        const sortModel = getSortModel(columnApi);
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
        <div className="selected-for-planning-table-wrapper">
            <AvailsTableToolbar
                activeTab={SELECTED_FOR_PLANNING_TAB}
                totalRecordsCount={allRights.length}
                selectedRowsCount={allRights.length}
                gridApi={gridApi}
                columnApi={columnApiState}
                username={username}
                showSelectedButton={false}
            />

            <SelectedForPlanningTable
                id="selectedForPlanningRepo"
                columnDefs={updatedColDef.length ? updatedColDef : mappings}
                mapping={COLUMN_MAPPINGS}
                rowSelection="multiple"
                suppressRowClickSelection
                key={`planning_table_${isPlanningTabRefreshed}`}
                onGridEvent={onGridReady}
                dragStopped={dragStoppedHandler}
                onSortChanged={onSortChanged}
                externalFilter={externalSort}
            />
        </div>
    );
};

SelectedForPlanning.propTypes = {
    activeTab: PropTypes.string,
    isPlanningTabRefreshed: PropTypes.bool,
    setSelectedForPlanningGridApi: PropTypes.func,
    setSelectedForPlanningColumnApi: PropTypes.func,
    username: PropTypes.string.isRequired,
};

SelectedForPlanning.defaultProps = {
    activeTab: '',
    setSelectedForPlanningGridApi: () => null,
    setSelectedForPlanningColumnApi: () => null,
    isPlanningTabRefreshed: false,
};

const mapStateToProps = () => {
    return (state, props) => ({
        username: getUsername(state),
    });
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedForPlanning);
