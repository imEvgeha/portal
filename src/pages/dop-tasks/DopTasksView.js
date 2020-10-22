import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {isEmpty, get, cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import {getUsername} from '../../auth/authSelectors';
import IconButton from '../../ui/atlaskit/icon-button/IconButton';
import {toggleRefreshGridData} from '../../ui/grid/gridActions';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';
import {setDopTasksUserFilter} from './dopTasksActions';
import {createGridStateSelector} from './dopTasksSelectors';
import {applyPredefinedTableView} from './utils';
import {USER} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({toggleRefreshGridData, username, gridState, setDopTasksUserFilter}) => {
    const [externalFilter, setExternalFilter] = useState({
        user: USER,
    });
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);

    useEffect(() => {
        if (!isEmpty(gridState)) {
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
            const sortModel = gridApi.getSortModel();
            const columnState = columnApi.getColumnState();
            const model = {id: viewId, filterModel, sortModel, columnState};
            const newUserData = insertNewGridModel(viewId, userDefinedGridStates, model);
            setDopTasksUserFilter({[username]: newUserData});
        }
    };

    const removeUserDefinedGridState = id => {
        const filteredGridStates = userDefinedGridStates.filter(item => item.id !== id);
        setDopTasksUserFilter({[username]: filteredGridStates});
    };

    const insertNewGridModel = (viewId, userDefinedGridStates, model) => {
        const newUserData = cloneDeep(userDefinedGridStates);
        const foundIndex = newUserData.findIndex(obj => obj.id === viewId);
        if (foundIndex > -1) {
            newUserData[foundIndex] = model;
        } else {
            newUserData.push(model);
        }
        return newUserData;
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
    setDopTasksUserFilter: payload => dispatch(setDopTasksUserFilter(payload)),
});

DopTasksView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
    setDopTasksUserFilter: PropTypes.func,
    gridState: PropTypes.object,
    username: PropTypes.string.isRequired,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
    setDopTasksUserFilter: () => null,
    gridState: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(DopTasksView);
