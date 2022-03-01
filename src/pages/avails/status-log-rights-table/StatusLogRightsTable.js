import React, {useState} from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {defineCheckboxSelectionColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {ERROR_TABLE_COLUMNS, ERROR_TABLE_TITLE} from '../../sync-log/syncLogConstants';
import {STATUS_TAB} from '../rights-repository/constants';
import {getStatusLog} from './StatusLogService';
import columnMappings from './columnMappings';
import './StatusLogRightsTable.scss';
import StatusLogErrors from './components/PublishErrors/StatusLogErrors';
import {storeResyncRights} from './statusLogActions';

const StatusLogRightsGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withFilterableColumns({frameworkComponents: {publishErrors: StatusLogErrors}}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getStatusLog})
)(NexusGrid);

const StatusLogRightsTable = ({activeTab, storeResyncRights}) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [errorsData, setErrorsData] = useState([]);

    const setErrors = data => {
        setErrorsData(data);
        setShowDrawer(true);
    };

    const closeDrawer = () => setShowDrawer(false);

    const columnDefs = columnMappings.map(col => ({
        ...col,
        cellRendererParams: {
            setErrors,
        },
    }));

    const onGridEvent = ({type, api}) => {
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY:
                api.sizeColumnsToFit();

                break;

            case SELECTION_CHANGED:
                {
                    const allSelectedRowsIds = api?.getSelectedNodes()?.map(row => row.data.entityId);
                    const payload = allSelectedRowsIds.reduce((selectedRights, currentRight, i) => {
                        selectedRights[i] = {id: currentRight};
                        return selectedRights;
                    }, {});

                    const formated = {rights: Object.values(payload)};
                    storeResyncRights(formated);
                }
                break;

            default:
                break;
        }
    };

    const cellStyle = ({data}) => {
        return data && ['SUCCESS', 'DELETED'].includes(data.status)
            ? {'pointer-events': 'none', cursor: 'notAllowed'}
            : '';
    };

    const checkboxColumn = {...defineCheckboxSelectionColumn(), cellStyle};

    return (
        <div className="nexus-c-status-log-table">
            <StatusLogRightsGrid
                suppressRowClickSelection
                className="nexus-c-status-log-grid"
                columnDefs={[checkboxColumn, ...columnDefs]}
                mapping={columnMappings}
                rowSelection="multiple"
                onGridEvent={onGridEvent}
                isGridHidden={activeTab !== STATUS_TAB}
            />

            <NexusDrawer onClose={closeDrawer} isOpen={showDrawer} title={ERROR_TABLE_TITLE} width="wider">
                <div className="nexus-c-sync-log-table__errors-table">
                    {ERROR_TABLE_COLUMNS.map(column => (
                        <div className="nexus-c-sync-log-table__errors-table--header-cell" key={column}>
                            {column.toUpperCase()}
                        </div>
                    ))}
                    {errorsData.map((error, i) =>
                        ERROR_TABLE_COLUMNS.map(key => (
                            <div className="nexus-c-sync-log-table__errors-table--cell" key={`error-${i}-${key}`}>
                                {error.split(' - ')[key === 'type' ? 0 : 1]}
                            </div>
                        ))
                    )}
                </div>
            </NexusDrawer>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    storeResyncRights: payload => dispatch(storeResyncRights(payload)),
});

export default connect(null, mapDispatchToProps)(StatusLogRightsTable);

StatusLogRightsTable.propTypes = {
    storeResyncRights: PropTypes.func,
    activeTab: PropTypes.string.isRequired,
};

StatusLogRightsTable.defaultProps = {
    storeResyncRights: () => null,
};
