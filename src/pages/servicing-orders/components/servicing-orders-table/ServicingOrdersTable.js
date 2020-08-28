import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import {camelCase, get, startCase} from 'lodash';
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
    const selectedItems = [];

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
            if (columnDef.field === 'checkbox_column') {
                // we use atlaskit checkbox here because ag-grid row selection does not
                // allow disabled states for checkboxes, only presence or absence of a checkbox.
                return {
                    ...columnDef,
                    cellClass: 'nexus-c-servicing-orders-table__checkbox-cell',
                    cellRendererFramework: params => {
                        const temp = Math.floor(Math.random() * 1 + 0.5);
                        params.data.tenant = temp === 1 ? 'MGM' : 'BobCo';

                        if (params.data.tenant !== 'MGM') {
                            // provide a faux checkbox that a user can mouse to receive a tooltip.  The
                            // tooltip as presented lets the user know that the given SO cannot be exported.
                            return (
                                <>
                                    <Tooltip content="This servicing order cannot be exported" position="right">
                                        <div className="nexus-c-servicing-orders-table__checkbox--disabled" />
                                    </Tooltip>
                                </>
                            );
                        } 
                            // provide a cell checkbox using atlaskit
                            return (
                                <>
                                    <Checkbox
                                        value={params.data.soNumber}
                                        onChange={() => onCheckboxChange(params)}
                                        isDisabled={params.data.tenant !== 'MGM'}
                                    />
                                </>
                            );
                        
                    },
                };
            }

            if (columnDef.field === 'rush_order') {
                return {
                    ...columnDef,
                    valueFormatter: valueFormatter(columnDef),
                    cellRendererFramework: params => {
                        return params.value === 'Y' || params.value === true ? (
                            <Tag text="Rush" color="yellowLight" />
                        ) : null;
                    },
                };
            }

            if (columnDef.field === 'status') {
                return {
                    ...columnDef,
                    valueFormatter: valueFormatter(columnDef),
                    cellRenderer: 'tooltipCellRenderer',
                    cellRendererParams: params => {
                        return {soNumber: get(params, 'data.so_number', '')};
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

    const onCheckboxChange = params => {
        const totalRows = params.api.getVirtualRowCount();
        if (event.target.checked) {
            addRowSelection(params.data, totalRows);
        } else {
            removeRowSelection(params.data, totalRows);
        }
    };

    const addRowSelection = (data, total) => {
        selectedItems.push(data);
        setSelectedServicingOrders(selectedItems);
        setStatusBarInfo({selectedRows: selectedItems.length, totalRows: total});
    };

    const removeRowSelection = (data, total) => {
        selectedItems.pop(data);
        setSelectedServicingOrders(selectedItems);
        setStatusBarInfo({selectedRows: selectedItems.length, totalRows: total});
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
