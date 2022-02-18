import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {dateToISO} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {compose} from 'redux';
import { STATUS_TAB } from '../rights-repository/constants';
import { getStatusLog } from './StatusLogService';
import columnMappings from './columnMappings';
import './StatusLogRightsTable.scss';

const StatusLogRightsGrid = compose(
    withSideBar(),
    withColumnsResizing(), 
    withFilterableColumns(),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getStatusLog})
)(NexusGrid);

const StatusLogRightsTable = ({setDateFrom, dateFrom, dateTo, activeTab}) => {

    const getColumnDefs = () => {
        return columnMappings.map(col => ({
            ...col,
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

    useEffect(() => {
        if (dateFrom === '') {
            setDateFrom(dateToISO(new Date(), DATETIME_FIELDS.REGIONAL_MIDNIGHT));
        }
    }, [dateFrom]);

    return (
        <div className="nexus-c-sync-log-table">
            <StatusLogRightsGrid
                className="nexus-c-sync-log-grid"
                columnDefs={getColumnDefs()}
                mapping={columnMappings}
                rowSelection="single"
                onGridEvent={onGridEvent}
                isGridHidden={activeTab !== STATUS_TAB}
            />
        </div>
    );
};

export {StatusLogRightsTable};

StatusLogRightsTable.propTypes = {
    setDateFrom: PropTypes.func.isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
    activeTab: PropTypes.string.isRequired,
};
