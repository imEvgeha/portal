import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import {COLUMN_MAPPINGS, USER, INITIAL_SEARCH_PARAMS, DOP_GUIDED_TASK_URL, DOP_PROJECT_URL} from '../../constants';
import {fetchDopTasksData} from '../../utils';
import DopTasksTableStatusBar from '../dop-tasks-table-status-bar/DopTasksTableStatusBar';
import './DopTasksTable.scss';

const DopTasksTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withInfiniteScrolling({fetchData: fetchDopTasksData})
)(NexusGrid);

const DopTasksTable = ({user}) => {
    const [paginationData, setPaginationData] = useState({
        pageSize: 0,
        totalCount: 0,
    });
    const [externalFilter, setExternalFilter] = useState({
        user,
    });
    const formattedValueColDefs = COLUMN_MAPPINGS.map(col => ({...col, valueFormatter: createValueFormatter(col)}));

    useEffect(() => {
        if (externalFilter.user !== user) {
            setExternalFilter(prevData => {
                return {
                    ...prevData,
                    user,
                };
            });
        }
    }, [user]);

    const getPaginationData = ({api}) => {
        const pageSize = api.paginationGetPageSize();
        const totalCount = api.paginationGetRowCount();
        if (totalCount > 0) {
            setPaginationData({pageSize, totalCount});
        }
    };

    const onGridReady = ({type, api}) => {
        const {FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case FILTER_CHANGED: {
                // console.log(api.getFilterModel());
                break;
            }
            default:
                break;
        }
    };

    const onSortChanged = ({api}) => {
        // get sorting column and prepare data for passing it as a payload instead of url params (not supported by DOP api)
        const sortModel = api.getSortModel();
        if (sortModel.length) {
            const sortCriterion = [
                {
                    fieldName: sortModel[0].colId,
                    ascending: sortModel[0].sort === 'asc',
                },
            ];
            setExternalFilter(prevData => {
                return {
                    ...prevData,
                    sortCriterion,
                };
            });
        } else {
            setExternalFilter(prevData => {
                return {
                    ...prevData,
                    sortCriterion: INITIAL_SEARCH_PARAMS.sortCriterion,
                };
            });
        }
    };

    return (
        <div className="nexus-c-dop-tasks-table">
            <DopTasksTableGrid
                id="DopTasksTable"
                columnDefs={formattedValueColDefs}
                mapping={COLUMN_MAPPINGS}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                onSortChanged={onSortChanged}
                pagination={true}
                suppressPaginationPanel={true}
                onPaginationChanged={getPaginationData}
                externalFilter={externalFilter}
            />
            <DopTasksTableStatusBar paginationData={paginationData} />
        </div>
    );
};

DopTasksTable.propTypes = {
    user: PropTypes.string,
};

DopTasksTable.defaultProps = {
    user: USER,
};

export default DopTasksTable;
