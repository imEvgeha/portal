import React, {useState} from 'react';
import PropTypes from 'prop-types';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {getUsername} from '../../auth/authSelectors';
import IconButton from '../../ui/atlaskit/icon-button/IconButton';
import {toggleRefreshGridData} from '../../ui/grid/gridActions';
import DopTasksHeader from './components/dop-tasks-header/DopTasksHeader';
import DopTasksTable from './components/dop-tasks-table/DopTasksTable';
import QueuedTasks from './components/queued-tasks/QueuedTasks';
import SavedTableDropdown from './components/saved-table-dropdown/SavedTableDropdown';
import {setDopTasksUserFilter} from './dopTasksActions';
import {createFilterModelSelector} from './dopTasksSelectors';
import {applyPredefinedTopTasksTableFilter} from './utils';
import {USER} from './constants';
import './DopTasksView.scss';

export const DopTasksView = ({toggleRefreshGridData, username, filterModel, setDopTasksUserFilter}) => {
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

    const saveUserDefinedFilter = () => {
        if (!isEmpty(gridApi) && username) {
            const model = gridApi.getFilterModel();
            setDopTasksUserFilter({[username]: model});
        }
    };

    const applySavedTableDropDownFilter = filter => {
        applyPredefinedTopTasksTableFilter(gridApi, filter);
    };

    return (
        <div className="nexus-c-dop-tasks-view">
            <DopTasksHeader>
                <QueuedTasks setUser={changeUser} />
                <SavedTableDropdown
                    applySavedTableDropDownFilter={applySavedTableDropDownFilter}
                    saveUserDefinedFilter={saveUserDefinedFilter}
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
            />
        </div>
    );
};

const mapStateToProps = () => {
    const filterModelSelector = createFilterModelSelector();

    return (state, props) => ({
        username: getUsername(state),
        filterModel: filterModelSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    setDopTasksUserFilter: payload => dispatch(setDopTasksUserFilter(payload)),
});

DopTasksView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
    setDopTasksUserFilter: PropTypes.func,
    filterModel: PropTypes.object,
    username: PropTypes.string.isRequired,
};

DopTasksView.defaultProps = {
    toggleRefreshGridData: () => null,
    setDopTasksUserFilter: () => null,
    filterModel: () => null,
};

export default connect(mapStateToProps, mapDispatchToProps)(DopTasksView);
