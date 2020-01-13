import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import cloneDeep from 'lodash.clonedeep';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {isObject, switchCase} from '../../../util/Common';
import {GRID_EVENTS} from '../constants';
import booleanFilterCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/booleanFilterCellRenderer';

const DEFAULT_HOC_PROPS = [
    'initialFilter',
    'filterableColumns',
    'notFilterableColumns',
    'mapping',
    'selectValues'
];

const FILTERABLE_DATA_TYPES = [
    'string',
    'integer',
    'double',
    'boolean',
    'select',
    'multiselect',
    'territoryType',
    'year',
    'duration',
];

const NOT_FILTERABLE_COLUMNS = ['id'];

const DEFAULT_FILTER_PARAMS = {
    filterOptions: ['equals'],
    suppressAndOrCondition: true,
    debounceMs: 1000,
};

const FILTER_TYPE = {
    boolean: 'agSetColumnFilter',
    string: 'agTextColumnFilter',
    duration: 'agTextColumnFilter',
    integer: 'agNumberColumnFilter',
    double: 'agNumberColumnFilter',
    year: 'agNumberColumnFilter',
    select: 'agSetColumnFilter',
    multiselect: 'agSetColumnFilter',
    territoryType: 'agSetColumnFilter',
};

const withFilterableColumns = ({
    hocProps = [],
    filterableColumns = null,
    initialFilter = null,
    notFilterableColumns = NOT_FILTERABLE_COLUMNS,
} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, selectValues} = props;
        const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
        const [gridApi, setGridApi] = useState();
        const columns = props.filterableColumns || filterableColumns;
        const filters = props.initialFilter || initialFilter;
        const excludedFilterColumns = props.notFilterableColumns || notFilterableColumns;
        const [isDatasourceEnabled, setIsDatasourceEnabled] = useState(!filters);

        useEffect(() => {
            if (!!columnDefs.length && isObject(selectValues) && !!Object.keys(selectValues).length) {
               setFilterableColumnDefs(updateColumnDefs(columnDefs));
            }
        }, [columnDefs, selectValues]);

        // apply initial filter
        useEffect(() => {
            if (gridApi && !isEmpty(filters) && Array.isArray(mapping) && mapping.length) {
                Object.keys(filters).forEach(key => {
                    const {dataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === key))) || {};
                    const filterInstance = gridApi.getFilterInstance(key);
                    if (filterInstance) {
                        if (dataType === 'select' || dataType === 'multiselect' || dataType === 'territoryType') {
                            const filterValues = Array.isArray(filters[key]) ? filters[key] : filters[key].split(',');
                            applySetFilter(filterInstance, filterValues.map(el => el.trim()));
                        } else {
                            filterInstance.setModel({
                                type: 'equals',
                                filter: filters[key],
                            });
                        }
                    }
                });
                gridApi.onFilterChanged();
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

                return columnDef;
            });
//
            return filterableColumnDefs;
        }

        const onGridEvent = ({type, api}) => {
            if (type === GRID_EVENTS.READY) {
                setGridApi(api);
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
                        values: [false, true],
                        cellRenderer: booleanFilterCellRenderer
                    };
                case 'string':
                case 'integer':
                case 'double':
                case 'year':
                case 'duration':
                    return DEFAULT_FILTER_PARAMS;
                case 'select':
                case 'territoryType':
                case 'multiselect': 
                    return {
                        ...DEFAULT_FILTER_PARAMS, 
                        values: getFilterOptions(field),
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
                    isDatasourceEnabled={isDatasourceEnabled}
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
