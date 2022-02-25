import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {compose} from 'redux';
import { ERROR_TABLE_COLUMNS, ERROR_TABLE_TITLE } from '../../sync-log/syncLogConstants';
import { STATUS_TAB } from '../rights-repository/constants';
import { getStatusLog } from './StatusLogService';
import columnMappings from './columnMappings';
import './StatusLogRightsTable.scss';
import StatusLogErrors from './components/PublishErrors/StatusLogErrors';

const StatusLogRightsGrid = compose(
    withSideBar(),
    withColumnsResizing(), 
    withFilterableColumns({frameworkComponents: { publishErrors: StatusLogErrors }}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getStatusLog})
)(NexusGrid);

const StatusLogRightsTable = ({activeTab}) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [errorsData, setErrorsData] = useState([]);

    const setErrors = data => {
        setErrorsData(data);
        setShowDrawer(true);
    };

    const closeDrawer = () => setShowDrawer(false);

    const getColumnDefs = () => {
        return columnMappings.map(col => ({
            ...col,
            cellRendererParams: {
                setErrors,
            },
        }));
    };

    const onGridEvent = ({type, api}) => {
        const {READY} = GRID_EVENTS;
        switch (type) {
            case READY:
                api.sizeColumnsToFit();
                break;
            default:
                break;
        }
    };

    return (
        <div className="nexus-c-status-log-table">
            <StatusLogRightsGrid
                suppressRowClickSelection
                className="nexus-c-status-log-grid"
                columnDefs={getColumnDefs()}
                mapping={columnMappings}
                rowSelection="single"
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
                            <div className="nexus-c-sync-log-table__errors-table--cell" key={`error-${i - key}`}>
                                {error.split(' - ')[key === 'type' ? 0 : 1]}
                            </div>
                        ))
                    )}
                </div>
            </NexusDrawer>
        </div>
    );
};

export {StatusLogRightsTable};

StatusLogRightsTable.propTypes = {
    activeTab: PropTypes.string.isRequired,
};
