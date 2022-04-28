import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from "@portal/portal-auth/authSelectors";
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
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import {STATUS_TAB} from '../rights-repository/constants';
import {setPreplanRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import StatusRightsActions from '../status-rights-actions/StatusRightsActions';
import {getStatusLog} from './StatusLogService';
import columnMappings from './columnMappings';
import './StatusLogRightsTable.scss';
import StatusLogErrors from './components/PublishErrors/StatusLogErrors';
import SelectedStatusTable from './components/selected-status-table/SelectedStatusTable';

const StatusLogRightsGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withFilterableColumns({frameworkComponents: {publishErrors: StatusLogErrors}}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getStatusLog})
)(NexusGrid);

export const StatusLogRightsTable = ({totalRowCount, username}) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [errorsData, setErrorsData] = useState([]);
    const [showSelected, setShowSelected] = useState(false);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const [selectedRights, setSelectedRights] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    const closeDrawer = () => setShowDrawer(false);

    useEffect(() => {
        const checkBoxColDef = defineCheckboxSelectionColumn({
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
        });

        const mappings = columnMappings.map(col => ({...col, cellRendererParams: {setErrors}}));
        setColumnDefs([checkBoxColDef, ...mappings]);
    }, []);

    const setErrors = data => {
        setErrorsData(data);
        setShowDrawer(true);
    };

    const onGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY:
                !gridApi && setGridApi(api);
                !columnApiState && setColumnApiState(columnApi);
                api.sizeColumnsToFit();
                break;
            case SELECTION_CHANGED:
                setSelectedRights(api.getSelectedRows());
                break;
            default:
                break;
        }
    };

    const selectableRows = ['SUCCESS', 'DELETED'];
    const isRowSelectable = rowNode => rowNode?.data && !selectableRows.includes(rowNode?.data?.status);

    const toolbarActions = () => {
        return <StatusRightsActions rights={selectedRights} />;
    };

    return (
        <div className="nexus-c-status-log-table">
            <AvailsTableToolbar
                totalRecordsCount={totalRowCount}
                activeTab={STATUS_TAB}
                selectedRowsCount={selectedRights.length}
                setIsSelected={setShowSelected}
                isSelected={showSelected}
                gridApi={gridApi}
                columnApi={columnApiState}
                username={username}
                showSelectedButton={true}
                toolbarActions={toolbarActions()}
            />

            {!showSelected && (
                <StatusLogRightsGrid
                    suppressRowClickSelection
                    className="nexus-c-status-log-grid"
                    columnDefs={columnDefs}
                    mapping={columnMappings}
                    rowSelection="multiple"
                    onGridEvent={onGridEvent}
                    rowClassRules={{
                        'disable-selected': params => ['SUCCESS', 'DELETED'].includes(params?.data?.status),
                    }}
                    context={{selectedRows: [...selectedRights]}}
                    isRowSelectable={isRowSelectable}
                />
            )}

            {showSelected && (
                <SelectedStatusTable
                    columnDefs={columnDefs}
                    selectedStatusRights={selectedRights}
                    setSelectedStatusRights={setSelectedRights}
                />
            )}

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

StatusLogRightsTable.propTypes = {
    totalRowCount: PropTypes.number,
    username: PropTypes.string.isRequired,
};

StatusLogRightsTable.defaultProps = {
    totalRowCount: 0,
};

const mapStateToProps = () => {
    const totalRowCountSelector = selectors.createStatusLogCountSelector();
    return (state, props) => ({
        totalRowCount: totalRowCountSelector(state, props),
        username: getUsername(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setPreplanRights: payload => dispatch(setPreplanRights(payload)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StatusLogRightsTable);
