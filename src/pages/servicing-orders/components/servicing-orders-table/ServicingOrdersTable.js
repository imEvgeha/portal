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
import ServicingOrdersTableStatusBar from '../servicing-orders-table-status-bar/ServicingOrdersTableStatusBar';
import './ServicingOrdersTable.scss';

const ServicingOrderGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = ({fixedFilter, externalFilter, setSelectedServicingOrders, refreshData, dataRefreshComplete}) => {
    const [statusBarInfo, setStatusBarInfo] = useState({
        totalRows: 0,
        selectedRows: 0,
    });
    const [gridApi, setGridApi] = useState(null);

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
            cellRenderer: columnDef.isEmphasized ? 'emphasizedStringCellRenderer' : 'loadingCellRenderer',
        }));
    };

    /**
     * Callback when datatable is first rendered on the DOM
     * @param {object} param
     */
    const onFirstDataRendered = ({api}) => {
        // Resizes the table to fit the current width when first rendered.
        // Needs to be removed if more table rows are added to prevent overcrowding
        api.sizeColumnsToFit();
        setGridApi(api);
    };

    /**
     * Runs when the selections are changed.
     * This current function is being used to gather an array of so_numbers of the selected rows
     * @param params - the grid params object containing the api
     */
    const onSelectionChanged = ({api}) => {
        const selectedRowsData = api.getSelectedNodes().map(node => node.data);

        // set the new array to state
        setSelectedServicingOrders(selectedRowsData);
        setStatusBarInfo({...statusBarInfo, selectedRows: selectedRowsData.length});
    };

    const setTotalCount = total => {
        setStatusBarInfo({...statusBarInfo, totalRows: total});
    };

    const [columns, setColumns] = useState(updateColumnDefs(columnDefs));

    useEffect(
        () => {
            setColumns(updateColumnDefs(columnDefs));
        },
        [columnDefs]
    );

    useEffect(
        () => {
            if (refreshData) {
                // Refresh data
                gridApi.purgeInfiniteCache();

                // Remove all selections
                gridApi.deselectAll();
                setSelectedServicingOrders([]);

                dataRefreshComplete();
            }
        },
        [refreshData]
    );

    return (
        <div className="nexus-c-servicing-orders-table">
            <ServicingOrderGrid
                columnDefs={columns}
                mapping={columnDefs}
                frameworkComponents={{
                    emphasizedStringCellRenderer: EmphasizedCellRenderer,
                }}
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
                onFirstDataRendered={onFirstDataRendered}
                customDateFilterParamSuffixes={['Start', 'End']}
                onSelectionChanged={onSelectionChanged}
                rowSelection="multiple"
                // lets users deselect a row with cmd/ctrl + click
                rowDeselection={true}
                setTotalCount={setTotalCount}
            />
            <ServicingOrdersTableStatusBar statusBarInfo={statusBarInfo} />
        </div>
    );
};

export default ServicingOrdersTable;
