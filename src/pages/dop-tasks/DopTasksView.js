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
import {applyPredefinedTopTasksTableFilter} from './utils';
import {USER} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({toggleRefreshGridData}) => {
    const [externalFilter, setExternalFilter] = useState({
        user: USER,
    });
    const [gridApi, setGridApi] = useState(null);

    const changeUser = user => {
        setExternalFilter(prevState => {
            return {
                ...prevState,
                user,
            };
        });
    };

    const applySavedTableDropDownFilter = filter => {
        applyPredefinedTopTasksTableFilter(gridApi, filter);
    };

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={changeUser} />
                <SavedTableDropdown applySavedTableDropDownFilter={applySavedTableDropDownFilter} />
                <IconButton
                    icon={() => <RefreshIcon size="large" />}
                    onClick={() => toggleRefreshGridData(true)}
                    label="Refresh"
                />
            </DopTasksHeader>
            <DopTasksTable
                externalFilter={externalFilter}
                setExternalFilter={setExternalFilter}
                setGridApi={setGridApi}
            />
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
