import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import cloneDeep from 'lodash.clonedeep';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {isObject, switchCase} from '../../../util/Common';
import {
    GRID_EVENTS,
    DEFAULT_HOC_PROPS,
    FILTERABLE_DATA_TYPES,
    FILTER_TYPE,
    DEFAULT_FILTER_PARAMS,
    NOT_FILTERABLE_COLUMNS,
    EXCLUDED_INITIAL_FILTER_VALUES,
    AG_GRID_COLUMN_FILTER,
} from '../constants';
import usePrevious from '../../../util/hooks/usePrevious';
import CustomDateFilter from './components/CustomDateFilter/CustomDateFilter';
import CustomDateFloatingFilter from './components/CustomDateFloatingFilter/CustomDateFloatingFilter';
import get from 'lodash.get';
import pickBy from 'lodash.pickby';

const withFilterableColumns = ({
    hocProps = [],
    filterableColumns = null,
    initialFilter = null,
    notFilterableColumns = NOT_FILTERABLE_COLUMNS,
    prepareFilterParams = (params) => params,
} = {}) => WrappedComponent => {
    const ComposedComponent = (props) => {
        const {columnDefs, mapping, selectValues, params} = props;
        const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
        const [gridApi, setGridApi] = useState();
        const columns = props.filterableColumns || filterableColumns;
        const filters = pickBy(props.initialFilter || initialFilter || {}, val => !(EXCLUDED_INITIAL_FILTER_VALUES.includes(val)));
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
                const {field} = columnDef;
                const isFilterable = FILTERABLE_DATA_TYPES.includes(dataType)
                    && (columns ? columns.includes(columnDef.field) : true)
                    && !excludedFilterColumns.includes(columnDef.field);

                if (isFilterable) {
                    const {TEXT, NUMBER, SET, CUSTOM_DATE} = AG_GRID_COLUMN_FILTER;
                    const {BOOLEAN, INTEGER, DOUBLE, YEAR, SELECT, MULTISELECT, TERRITORY, DATE, LOCAL_DATE, DATE_TIME} = FILTER_TYPE;

                    switch (dataType) {
                        case BOOLEAN:
                            columnDef.filter = TEXT;
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                values: [false, true]
                            };
                            break;
                        case INTEGER:
                        case DOUBLE:
                        case YEAR: 
                            columnDef.filter = NUMBER;
                            break;
                        case SELECT:
                        case MULTISELECT:
                            columnDef.filter = SET;
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                values: getFilterOptions(field),
                            };
                            break;
                        case TERRITORY: 
                            columnDef.filter = SET;
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                values: getFilterOptions(field),
                            };
                            columnDef.keyCreator = params => {
                                const countries = params.value.map(({country}) => country);
                                return countries;
                            };
                            break;
                        case DATE:
                        case DATE_TIME:
                        case LOCAL_DATE:
                            const from = filters[field] && filters[field][`${field}From`];
                            const to = filters[field] && filters[field][`${field}To`];
                            const initialFilters = {
                                ...(from && {from}),
                                ...(to && {to})
                            };
                            columnDef.floatingFilterComponent = 'customDateFloatingFilter';
                            columnDef.filter = CUSTOM_DATE;
                            columnDef.filterParams = {
                                // TODO; check is this neccessary
                                ...DEFAULT_FILTER_PARAMS,
                                filterOptions: ['inRange'],
                                //
                                initialFilters,
                            };
                            break;
                        default:
                            columnDef.filter = TEXT;
                            columnDef.filterParams = DEFAULT_FILTER_PARAMS;
                    }
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
                GRID_EVENTS.ROW_DATA_CHANGED,
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

        const getFilterOptions = (field) => {
            //TODO: refresh and show values when loaded
            const options = get(selectValues, field, []);
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
