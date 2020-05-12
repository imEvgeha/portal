import React from 'react';
import {camelCase, startCase} from 'lodash';
import {compose} from 'redux';
import {servicingOrdersService} from './servicingOrdersService';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import EmphasizedCellRenderer
    from '../../../ui/elements/nexus-grid/elements/cell-renderer/emphasized-cell-renderer/EmphasizedCellRenderer';
import columnDefs from '../columnMappings.json';
import {DATETIME_FIELDS, ISODateToView} from '../../../util/DateTimeUtils';
import './ServicingOrdersTable.scss';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';

const ServicingOrderGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = ({fixedFilter, externalFilter}) => {
    const valueFormatter= ({dataType = '', field = '', isEmphasized = false}) => {
        switch (dataType) {
            case 'string':
                return (params) => {
                    const {data = {}} = params || {};
                    const {[field]: value = ''} = data || {};
                    // Capitalizes every word and removes non-alphanumeric characters if string is emphasized
                    return isEmphasized ? startCase(camelCase(value)) : value;
                };
            case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                return (params) => {
                    const {data = {}} = params || {};
                    const {[field]: date = ''} = data || {};
                    return ISODateToView(date, dataType);
                };
        }
    };

    const updateColumnDefs = (columnDefs) => {
        return columnDefs.map(columnDef => (
            {
                ...columnDef,
                valueFormatter: valueFormatter(columnDef),
                cellRenderer: (columnDef.isEmphasized)
                    ? 'emphasizedStringCellRenderer'
                    : 'loadingCellRenderer',
            }
        ));
    };

    return (
        <div className="nexus-c-servicing-orders-table">
            <ServicingOrderGrid
                columnDefs={updateColumnDefs(columnDefs)}
                mapping={columnDefs}
                frameworkComponents={{
                    emphasizedStringCellRenderer: EmphasizedCellRenderer,
                }}
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
            />
        </div>
    );
};

export default ServicingOrdersTable;
