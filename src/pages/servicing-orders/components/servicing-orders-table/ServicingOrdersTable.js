import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {SimpleTag as Tag} from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {camelCase, get, startCase} from 'lodash';
import moment from 'moment';
import {compose} from 'redux';
import columnDefs from '../../columnMappings.json';
import {servicingOrdersService} from '../../servicingOrdersService';
import ServicingOrdersTableStatusBar from '../servicing-orders-table-status-bar/ServicingOrdersTableStatusBar';
import TooltipCellRenderer from '../tooltip-cell-renderer/TooltipCellRenderer';
import './ServicingOrdersTable.scss';

const ServicingOrderGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: servicingOrdersService.getServicingOrders})
)(NexusGrid);

const ServicingOrdersTable = ({
    fixedFilter,
    externalFilter,
    setSelectedServicingOrders,
    isRefreshData,
    dataRefreshComplete,
}) => {
    let selectedItems = [];

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
                        const defaultSelected = isAlreadySelected(params);

                        if (get(params, 'data.tenant', '') !== 'MGM') {
                            // provide a faux checkbox that a user can mouse to receive a tooltip.  The
                            // tooltip as presented lets the user know that the given SO cannot be exported.
                            // This is necessary because Atlaskit wraps native checkbox, and native checkbox has no
                            // visually disabled state.
                            return (
                                <Tooltip content="This servicing order cannot be exported" position="right">
                                    <div className="nexus-c-servicing-orders-table__checkbox--disabled" />
                                </Tooltip>
                            );
                        }
                        // provide a cell checkbox using atlaskit
                        return (
                            <Checkbox
                                value={params.data.soNumber}
                                onChange={e => onCheckboxChange(e, params)}
                                defaultChecked={defaultSelected}
                                isDisabled={params.data.tenant !== 'MGM'}
                            />
                        );
                    },
                };
            }

            if (columnDef.field === 'sr_due_date') {
                return {
                    ...columnDef,
                    valueFormatter: valueFormatter(columnDef),
                    cellStyle: params => {
                        const dueDate = ISODateToView(params.value, DATETIME_FIELDS.REGIONAL_MIDNIGHT);
                        const daysDiff = moment().diff(dueDate, 'days');
                        if (daysDiff >= 0) return {color: 'red'};
                        // last day or expired
                        // eslint-disable-next-line no-magic-numbers
                        else if (daysDiff >= -3 && daysDiff <= -1) return {color: 'orange'}; // 3 days or less
                        return null;
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

    const onCheckboxChange = (e, params) => {
        const totalRows = params.api.getInfiniteRowCount();
        if (e.target.checked) {
            addRowSelection(params, totalRows);
        } else {
            removeRowSelection(params, totalRows);
        }
    };

    const addRowSelection = (params, total) => {
        selectedItems.push(params.data);
        setSelectedServicingOrders(selectedItems);
        setStatusBarInfo({selectedRows: selectedItems.length, totalRows: total});
    };

    const removeRowSelection = (params, total) => {
        const filteredItems = selectedItems.filter(item => item.so_number !== params.data.so_number);

        if (filteredItems.length < 1) {
            setSelectedServicingOrders(prevState => (prevState.length = 0));
        } else {
            setSelectedServicingOrders(filteredItems);
        }

        setStatusBarInfo({selectedRows: filteredItems.length, totalRows: total});
        selectedItems = filteredItems;
    };

    const isAlreadySelected = params => {
        const foundItem = params.data ? selectedItems.filter(item => item.so_number === params.data.so_number) : [];
        return foundItem && foundItem.length > 0;
    };

    const resetSelectedItems = () => {
        selectedItems = [];
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
            resetSelectedItems();

            // Refresh data
            gridApi.purgeInfiniteCache();

            // Remove all selections
            gridApi.deselectAll();
            setSelectedServicingOrders(prevState => (prevState.length = 0));
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
                setTotalCount={setTotalCount}
                frameworkComponents={{tooltipCellRenderer: TooltipCellRenderer}}
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
