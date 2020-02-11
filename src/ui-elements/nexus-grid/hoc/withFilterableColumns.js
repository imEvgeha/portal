import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import cloneDeep from 'lodash.clonedeep';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {isObject, switchCase} from '../../../util/Common';
import {GRID_EVENTS, DEFAULT_HOC_PROPS, FILTERABLE_DATA_TYPES,
    FILTER_TYPE, DEFAULT_FILTER_PARAMS, NOT_FILTERABLE_COLUMNS} from '../constants';
import usePrevious from '../../../util/hooks/usePrevious';
import CustomDateFilter from './components/CustomDateFilter/CustomDateFilter';
import CustomDateFloatingFilter from './components/CustomDateFloatingFilter/CustomDateFloatingFilter';

const withFilterableColumns = ({
    hocProps = [],
    filterableColumns = null,
    initialFilter = null,
    notFilterableColumns = NOT_FILTERABLE_COLUMNS,
    prepareFilterParams = null,
} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, selectValues, params} = props;
        const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
        const [gridApi, setGridApi] = useState();
        const columns = props.filterableColumns || filterableColumns;
        const filters = props.initialFilter || initialFilter || {};
        const excludedFilterColumns = props.notFilterableColumns || notFilterableColumns;
        const [isDatasourceEnabled, setIsDatasourceEnabled] = useState(!filters);
        const previousFilters = usePrevious(filters);

        useEffect(() => {
            if (!!columnDefs.length && isObject(selectValues) && !!Object.keys(selectValues).length) {
               setFilterableColumnDefs(updateColumnDefs(columnDefs));
            }
        }, [columnDefs, selectValues]);

        // apply initial filter
        useEffect(() => {
            if (gridApi && !isEmpty(filters) && Array.isArray(mapping) && mapping.length) {
                Object.keys(filters).forEach(key => {
                    const field = key.replace(/Match/, '');
                    const filterInstance = gridApi.getFilterInstance(field);
                    if (filterInstance) {
                        const {dataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === field))) || {};
                        if (dataType === 'select' || dataType === 'multiselect' || dataType === 'territoryType') {
                            const filterValues = Array.isArray(filters[key]) ? filters[key] : filters[key].split(',');
                            applySetFilter(filterInstance, filterValues.map(el => el.trim()));
                            return;
                        }
                        filterInstance.setModel({
                            type: 'equals',
                            filter: filters[key],
                        });
                    }
                });
                gridApi.onFilterChanged();
                setIsDatasourceEnabled(true);
            } else if (isEmpty(filters)) {
                setIsDatasourceEnabled(true);
            }
        }, [gridApi, mapping]);

        function updateColumnDefs(columnDefs) {
            const copiedColumnDefs = cloneDeep(columnDefs);
            const filterableColumnDefs = copiedColumnDefs.map(columnDef => {
                const {dataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === columnDef.field))) || {};
                const isFilterable = FILTERABLE_DATA_TYPES.includes(dataType)
                    && (columns ? columns.includes(columnDef.field) : true)
                    && !excludedFilterColumns.includes(columnDef.field);
                if (isFilterable) {
                    columnDef.filter = switchCase(FILTER_TYPE)('agTextColumnFilter')(dataType);
                    columnDef.filterParams = setFilterParams(dataType, columnDef.field);
                }
                if (dataType === 'datetime') {
                    const initialFilters = {
                        from: filters[`${columnDef.field}From`],
                        to: filters[`${columnDef.field}To`]
                    };
                    columnDef.floatingFilterComponent = 'customDateFloatingFilter';
                    columnDef.filter = 'customDateFilter';
                    columnDef.filterParams = {initialFilters};
                }
                return columnDef;
            });

            return filterableColumnDefs;
        }

        const onGridEvent = (data) => {
            const {api, type} = data || {};
            const {onGridEvent} = props;
            const events = [
                GRID_EVENTS.READY,
                GRID_EVENTS.FIRST_DATA_RENDERED,
                GRID_EVENTS.SELECTION_CHANGED,
                GRID_EVENTS.FILTER_CHANGED,
            ];

            if (type === GRID_EVENTS.READY) {
                setGridApi(api);
            }

            if (events.includes(type) && typeof onGridEvent === 'function') {
                props.onGridEvent(data);
            }
        };

        // TODO: create separate file for filter API methods
        const applySetFilter = (field, values = []) => {
            // clear filter 
            field.selectNothing();
            // select values
            values.forEach(value => field.selectValue(value));
            // APPLY THE MODEL
            field.applyModel();
        };

        const setFilterParams = (dataType, field) => {
            switch (dataType) {
                case 'boolean':
                    return {
                        ...DEFAULT_FILTER_PARAMS,
                        values: [false, true]
                    };
                case 'select':
                case 'territoryType':
                case 'multiselect': 
                    return {
                        ...DEFAULT_FILTER_PARAMS, 
                        values: getFilterOptions(field),
                    };
                case 'datetime':
                    return {
                        ...DEFAULT_FILTER_PARAMS,
                        filterOptions: ['inRange'],
                    };
                default:
                    return DEFAULT_FILTER_PARAMS;
            }
        };

        const getFilterOptions = (field) => {
            const options = selectValues ? selectValues[field] : [];
            const parsedSelectValues = options.map(option => {
                if (isObject(option)) {
                    //TODO: This is just a temporary solution for territory fields
                    return option.value || option.countryCode;
                }
                return option;
            });
            return parsedSelectValues;
        };

        const propsWithoutHocProps = omit(props, [...DEFAULT_HOC_PROPS, ...hocProps]);

        return (
            filterableColumnDefs.length ? (
                <WrappedComponent 
                    {...propsWithoutHocProps}
                    columnDefs={filterableColumnDefs}
                    floatingFilter={true}
                    onGridEvent={onGridEvent}
                    frameworkComponents={{
                        customDateFloatingFilter: CustomDateFloatingFilter,
                        customDateFilter: CustomDateFilter
                    }}
                    isDatasourceEnabled={isDatasourceEnabled}
                    prepareFilterParams={prepareFilterParams}
                />
            ) : null
        );
    };

    const createMapStateToProps = () => {
        const availSelectValuesSelector = createAvailSelectValuesSelector();
        return (state, props) => ({
            selectValues: availSelectValuesSelector(state, props),
        });
    };

    return connect(createMapStateToProps)(ComposedComponent); // eslint-disable-line
};

export default withFilterableColumns;
