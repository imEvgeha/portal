import React from 'react';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';
import './DopTasksView.scss';

const DopTasksView = () => {
    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks />
                <SavedTableDropdown />
            </DopTasksHeader>
            <DopTasksTable />
        </div>
    );
};

export default DopTasksView;
