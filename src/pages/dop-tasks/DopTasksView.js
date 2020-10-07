import React, {useState} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {connect} from 'react-redux';
import IconButton from '../../ui/atlaskit/icon-button/IconButton';
import {toggleRefreshGridData} from '../../ui/grid/gridActions';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';
import {USER} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({toggleRefreshGridData}) => {
    const [user, setUser] = useState(USER);

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={setUser} />
                <SavedTableDropdown />
                <IconButton
                    icon={() => <RefreshIcon size="large" />}
                    onClick={() => toggleRefreshGridData(true)}
                    label="Refresh"
                />
            </DopTasksHeader>
            <DopTasksTable user={user} />
        </div>
    );
};
const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

DopTasksView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
};

export default connect(null, mapDispatchToProps)(DopTasksView);
