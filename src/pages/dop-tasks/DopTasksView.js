import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import IconButton from '@vubiquity-nexus/portal-ui/lib/atlaskit/icon-button/IconButton';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty, get} from 'lodash';
import {connect} from 'react-redux';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';
import {setDopTasksUserDefinedGridState} from './dopTasksActions';
import {createGridStateSelector} from './dopTasksSelectors';
import {applyPredefinedTableView, insertNewGridModel} from './utils';
import {USER} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({toggleRefreshGridData, username, gridState, setDopTasksUserDefinedGridState}) => {
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

    const saveUserDefinedGridState = viewId => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && username && viewId) {
            const filterModel = gridApi.getFilterModel();
            const sortModel = getSortModel(columnApi);
            const columnState = columnApi.getColumnState();
            const model = {id: viewId, filterModel, sortModel, columnState};
            const newUserData = insertNewGridModel(viewId, userDefinedGridStates, model);
            setDopTasksUserDefinedGridState({[username]: newUserData});
        }
    };

    const removeUserDefinedGridState = id => {
        const filteredGridStates = userDefinedGridStates.filter(item => item.id !== id);
        setDopTasksUserDefinedGridState({[username]: filteredGridStates});
    };

    const selectPredefinedTableView = filter => {
        applyPredefinedTableView(gridApi, filter);
    };

    const selectUserDefinedTableView = id => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && id) {
            const selectedModel = userDefinedGridStates.filter(item => item.id === id);
            const {columnState, filterModel, sortModel} = selectedModel[0] || {};
            gridApi.setFilterModel(filterModel);
            gridApi.setSortModel(sortModel);
            columnApi.setColumnState(columnState);
        }
    };

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={changeUser} />
                <SavedTableDropdown
                    selectPredefinedTableView={selectPredefinedTableView}
                    saveUserDefinedGridState={saveUserDefinedGridState}
                    removeUserDefinedGridState={removeUserDefinedGridState}
                    selectUserDefinedTableView={selectUserDefinedTableView}
                    userDefinedGridStates={userDefinedGridStates}
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
});

DopTasksView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
    setDopTasksUserDefinedGridState: PropTypes.func,
    gridState: PropTypes.object,
    username: PropTypes.string.isRequired,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
    setDopTasksUserDefinedGridState: () => null,
    gridState: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(DopTasksView);
