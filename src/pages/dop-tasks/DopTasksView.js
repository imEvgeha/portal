import React, {useState} from 'react';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import IconButton from '../../ui/atlaskit/icon-button/IconButton';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';
import {USER} from './constants';
import './DopTasksView.scss';

const DopTasksView = () => {
    const [user, setUser] = useState(USER);

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={setUser} />
                <SavedTableDropdown />
                <IconButton icon={() => <RefreshIcon size="large" />} onClick={() => setUser(USER)} label="Refresh" />
            </DopTasksHeader>
            <DopTasksTable user={user} />
        </div>
    );
};

export default DopTasksView;
