import React, {useEffect, useState} from 'react';
import {SetFilter} from 'ag-grid-enterprise';
import {cloneDeep, get, isEmpty, omit, pickBy} from 'lodash';
import {connect} from 'react-redux';
import AudioLanguageTypeFormSchema from '../../../../pages/legacy/components/form/AudioLanguageTypeSearchFormSchema';
import PriceTypeFormSchema from '../../../../pages/legacy/components/form/PriceTypeSearchFormSchema';
import {fetchAvailMapping} from '../../../../pages/legacy/containers/avail/availActions';
import {createAvailSelectValuesSelector} from '../../../../pages/legacy/containers/avail/availSelectors';
import {isObject} from '../../../../util/Common';
import usePrevious from '../../../../util/hooks/usePrevious';
import CustomComplexFilter from '../elements/custom-complex-filter/CustomComplexFilter';
import CustomComplexFloatingFilter from '../elements/custom-complex-floating-filter/CustomComplexFloatingFilter';
import CustomDateFilter from '../elements/custom-date-filter/CustomDateFilter';
import CustomDateFloatingFilter from '../elements/custom-date-floating-filter/CustomDateFloatingFilter';
import CustomReadOnlyFilter from '../elements/custom-readonly-filter/CustomReadOnlyFilter';
import CustomReadOnlyFloatingFilter from '../elements/custom-readonly-filter/CustomReadOnlyFloatingFilter';
import {
    AG_GRID_COLUMN_FILTER,
    DEFAULT_FILTER_PARAMS,
    DEFAULT_HOC_PROPS,
    EXCLUDED_INITIAL_FILTER_VALUES,
    FILTERABLE_DATA_TYPES,
    FILTER_TYPE,
    GRID_EVENTS,
    NOT_FILTERABLE_COLUMNS
} from '../constants';

const withFilterableColumns = ({
    hocProps = [],
    filterableColumns = null,
    initialFilter = null,
    notFilterableColumns = NOT_FILTERABLE_COLUMNS,
    useDatesWithTime = false,
    prepareFilterParams = params => params
} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {
            columnDefs,
            mapping,
            selectValues,
            params,
            fetchAvailMapping,
            fixedFilter,
            customDateFilterParamSuffixes = []
        } = props;
        const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
        const [gridApi, setGridApi] = useState();
        const columns = props.filterableColumns || filterableColumns;
        const filters = pickBy(
            props.initialFilter || initialFilter || {},
            val => !EXCLUDED_INITIAL_FILTER_VALUES.includes(val)
        );
        const excludedFilterColumns = props.notFilterableColumns || notFilterableColumns;
        const [isDatasourceEnabled, setIsDatasourceEnabled] = useState(!filters);
        const previousFilters = usePrevious(filters);

        // TODO: temporary solution to get select values
        useEffect(
            () => {
                if (isEmpty(selectValues)) {
                    fetchAvailMapping();
                }
            },
            [selectValues]
        );

        useEffect(
            () => {
                if (!!columnDefs.length && isObject(selectValues) && !!Object.keys(selectValues).length) {
                    setFilterableColumnDefs(updateColumnDefs(columnDefs));
                }
            },
            [columnDefs, selectValues]
        );

        useEffect(
            () => {
                if (!!columnDefs.length && isObject(selectValues) && !!Object.keys(selectValues).length) {
                    setFilterableColumnDefs(updateColumnDefs(columnDefs));
                    setTimeout(() => {
                        initializeValues();
                    }, 0);
                }
            },
            [fixedFilter]
        );

        let waitForFilter = 0;
        function initializeFilter(filterInstance, key, isCallback = false) {
            //initialize one column filter with value
            if (!filterInstance) return;
            const field = key.replace(/Match/, '');
            const currentValue = get(filters, key, undefined);
            let filterValue;
            if (fixedFilter && fixedFilter[key]) {
                filterValue = fixedFilter[key];
            } else {
                filterValue = currentValue;
            }

            if (filterValue) {
                if (filterInstance instanceof SetFilter) {
                    const filterValues = Array.isArray(filterValue) ? filterValue : filterValue.split(',');
                    applySetFilter(filterInstance, filterValues.map(el => typeof el === 'string' && el.trim()));
                } else {
                    filterValue = Array.isArray(filterValue) ? filterValue.join(', ') : filterValue;
                    filterInstance.setModel({
                        type: 'equals',
                        filter: filterValue
                    });
                }
            } else {
                if (filterInstance instanceof SetFilter) {
                    filterInstance.selectEverything();
                    filterInstance.applyModel();
                } else {
                    filterInstance.setModel(null);
                }
            }
            if (isCallback) {
                waitForFilter--;
                if (!waitForFilter) {
                    gridApi.onFilterChanged();
                    setIsDatasourceEnabled(true);
                }
            }
        }

        useEffect(
            () => {
                initializeValues();
            },
            [gridApi, mapping]
        );

        // apply initial filter
        const initializeValues = () => {
            //initialize all columns filters with values
            waitForFilter = 0;
            if (gridApi && Array.isArray(mapping) && mapping.length) {
                setIsDatasourceEnabled(false);
                //union of keys for column filter and fixed filter
                const keys = [
                    ...new Set([
                        ...(filters ? Object.keys(filters) : []),
                        ...(fixedFilter ? Object.keys(fixedFilter) : [])
                    ])
                ];
                keys.forEach(key => {
                    const field = key.replace(/Match/, '');
                    const filterInstance = gridApi.getFilterInstance(field);
                    if (filterInstance) {
                        //if filter is found or is not found but is not readonly
                        initializeFilter(filterInstance, key);
                    } else {
                        //we need to use callback
                        waitForFilter++;
                        gridApi.getFilterInstance(field, filterInstance => initializeFilter(filterInstance, key, true));
                    }
                });

                if (!waitForFilter) {
                    gridApi.onFilterChanged();
                    setIsDatasourceEnabled(true);
                }
            }
        };

        function updateColumnDefs(columnDefs) {
            const copiedColumnDefs = cloneDeep(columnDefs);
            const filterableColumnDefs = copiedColumnDefs.map(columnDef => {
                const {searchDataType, queryParamName = columnDef.field} =
                    (Array.isArray(mapping) &&
                        mapping.find(({javaVariableName}) => javaVariableName === columnDef.field)) ||
                    {};
                const {field} = columnDef;
                const isFilterable =
                    FILTERABLE_DATA_TYPES.includes(searchDataType) &&
                    (columns ? columns.includes(columnDef.field) : true) &&
                    !excludedFilterColumns.includes(columnDef.field);

                if (isFilterable) {
                    let locked = false;
                    if (fixedFilter && fixedFilter[queryParamName]) {
                        locked = true;
                    }
                    const filterInstance = gridApi && gridApi.getFilterInstance(field);
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
                        PRICE,
                        TERRITORY,
                        AUDIO_LANGUAGE,
                        TIMESTAMP,
                        BUSINESS_DATETIME,
                        REGIONAL_MIDNIGHT,
                        READONLY
                    } = FILTER_TYPE;
                    if (!locked) {
                        if (
                            filterInstance &&
                            searchDataType !== READONLY &&
                            filterInstance.reactComponent === CustomReadOnlyFilter
                        ) {
                            //if current filter is readonly (it just got unlocked) destroy to create the proper one
                            gridApi.destroyFilter(field);
                        }

                        switch (searchDataType) {
                            case READONLY:
                                columnDef.floatingFilterComponent = CUSTOM_FLOAT_READONLY;
                                columnDef.filter = CUSTOM_READONLY;
                                columnDef.floatingFilterComponentParams = {
                                    suppressFilterButton: true,
                                    readOnlyValue: filters[field]
                                };
                                columnDef.filterParams = {
                                    ...DEFAULT_FILTER_PARAMS,
                                    readOnlyValue: filters[field]
                                };
                                break;
                            case BOOLEAN:
                                columnDef.filter = SET;
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
                                    values:
                                        Array.isArray(columnDef.options) && !isEmpty(columnDef.options)
                                            ? columnDef.options
                                            : getFilterOptions(field)
                                };
                                break;
                            case TERRITORY:
                                columnDef.filter = SET;
                                columnDef.filterParams = {
                                    ...DEFAULT_FILTER_PARAMS,
                                    values: getFilterOptions(field)
                                };
                                columnDef.keyCreator = params => {
                                    const countries = params.value.map(({country}) => country);
                                    return countries;
                                };
                                break;
                            case PRICE:
                                columnDef.floatingFilterComponent = 'customComplexFloatingFilter';
                                const priceTypes = getFilterOptions(`${field}.priceType`);
                                const currencies = getFilterOptions(`${field}.priceCurrency`);
                                const priceSchema = PriceTypeFormSchema(priceTypes, currencies);
                                columnDef.filter = CUSTOM_COMPLEX;
                                const priceType = filters['priceType'];
                                const priceValue = filters['priceValue'];
                                const priceCurrency = filters['priceCurrency'];
                                const pricingInitialFilters = {
                                    ...(priceType && {priceType}),
                                    ...(priceValue && {priceValue}),
                                    ...(priceCurrency && {priceCurrency})
                                };
                                columnDef.filterParams = {
                                    ...DEFAULT_FILTER_PARAMS,
                                    initialFilters: pricingInitialFilters,
                                    schema: priceSchema
                                };
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
                                    // TODO; check is this neccessary
                                    ...DEFAULT_FILTER_PARAMS,
                                    filterOptions: ['inRange'],
                                    //
                                    initialFilters,
                                    isUsingTime:
                                        useDatesWithTime && [TIMESTAMP, BUSINESS_DATETIME].includes(searchDataType),
                                    customDateFilterParamSuffixes: customDateFilterParamSuffixes
                                };
                                break;
                            default:
                                columnDef.filter = TEXT;
                                columnDef.filterParams = DEFAULT_FILTER_PARAMS;
                        }
                    } else {
                        if (filterInstance && filterInstance.reactComponent !== CustomReadOnlyFilter) {
                            //if we just locked the filter we need to destroy the previous one and replace it with read only filter
                            gridApi.destroyFilter(field);
                        }
                        const currentVal = Array.isArray(fixedFilter[queryParamName])
                            ? fixedFilter[queryParamName].join(', ')
                            : fixedFilter[queryParamName];
                        columnDef.floatingFilterComponent = CUSTOM_FLOAT_READONLY;
                        columnDef.filter = CUSTOM_READONLY;
                        columnDef.floatingFilterComponentParams = {
                            suppressFilterButton: true,
                            readOnlyValue: currentVal
                        };
                        columnDef.filterParams = {
                            ...DEFAULT_FILTER_PARAMS,
                            readOnlyValue: currentVal
                        };
                    }
                }
                return columnDef;
            });

            return filterableColumnDefs;
        }

        const onGridEvent = data => {
            const {api, type} = data || {};
            const {onGridEvent} = props;
            const events = [
                GRID_EVENTS.READY,
                GRID_EVENTS.FIRST_DATA_RENDERED,
                GRID_EVENTS.SELECTION_CHANGED,
                GRID_EVENTS.FILTER_CHANGED,
                GRID_EVENTS.ROW_DATA_CHANGED
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

        const getFilterOptions = field => {
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

        // TODO - HOC should be props proxy, not bloquer
        return filterableColumnDefs.length ? (
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
                    customReadOnlyFloatingFilter: CustomReadOnlyFloatingFilter
                }}
                isDatasourceEnabled={isDatasourceEnabled}
                prepareFilterParams={prepareFilterParams}
            />
        ) : null;
    };

    const createMapStateToProps = () => {
        const availSelectValuesSelector = createAvailSelectValuesSelector();
        return (state, props) => ({
            selectValues: availSelectValuesSelector(state, props)
        });
    };

    const mapDispatchToProps = dispatch => ({
        fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload))
    });

    return connect(
        createMapStateToProps,
        mapDispatchToProps
    )(ComposedComponent); // eslint-disable-line
};

export default withFilterableColumns;
