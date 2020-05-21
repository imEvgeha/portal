import React from 'react';
import {compose} from 'redux';
import {servicingOrdersService} from '../../servicingOrdersService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import EmphasizedCellRenderer
    from '../../../../ui/elements/nexus-grid/elements/cell-renderer/emphasized-cell-renderer/EmphasizedCellRenderer';
import columnDefs from '../../columnMappings.json';
import './ServicingOrdersTable.scss';

const ServicingOrderGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = () => {
    const updateColumnDefs = (columnDefs) => {
        return columnDefs.map(columnDef => (
                {
                    ...columnDef,
                    valueFormatter: createValueFormatter(columnDef),
                    cellRenderer: (columnDef.isEmphasized)
                        ? 'emphasizedCellRenderer'
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
                    emphasizedCellRenderer: EmphasizedCellRenderer,
                }}
            />
        </div>
    );
};

export default ServicingOrdersTable;