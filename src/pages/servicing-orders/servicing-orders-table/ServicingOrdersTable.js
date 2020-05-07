import React from 'react';
import {camelCase, startCase} from 'lodash';
import {compose} from 'redux';
import {servicingOrdersService} from './servicingOrdersService';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import EmphasizedStringCellRenderer
    from '../../../ui/elements/nexus-grid/elements/cell-renderer/emphasized-string-cell-renderer/EmphasizedStringCellRenderer';
import columnDefs from '../../../../profile/servicingOrdersMapping.json';
import {ISODateToView} from '../../../util/DateTimeUtils';
import './ServicingOrdersTable.scss';

const ServicingOrderGrid = compose(
    withSideBar(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = () => {
    const valueFormatter= ({dataType = '', field = ''}) => {
        switch (dataType) {
            case 'emphasizedString':
                return (params) => {
                    const {data = {}} = params || {};
                    const {[field]: value = ''} = data || {};
                    return startCase(camelCase(value)); // Capitalizes every word and removes non-alphanumeric characters
                };
            case 'date':
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
                cellRenderer: (columnDef.dataType === 'emphasizedString')
                    ? 'emphasizedStringCellRenderer'
                    : 'loadingCellRenderer',
            }
        ));
    };

    return (
        <div className="nexus-c-servicing-orders-table">
            <ServicingOrderGrid
                columnDefs={updateColumnDefs(columnDefs)}
                frameworkComponents={{
                    emphasizedStringCellRenderer: EmphasizedStringCellRenderer,
                }}
            />
        </div>
    );
};

export default ServicingOrdersTable;
