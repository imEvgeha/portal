import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
// import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty, get} from 'lodash';
import {connect} from 'react-redux';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import {setDopTasksUserDefinedGridState, assignDopTasks, changeDOPPriority} from './dopTasksActions';
import {createGridStateSelector} from './dopTasksSelectors';
import {applyPredefinedTableView, insertNewGridModel} from './utils';
import {USER} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({
    toggleRefreshGridData,
    username,
    gridState,
    setDopTasksUserDefinedGridState,
    assignTasks,
    changePriority,
}) => {
    const [externalFilter, setExternalFilter] = useState({
        user: USER,
    });
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
        setExternalFilter(prevState => {
            return {
                ...prevState,
                user,
            };
        });
    };

    // const selectPredefinedTableView = filter => {
    //     applyPredefinedTableView(gridApi, filter, columnApi);
    // };

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={changeUser} />
                <NexusSavedTableDropdown
                    // selectPredefinedTableView={selectPredefinedTableView}
                    userDefinedGridStates={userDefinedGridStates}
                    dopPage={true}
                    setUserDefinedGridState={setDopTasksUserDefinedGridState}
                    gridApi={gridApi}
                    columnApi={columnApi}
                    username={username}
                    applyPredefinedTableView={applyPredefinedTableView}
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
    changePriority: payload => dispatch(changeDOPPriority(payload)),
});

DopTasksView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
    setDopTasksUserDefinedGridState: PropTypes.func,
    assignTasks: PropTypes.func,
    changePriority: PropTypes.func,
    gridState: PropTypes.object,
    username: PropTypes.string.isRequired,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
    setDopTasksUserDefinedGridState: () => null,
    assignTasks: () => null,
    changePriority: () => null,
    gridState: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(DopTasksView);
