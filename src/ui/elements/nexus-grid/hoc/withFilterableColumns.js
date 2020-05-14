import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {cloneDeep, get, isEmpty, omit, pickBy} from 'lodash';
import {createAvailSelectValuesSelector} from '../../../../pages/legacy/containers/avail/availSelectors';
import {fetchAvailMapping} from '../../../../pages/legacy/containers/avail/availActions';
import {isObject} from '../../../../util/Common';
import {
    AG_GRID_COLUMN_FILTER,
    DEFAULT_FILTER_PARAMS,
    DEFAULT_HOC_PROPS,
    EXCLUDED_INITIAL_FILTER_VALUES,
    FILTER_TYPE,
    FILTERABLE_DATA_TYPES,
    GRID_EVENTS,
    NOT_FILTERABLE_COLUMNS,
} from '../constants';
import usePrevious from '../../../../util/hooks/usePrevious';
import CustomDateFilter from '../elements/custom-date-filter/CustomDateFilter';
import CustomDateFloatingFilter from '../elements/custom-date-floating-filter/CustomDateFloatingFilter';
import CustomComplexFilter from '../elements/custom-complex-filter/CustomComplexFilter';
import CustomComplexFloatingFilter from '../elements/custom-complex-floating-filter/CustomComplexFloatingFilter';
import AudioLanguageTypeFormSchema from '../../../../pages/legacy/components/form/AudioLanguageTypeSearchFormSchema';
import CustomReadOnlyFloatingFilter from '../elements/custom-readonly-filter/CustomReadOnlyFloatingFilter';
import CustomReadOnlyFilter from '../elements/custom-readonly-filter/CustomReadOnlyFilter';

const withFilterableColumns = ({
    hocProps = [],
    filterableColumns = null,
    initialFilter = null,
    notFilterableColumns = NOT_FILTERABLE_COLUMNS,
    prepareFilterParams = (params) => params,
} = {}) => WrappedComponent => {
    const ComposedComponent = (props) => {
        const {columnDefs, mapping, selectValues, params, fetchAvailMapping} = props;
        const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
        const [gridApi, setGridApi] = useState();
        const columns = props.filterableColumns || filterableColumns;
        const filters = pickBy(props.initialFilter || initialFilter || {}, val => !(EXCLUDED_INITIAL_FILTER_VALUES.includes(val)));
        const excludedFilterColumns = props.notFilterableColumns || notFilterableColumns;
        const [isDatasourceEnabled, setIsDatasourceEnabled] = useState(!filters);
        const previousFilters = usePrevious(filters);

        // TODO: temporary solution to get select values
        useEffect(() => {
            if (isEmpty(selectValues)) {
                fetchAvailMapping();
            }
        }, [selectValues]);

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
                        const {searchDataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === field))) || {};
                        if (['multiselect', 'territoryType', 'audioTypeLanguage'].includes(searchDataType)) {
                            const filterValues = Array.isArray(filters[key]) ? filters[key] : filters[key].split(',');
                            applySetFilter(filterInstance, filterValues.map(el => typeof el === 'string' && el.trim()));
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

            return copiedColumnDefs.map(columnDef => {
                const {searchDataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === columnDef.field))) || {};
                const {field} = columnDef;
                const isFilterable = FILTERABLE_DATA_TYPES.includes(searchDataType)
                    && (columns ? columns.includes(columnDef.field) : true)
                    && !excludedFilterColumns.includes(columnDef.field);

                if (isFilterable) {
                    const {
                        TEXT,
                        NUMBER,
                        SET,
                        CUSTOM_DATE,
                        CUSTOM_COMPLEX,
                        CUSTOM_READONLY,
                        CUSTOM_FLOAT_READONLY
                    } = AG_GRID_COLUMN_FILTER;

                    const {
                        BOOLEAN,
                        INTEGER,
                        DOUBLE,
                        YEAR,
                        MULTISELECT,
                        TERRITORY,
                        AUDIO_LANGUAGE,
                        TIMESTAMP,
                        BUSINESS_DATETIME,
                        REGIONAL_MIDNIGHT,
                        READONLY
                    } = FILTER_TYPE;

                    switch (searchDataType) {
                        case READONLY:
                            columnDef.floatingFilterComponent = CUSTOM_FLOAT_READONLY;
                            columnDef.filter = CUSTOM_READONLY;
                            columnDef.floatingFilterComponentParams = {
                                suppressFilterButton: true,
                                readOnlyValue: filters[field],
                            };
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                readOnlyValue: filters[field],
                            };
                            break;
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
                        case MULTISELECT:
                            columnDef.filter = SET;
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                values: (Array.isArray(columnDef.options) && !isEmpty(columnDef.options))
                                    ? columnDef.options
                                    : getFilterOptions(field),
                            };
                            break;
                        case TERRITORY:
                            columnDef.filter = SET;
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                values: getFilterOptions(field),
                            };
                            columnDef.keyCreator = params => params.value.map(({country}) => country);
                            break;
                        case AUDIO_LANGUAGE:
                            columnDef.floatingFilterComponent = 'customComplexFloatingFilter';
                            // TODO; generate schema and values for select based on initial schema and found subfields
                            const languages = getFilterOptions(`${field}.language`);
                            const audioTypes = getFilterOptions(`${field}.audioType`);
                            const schema = AudioLanguageTypeFormSchema(languages, audioTypes);
                            columnDef.filter = CUSTOM_COMPLEX;
                            const audioTypeLanguage = filters['audioTypeLanguage'];
                            const audioType = filters['audioType'];
                            const audioLanguageInitialFilters = {
                                ...(audioTypeLanguage && {audioTypeLanguage}),
                                ...(audioType && {audioType})
                            };
                            columnDef.filterParams = {
                                // TODO; check is this neccessary
                                ...DEFAULT_FILTER_PARAMS,
                                initialFilters: audioLanguageInitialFilters,
                                schema
                            };
                            break;
                        case REGIONAL_MIDNIGHT:
                        case TIMESTAMP:
                        case BUSINESS_DATETIME:
                            const from = filters[`${field}From`];
                            const to = filters[`${field}To`];
                            const initialFilters = {
                                ...(from && {from}),
                                ...(to && {to})
                            };
                            columnDef.floatingFilterComponent = 'customDateFloatingFilter';
                            columnDef.filter = CUSTOM_DATE;
                            columnDef.filterParams = {
                                // TODO; check is this necessary
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
            return options.map(option => {
                if (isObject(option)) {
                    //TODO: This is just a temporary solution for territory fields
                    return option.value || option.countryCode;
                }
                return option;
            });
        };

        const propsWithoutHocProps = omit(props, [...DEFAULT_HOC_PROPS, ...hocProps]);

        // TODO - HOC should be props proxy, not bloquer
        return (
            filterableColumnDefs.length ? (
                <WrappedComponent
                    {...propsWithoutHocProps}
                    columnDefs={filterableColumnDefs}
                    floatingFilter={true}
                    onGridEvent={onGridEvent}
                    frameworkComponents={{
                        customDateFloatingFilter: CustomDateFloatingFilter,
                        customDateFilter: CustomDateFilter,
                        customComplexFloatingFilter: CustomComplexFloatingFilter,
                        customComplexFilter: CustomComplexFilter,
                        customReadOnlyFilter: CustomReadOnlyFilter,
                        customReadOnlyFloatingFilter:CustomReadOnlyFloatingFilter,
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

    const mapDispatchToProps = dispatch => ({
        fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    });

    return connect(createMapStateToProps, mapDispatchToProps)(ComposedComponent); // eslint-disable-line
};

export default withFilterableColumns;
