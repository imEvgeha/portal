import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@portal/portal-auth/authSelectors';
import {Button} from '@portal/portal-components';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {get, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import {assignDopTasks, changeDOPPriority, setDopTasksUserDefinedGridState, unAssignDopTasks} from './dopTasksActions';
import {createGridStateSelector} from './dopTasksSelectors';
import {applyPredefinedTableView} from './utils';
import {
    MY_PREDEFINED_VIEWS_LABEL,
    MY_SAVED_VIEWS_LABEL,
    QUEUED_TASKS_OPTIONS,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
    USER,
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
    const [selectedTaskType, setSelectedTaskType] = useState(QUEUED_TASKS_OPTIONS[0].value);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);

    useEffect(() => {
        if (!isEmpty(gridState) && username) {
            const userDefinedGridStates = get(gridState, username, []);
            setUserDefinedGridStates(userDefinedGridStates);
        }
    }, [gridState, username, get]);

    const onSelectedTaskTypeChanged = type => {
        setSelectedTaskType(type);
        setExternalFilter(prevState => {
            return {
                ...prevState,
                user: type,
            };
        });
    };

    const tableLabels = {
        savedDropdownLabel: SAVED_TABLE_DROPDOWN_LABEL,
        savedViewslabel: MY_SAVED_VIEWS_LABEL,
        predifinedViewsLabel: MY_PREDEFINED_VIEWS_LABEL,
    };
    const tableOptions = SAVED_TABLE_SELECT_OPTIONS;

    const onUserDefinedViewSelected = view => {
        const user = view?.externalFilter?.user;
        user && onSelectedTaskTypeChanged(user);
    };

    const applyPredefinedTableViewCallBack = () => {
        setSelectedTaskType(QUEUED_TASKS_OPTIONS[0]);
        onSelectedTaskTypeChanged(QUEUED_TASKS_OPTIONS[0].value);
    };

    return (
        <div className="nexus-c-dop-tasks-view">
            <div className="row align-items-center mx-3 my-3">
                <div className="col-2">
                    <h1>DOP Tasks</h1>
                </div>

                <div className="col-2 text-start">
                    <QueuedTasks onChange={onSelectedTaskTypeChanged} value={selectedTaskType} />
                </div>

                <div className="col-2 text-start">
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
                </div>

                <div className="col-6 text-end">
                    <Button
                        className="p-button-text mx-2"
                        icon="po po-reload"
                        tooltip="Refresh"
                        tooltipOptions={{position: 'left', appendTo: 'self'}}
                        onClick={() => toggleRefreshGridData(true)}
                    />
                </div>
            </div>
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
    username: PropTypes.string,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
    setDopTasksUserDefinedGridState: () => null,
    assignTasks: () => null,
    unAssignTasks: () => null,
    changePriority: () => null,
    gridState: {},
    username: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(DopTasksView);
