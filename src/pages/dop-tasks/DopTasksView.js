import React from 'react';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';

const DopTasksView = () => {
    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks />
                <SavedTableDropdown />
            </DopTasksHeader>
        </div>
    );
};

export default DopTasksView;
