import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import {dateToISO} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import columnMappings from './columnMappings';
import PublishErrors from './components/PublishErrors/PublishErrors';
import Status from './components/Status/Status';
import TitleNameCellRenderer from './components/TitleNamecCellRenderer/TitleNameCellRenderer';
import {createSaveDateFromAction} from './syncLogActions';
import {ERROR_TABLE_COLUMNS, ERROR_TABLE_TITLE} from './syncLogConstants';
import {selectSyncLogDateFrom, selectSyncLogDateTo} from './syncLogSelectors';
import {getSyncLog} from './syncLogService';
import './SyncLogTable.scss';

const SyncLogGrid = compose(withColumnsResizing(), withInfiniteScrolling({fetchData: getSyncLog}))(NexusGrid);

const SyncLogTable = ({setDateFrom, dateFrom, dateTo}) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [errorsData, setErrorsData] = useState([]);

    const setErrors = data => {
        setErrorsData(data);
        setShowDrawer(true);
    };

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

    const closeDrawer = () => setShowDrawer(false);

    useEffect(() => {
        if (dateFrom === '') {
            setDateFrom(dateToISO(new Date(), DATETIME_FIELDS.REGIONAL_MIDNIGHT));
        }
    }, [dateFrom]);

    return (
        <div className="nexus-c-sync-log-table">
            <SyncLogGrid
                className="nexus-c-sync-log-grid"
                columnDefs={getColumnDefs()}
                mapping={columnMappings}
                rowSelection="single"
                onGridEvent={onGridEvent}
                externalFilter={{
                    dateFrom,
                    dateTo,
                }}
                frameworkComponents={{
                    publishErrors: PublishErrors,
                    titleNameCellRenderer: TitleNameCellRenderer,
                    status: Status,
                }}
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

const mapStateToProps = state => ({
    dateFrom: selectSyncLogDateFrom(state),
    dateTo: selectSyncLogDateTo(state),
});

const mapDispatchToProps = dispatch => ({
    setDateFrom: dateFrom => dispatch(createSaveDateFromAction(dateFrom)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncLogTable);
export {SyncLogTable};

SyncLogTable.propTypes = {
    setDateFrom: PropTypes.func.isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
};
