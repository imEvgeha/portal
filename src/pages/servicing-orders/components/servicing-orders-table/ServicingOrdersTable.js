import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import Tag from '@atlaskit/tag';
import {camelCase, startCase} from 'lodash';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import {ISODateToView} from '../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../util/date-time/constants';
import columnDefs from '../../columnMappings.json';
import {servicingOrdersService} from '../../servicingOrdersService';
import ServicingOrdersTableStatusBar from '../servicing-orders-table-status-bar/ServicingOrdersTableStatusBar';
import './ServicingOrdersTable.scss';

const ServicingOrderGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = ({
    fixedFilter,
    externalFilter,
    setSelectedServicingOrders,
    isRefreshData,
    dataRefreshComplete,
}) => {
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
            default:
                break;
        }
    };

    const updateColumnDefs = useCallback(columnDefs => {
        return columnDefs.map(columnDef => {
            if (columnDef.field === 'rush_order') {
                return {
                    ...columnDef,
                    valueFormatter: valueFormatter(columnDef),
                    cellRendererFramework: params => {
                        return params.value ? <Tag text="Rush" color="yellowLight" /> : null;
                    },
                };
            }

            return {
                ...columnDef,
                valueFormatter: valueFormatter(columnDef),
                cellRenderer: 'loadingCellRenderer',
            };
        });
    }, []);

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

    useEffect(() => {
        setColumns(updateColumnDefs(columnDefs));
    }, [setColumns, updateColumnDefs]);

    useEffect(() => {
        if (isRefreshData) {
            // Refresh data
            gridApi.purgeInfiniteCache();

            // Remove all selections
            gridApi.deselectAll();
            setSelectedServicingOrders([]);

            dataRefreshComplete();
        }
    }, [isRefreshData, dataRefreshComplete, gridApi, setSelectedServicingOrders]);

    return (
        <div className="nexus-c-servicing-orders-table">
            <ServicingOrderGrid
                columnDefs={columns}
                mapping={columnDefs}
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

ServicingOrdersTable.propTypes = {
    fixedFilter: PropTypes.object,
    externalFilter: PropTypes.object,
    setSelectedServicingOrders: PropTypes.func,
    isRefreshData: PropTypes.bool,
    dataRefreshComplete: PropTypes.func,
};

ServicingOrdersTable.defaultProps = {
    fixedFilter: {},
    externalFilter: {},
    setSelectedServicingOrders: null,
    isRefreshData: false,
    dataRefreshComplete: null,
};

export default ServicingOrdersTable;
