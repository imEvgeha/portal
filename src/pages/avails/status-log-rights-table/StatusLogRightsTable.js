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
import {compose} from 'redux';
import {ERROR_TABLE_COLUMNS, ERROR_TABLE_TITLE} from '../../sync-log/syncLogConstants';
import {STATUS_TAB} from '../rights-repository/constants';
import {getStatusLog} from './StatusLogService';
import columnMappings from './columnMappings';
import './StatusLogRightsTable.scss';
import StatusLogErrors from './components/PublishErrors/StatusLogErrors';

const StatusLogRightsGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withFilterableColumns({frameworkComponents: {publishErrors: StatusLogErrors}}),
    withInfiniteScrolling({fetchData: getStatusLog})
)(NexusGrid);

const StatusLogRightsTable = ({activeTab, context, setSelectedStatusRights}) => {
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
                setSelectedStatusRights(api.getSelectedRows());

                break;

            default:
                break;
        }
    };

    const checkboxSelectionWithHeaderColumnDef = defineCheckboxSelectionColumn({
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
    });

    return (
        <div className="nexus-c-status-log-table">
            <StatusLogRightsGrid
                rowSelection="multiple"
                suppressRowClickSelection={true}
                singleClickEdit
                className="nexus-c-status-log-grid"
                columnDefs={[checkboxSelectionWithHeaderColumnDef, ...columnDefs]}
                mapping={columnMappings}
                context={context}
                onGridEvent={onGridEvent}
                isGridHidden={activeTab !== STATUS_TAB}
                rowClassRules={{
                    'disable-selected': params => {
                        return ['SUCCESS', 'DELETED'].includes(params?.data?.status);
                    },
                }}
            />

            <NexusDrawer onClose={closeDrawer} isOpen={showDrawer} title={ERROR_TABLE_TITLE} width="wider">
                <div className="nexus-c-sync-log-table__errors-table">
                    {ERROR_TABLE_COLUMNS.map(column => {
                        return (
                            <div className="nexus-c-sync-log-table__errors-table--header-cell" key={column}>
                                {column.toUpperCase()}
                            </div>
                        );
                    })}
                    {errorsData.map((error, i) => {
                        return ERROR_TABLE_COLUMNS.map(key => (
                            <div className="nexus-c-sync-log-table__errors-table--cell" key={`error-${i}-${key}`}>
                                {error.split(' - ')[key === 'type' ? 0 : 1]}
                            </div>
                        ));
                    })}
                </div>
            </NexusDrawer>
        </div>
    );
};

StatusLogRightsTable.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setSelectedStatusRights: PropTypes.func.isRequired,
    context: PropTypes.object.isRequired,
};

export default StatusLogRightsTable;
