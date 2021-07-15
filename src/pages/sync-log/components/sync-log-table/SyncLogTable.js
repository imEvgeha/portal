import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import NexusDatePicker from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import {dateToISO} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import moment from 'moment';
import {connect} from 'react-redux';
import {compose} from 'redux';
import columnMappings from '../../columnMappings';
import {createSaveDateFromAction, createSaveDateToAction} from '../../syncLogActions';
import {DOWNLOAD_BTN, ERROR_TABLE_COLUMNS, ERROR_TABLE_TITLE} from '../../syncLogConstants';
import {selectSyncLogDateFrom, selectSyncLogDateTo} from '../../syncLogSelectors';
import {getSyncLog, exportSyncLog} from '../../syncLogService';
import PublishErrors from '../PublishErrors/PublishErrors';
import TitleNameCellRenderer from '../TitleNamecCellRenderer/TitleNameCellRenderer';
import './SyncLogTable.scss';

const SyncLogGrid = compose(withColumnsResizing(), withInfiniteScrolling({fetchData: getSyncLog}))(NexusGrid);
const FROM_DATE_ERROR = 'FUTURE DATES ARE NOT ALLOWED!';
const TO_DATE_ERROR = 'THIS DATE MUST BE AFTER YOUR FROM DATE';

const SyncLogTable = ({setDateFrom, dateFrom, setDateTo, dateTo}) => {
    const [gridApi, setGridApi] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [errorsData, setErrorsData] = useState([]);
    const [dateError, setDateError] = useState(null);

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
                setGridApi(api);
                break;
            default:
                break;
        }
    };

    const onDateFromChange = dateFrom => {
        if (moment().isBefore(dateFrom)) {
            setDateError('from');
        } else {
            setDateError(null);
        }
        setDateFrom(dateFrom);
    };
    const onDateToChange = dateTo => {
        if (moment(dateFrom).isAfter(dateTo)) {
            setDateError('to');
        } else {
            setDateError(null);
            setDateTo(dateTo);
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
            <div className="nexus-c-sync-log-table__actions">
                <div />
                <div className="nexus-c-sync-log-table__date-filter">
                    <div className="nexus-c-sync-log-table__date-field">
                        <NexusDatePicker
                            id="dateFrom"
                            label="Date From"
                            onChange={onDateFromChange}
                            value={dateFrom}
                            isReturningTime={false}
                            isRequired
                        />
                        <div className="nexus-c-sync-log-table__date-field--error">
                            {dateError === 'from' && FROM_DATE_ERROR}
                        </div>
                    </div>
                    <div className="nexus-c-sync-log-table__date-field">
                        <NexusDatePicker
                            id="dateTo"
                            label="Date To"
                            onChange={onDateToChange}
                            value={dateTo}
                            isReturningTime={false}
                        />
                        <div className="nexus-c-sync-log-table__date-field--error">
                            {dateError === 'to' && TO_DATE_ERROR}
                        </div>
                    </div>
                </div>
                <Button onClick={() => exportSyncLog(dateFrom, dateTo)} isDisabled={!gridApi}>
                    {DOWNLOAD_BTN}
                </Button>
            </div>
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
    setDateTo: dateTo => dispatch(createSaveDateToAction(dateTo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncLogTable);
export {SyncLogTable};

SyncLogTable.propTypes = {
    setDateFrom: PropTypes.func.isRequired,
    dateFrom: PropTypes.string.isRequired,
    setDateTo: PropTypes.func.isRequired,
    dateTo: PropTypes.string.isRequired,
};
