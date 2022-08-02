import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@portal/portal-auth/authSelectors';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import {commonDragStoppedHandler} from '../rights-repository/util/utils';
import {prepareSelectForPlanningData} from './utils';
import {COLUMN_MAPPINGS, SELECTED_FOR_PLANNING_TAB} from './constants';
import './SelectedForPlanning.scss';

const SelectedForPlanningTable = compose(
    withFilterableColumns(),
    withColumnsResizing(),
    withSideBar(),
    withSorting(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

export const SelectedForPlanning = ({username}) => {
    const [updatedColDef, setUpdatedColDef] = useState([]);
    const [externalSort, setExternalSort] = useState({});
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const [allRights, setAllRights] = useState([]);

    const mappings = COLUMN_MAPPINGS.map(col => {
        const uri = `/index.html?launchApp=Projects&projectId=`;
        const link = getApiURI('dopPortal', uri, 0, 'dopExternal');

        return col.colId === 'projectId'
            ? {
                  ...col,
                  cellRendererParams: {link},
              }
            : col;
    });

    const onGridReady = ({type, columnApi, api}) => {
        switch (type) {
            case GRID_EVENTS.READY: {
                !gridApi && setGridApi(api);
                !columnApiState && setColumnApiState(columnApi);
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
        const updatedMappings = commonDragStoppedHandler(event, updatedColDef, mappings);
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
                key="selected_for_planning_tbl"
                onGridEvent={onGridReady}
                dragStopped={dragStoppedHandler}
                onSortChanged={onSortChanged}
                externalFilter={externalSort}
                setData={response => setAllRights(response.data)}
            />
        </div>
    );
};

SelectedForPlanning.propTypes = {
    username: PropTypes.string,
};

SelectedForPlanning.defaultProps = {
    username: '',
};

const mapStateToProps = () => {
    return (state, props) => ({
        username: getUsername(state),
    });
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedForPlanning);
