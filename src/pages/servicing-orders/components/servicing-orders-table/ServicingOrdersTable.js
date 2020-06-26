import {camelCase, startCase} from 'lodash';
import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import EmphasizedCellRenderer from '../../../../ui/elements/nexus-grid/elements/cell-renderer/emphasized-cell-renderer/EmphasizedCellRenderer';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import {DATETIME_FIELDS} from '../../../../util/date-time/constants';
import {ISODateToView} from '../../../../util/date-time/DateTimeUtils';
import columnDefs from '../../columnMappings.json';
import {servicingOrdersService} from '../../servicingOrdersService';
import './ServicingOrdersTable.scss';

const ServicingOrderGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = ({fixedFilter, externalFilter}) => {
    const valueFormatter = ({dataType = '', field = '', isEmphasized = false}) => {
        switch (dataType) {
            case 'string':
                return params => {
                    const {data = {}} = params || {};
                    const {[field]: value = ''} = data || {};
                    // Capitalizes every word and removes non-alphanumeric characters if string is emphasized
                    return isEmphasized ? startCase(camelCase(value)) : value;
                };
            case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                return params => {
                    const {data = {}} = params || {};
                    const {[field]: date = ''} = data || {};
                    return ISODateToView(date, dataType);
                };
        }
    };

    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => ({
            ...columnDef,
            valueFormatter: valueFormatter(columnDef),
            cellRenderer: columnDef.isEmphasized ? 'emphasizedStringCellRenderer' : 'loadingCellRenderer'
        }));
    };

    const onFirstDataRendered = params => {
        // Resizes the table to fit the current width.
        // Needs to be removed if more table rows are added to prevent overcrowding
        params.api.sizeColumnsToFit();
    };

    const [columns, setColumns] = useState(updateColumnDefs(columnDefs));

    useEffect(
        () => {
            setColumns(updateColumnDefs(columnDefs));
        },
        [columnDefs]
    );

    return (
        <div className="nexus-c-servicing-orders-table">
            <ServicingOrderGrid
                columnDefs={columns}
                mapping={columnDefs}
                frameworkComponents={{
                    emphasizedStringCellRenderer: EmphasizedCellRenderer
                }}
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
                customDateFilterParamSuffixes={['Start', 'End']}
                onFirstDataRendered={onFirstDataRendered}
            />
        </div>
    );
};

export default ServicingOrdersTable;
