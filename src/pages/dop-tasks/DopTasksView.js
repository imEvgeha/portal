import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {isEmpty, get} from 'lodash';
import {connect} from 'react-redux';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import {setDopTasksUserDefinedGridState, assignDopTasks, unAssignDopTasks, changeDOPPriority} from './dopTasksActions';
import {createGridStateSelector} from './dopTasksSelectors';
import {applyPredefinedTableView} from './utils';
import {
    USER,
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
    QUEUED_TASKS_OPTIONS,
} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({
    toggleRefreshGridData,
    username,
    gridState,
    setDopTasksUserDefinedGridState,
    assignTasks,
    unAssignTasks,
    changePriority,
}) => {
    const [externalFilter, setExternalFilter] = useState({
        user: USER,
    });
    const [selectedTaskType, setSelectedTaskType] = useState(QUEUED_TASKS_OPTIONS[0]);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);

    useEffect(() => {
        if (!isEmpty(gridState) && username) {
            const userDefinedGridStates = get(gridState, username, []);
            setUserDefinedGridStates(userDefinedGridStates);
        }
    }, [gridState, username, get]);

    const changeUser = user => {
        onSelectTaskType(user);
        setExternalFilter(prevState => {
            return {
                ...prevState,
                user,
            };
        });
    };

    const onSelectTaskType = value => {
        const type = QUEUED_TASKS_OPTIONS.find(option => option.value === value);
        setSelectedTaskType(type);
    };

    const tableLabels = {
        savedDropdownLabel: SAVED_TABLE_DROPDOWN_LABEL,
        savedViewslabel: MY_SAVED_VIEWS_LABEL,
        predifinedViewsLabel: MY_PREDEFINED_VIEWS_LABEL,
    };
    const tableOptions = SAVED_TABLE_SELECT_OPTIONS;

    const onUserDefinedViewSelected = view => {
        const user = view?.externalFilter?.user;
        user && changeUser(user);
    };

    const applyPredefinedTableViewCallBack = () => {
        setSelectedTaskType(QUEUED_TASKS_OPTIONS[0]);
        changeUser(QUEUED_TASKS_OPTIONS[0].value);
    };

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={changeUser} selectedValue={selectedTaskType} />
                <NexusSavedTableDropdown
                    gridApi={gridApi}
                    columnApi={columnApi}
                    username={username}
                    setUserDefinedGridState={setDopTasksUserDefinedGridState}
                    userDefinedGridStates={userDefinedGridStates}
                    applyPredefinedTableView={(gridApi, filter, columnApi) =>
                        applyPredefinedTableView(gridApi, filter, columnApi, applyPredefinedTableViewCallBack)
                    }
                    onUserDefinedViewSelected={onUserDefinedViewSelected}
                    externalFilter={externalFilter}
                    tableLabels={tableLabels}
                    tableOptions={tableOptions}
                />
                <div className="nexus-c-dop-tasks-view__refresh-btn">
                    <IconButton
                        icon={() => <RefreshIcon size="large" />}
                        onClick={() => toggleRefreshGridData(true)}
                        label="Refresh"
                    />
                </div>
            </DopTasksHeader>
            <DopTasksTable
                externalFilter={externalFilter}
                setExternalFilter={setExternalFilter}
                setGridApi={setGridApi}
                setColumnApi={setColumnApi}
                assignTasks={assignTasks}
                unAssignTasks={unAssignTasks}
                changePriority={changePriority}
            />
        </div>
    );
};

const mapStateToProps = () => {
    const gridStateSelector = createGridStateSelector();

    return (state, props) => ({
        username: getUsername(state),
        gridState: gridStateSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    setDopTasksUserDefinedGridState: payload => dispatch(setDopTasksUserDefinedGridState(payload)),
    assignTasks: payload => dispatch(assignDopTasks(payload)),
    unAssignTasks: payload => dispatch(unAssignDopTasks(payload)),
    changePriority: payload => dispatch(changeDOPPriority(payload)),
});

DopTasksView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
    setDopTasksUserDefinedGridState: PropTypes.func,
    assignTasks: PropTypes.func,
    unAssignTasks: PropTypes.func,
    changePriority: PropTypes.func,
    gridState: PropTypes.object,
    username: PropTypes.string.isRequired,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
    setDopTasksUserDefinedGridState: () => null,
    assignTasks: () => null,
    unAssignTasks: () => null,
    changePriority: () => null,
    gridState: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(DopTasksView);
