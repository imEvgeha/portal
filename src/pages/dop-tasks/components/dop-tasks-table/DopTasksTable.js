import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import {COLUMN_MAPPINGS} from '../../constants';
import './DopTasksTable.scss';
import {fetchDopTasksData} from '../../utils';

const DopTasksTableGrid = compose(
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: fetchDopTasksData})
)(NexusGrid);

const DopTasksTable = () => {
    return (
        <div className="nexus-c-dop-tasks-table">
            <DopTasksTableGrid
                id="DopTasksTable"
                columnDefs={COLUMN_MAPPINGS}
                suppressRowClickSelection
                externalFilter={{
                    user: 'user',
                }}
            />
        </div>
    );
};

DopTasksTable.propTypes = {};

export default DopTasksTable;
