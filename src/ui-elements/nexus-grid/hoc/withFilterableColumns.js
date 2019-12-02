import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {isObject, switchCase} from '../../../util/Common';
import {GRID_EVENTS} from '../constants';

const DEFAULT_HOC_PROPS = [
    'initialFilter',
    'filterableColumns',
    'notFilterableColumns',
    'mapping',
    'selectValues'
];

const FILTERABLE_DATA_TYPES = [
    'string',
    'number',
    'boolean',
    'select',
    'multiselect'
];

const NOT_FILTERABLE_COLUMNS = ['id'];

const DEFAULT_FILTER_PARAMS = {
    filterOptions: ['equals'],
    suppressAndOrCondition: true,
    debounceMs: 1000,
};

const FILTER_TYPE = {
    string: 'agTextColumnFilter',
    number: 'agNumberColumnFilter',
    select: 'agSetColumnFilter',
    multiselect: 'agSetColumnFilter',
};

const withFilterableColumns = ({
    hocProps = [],
    filterableColumns = null,
    initialFilter = {},
    notFilterableColumns = NOT_FILTERABLE_COLUMNS,
} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, selectValues} = props;
        const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
        const [gridApi, setGridApi] = useState();
        const columns = props.filterableColumns || filterableColumns;
        const filters = props.initialFilter || initialFilter;
        const excludedFilterColumns = props.notFilterableColumns || notFilterableColumns;

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
                        if (dataType === 'select' || dataType === 'multiselect') {
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
            } 
        }, [gridApi, mapping]);

        function updateColumnDefs(columnDefs) {
            const filterableColumnDefs = columnDefs.map(columnDef => {
                let copiedColumnDef = {...columnDef};
                const {dataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === copiedColumnDef.field))) || {};
                const isFilterable = FILTERABLE_DATA_TYPES.includes(dataType)
                    && (columns ? columns.includes(copiedColumnDef.field) : true)
                    && !excludedFilterColumns.includes(copiedColumnDef.field);
                if (isFilterable) {
                    copiedColumnDef.filter = switchCase(FILTER_TYPE)('agTextColumnFilter')(dataType);
                    copiedColumnDef.filterParams = setFilterParams(dataType, copiedColumnDef.field);
                }

                return copiedColumnDef;
            });

            return filterableColumnDefs;
        }

        const onGridEvent = ({type, api}) => {
            if (type === GRID_EVENTS.FIRST_DATA_RENDERED) {
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
                case 'string':
                case 'number': 
                    return DEFAULT_FILTER_PARAMS;
                case 'select': 
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
            const parsedselectValues = options.map(option => {
                if (isObject(option)) {
                    return option.value;
                }
                return option;
            });
            return parsedselectValues;
        };

        const propsWithoutHocProps = omit(props, [...DEFAULT_HOC_PROPS, ...hocProps]);

        return (
            filterableColumnDefs.length ? (
                <WrappedComponent 
                    {...propsWithoutHocProps}
                    columnDefs={filterableColumnDefs}
                    floatingFilter={true}
                    onGridEvent={onGridEvent}
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

