import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import {COLUMN_MAPPINGS, USER} from '../../constants';
import './DopTasksTable.scss';
import {fetchDopTasksData} from '../../utils';
import DopTasksTableStatusBar from '../dop-tasks-table-status-bar/DopTasksTableStatusBar';

const DopTasksTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    // withSorting(),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: fetchDopTasksData})
)(NexusGrid);

const DopTasksTable = ({user}) => {
    const [gridApi, setGridApi] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const [pageSize, setPageSize] = useState(0);

    const getPaginationData = ({api}) => {
        const pageSize = api.paginationGetPageSize();
        const totalCount = api.paginationGetRowCount();
        if (totalCount > 0) {
            console.log(pageSize, totalCount);
            setTotalRows(totalCount);
            setPageSize(pageSize);
        }
    };

    const onGridReady = ({type, api}) => {
        const {FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case FILTER_CHANGED: {
                console.log(api.getFilterModel());
                break;
            }

            default:
                break;
        }
    };

    const onSortChanged = ({api}) => {
        // TODO: catch sorting column and prepare data for passing it fetchDopTasksData as a payload
        const sortModel = api.getSortModel();
        console.log(sortModel);
    };

    return (
        <div className="nexus-c-dop-tasks-table">
            <DopTasksTableGrid
                id="DopTasksTable"
                columnDefs={COLUMN_MAPPINGS}
                mapping={COLUMN_MAPPINGS}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                onSortChanged={onSortChanged}
                pagination={true}
                suppressPaginationPanel={true}
                onPaginationChanged={getPaginationData}
                externalFilter={{
                    user,
                }}
            />
            <DopTasksTableStatusBar />
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
