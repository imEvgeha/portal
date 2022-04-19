/* eslint-disable react/destructuring-assignment */
import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {SetFilter} from 'ag-grid-enterprise';
import {cloneDeep, get, isEmpty, omit, pickBy} from 'lodash';
import {connect} from 'react-redux';
import CustomComplexFilter from '../elements/custom-complex-filter/CustomComplexFilter';
import CustomComplexFloatingFilter from '../elements/custom-complex-floating-filter/CustomComplexFloatingFilter';
import CustomDateFilter from '../elements/custom-date-filter/CustomDateFilter';
import CustomDateFloatingFilter from '../elements/custom-date-floating-filter/CustomDateFloatingFilter';
import CustomIconFilter from '../elements/custom-icon-filter/CustomIconFilter';
import CustomReadOnlyFilter from '../elements/custom-readonly-filter/CustomReadOnlyFilter';
import CustomReadOnlyFloatingFilter from '../elements/custom-readonly-filter/CustomReadOnlyFloatingFilter';
import DuplicateTitleSelectionRenderer from '../elements/duplicate-title-selection-renderer/DuplicateTitleSelectionRenderer';
import MasterTitleSelectionRenderer from '../elements/master-title-selection-renderer/MasterTitleSelectionRenderer';
import {PriceTypeFormSchema, AudioLanguageTypeFormSchema} from '../elements/utils';
import {fetchAvailMapping} from '../nexusGridActions';
import {createAvailSelectValuesSelector} from '../nexusGridSelectors';
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
import './hoc.scss';

const withFilterableColumns =
    ({
        hocProps = [],
        filterableColumns = null,
        initialFilter = null,
        notFilterableColumns = [],
        useDatesWithTime = false,
        prepareFilterParams = params => params,
        filtersMapping = undefined,
        frameworkComponents = {},
    } = {}) =>
    WrappedComponent => {
        const ComposedComponent = props => {
            const {
                columnDefs,
                mapping,
                selectValues,
                fetchAvailMapping,
                fixedFilter,
                customDateFilterParamSuffixes = [],
            } = props;

            const isMounted = useRef(true);
            const [filterableColumnDefs, setFilterableColumnDefs] = useState([]);
            const [gridApi, setGridApi] = useState();
            const columns = props.filterableColumns || filterableColumns;
            const filters = pickBy(
                props.initialFilter || initialFilter || {},
                val => !EXCLUDED_INITIAL_FILTER_VALUES.includes(val)
            );
            // eslint-disable-next-line react/destructuring-assignment
            const excludedFilterColumns = props.notFilterableColumns || notFilterableColumns;
            const [isDatasourceEnabled, setIsDatasourceEnabled] = useState(!filters);

            useEffect(() => {
                return () => {
                    isMounted.current = false;
                };
            }, []);

            useEffect(() => {
                if (
                    isMounted.current &&
                    isObject(selectValues) &&
                    !!Object.keys(selectValues).length &&
                    !!columnDefs.length
                ) {
                    setFilterableColumnDefs(updateColumnDefs(columnDefs));
                }
            }, [columnDefs, selectValues]);

            useEffect(() => {
                if (
                    isMounted.current &&
                    !!columnDefs.length &&
                    isObject(selectValues) &&
                    !!Object.keys(selectValues).length
                ) {
                    setFilterableColumnDefs(updateColumnDefs(columnDefs));
                    setTimeout(() => {
                        initializeValues();
                    }, 0);
                }
            }, [fixedFilter]);

            let waitForFilter = 0;
            function initializeFilter(filterInstance, key, isCallback = false) {
                // initialize one column filter with value
                if (!isMounted.current && !filterInstance) {
                    return;
                }
                const currentValue = get(filters, key, undefined);
                let filterValue = null;

                if (fixedFilter && fixedFilter[key]) {
                    filterValue = fixedFilter[key];
                } else {
                    filterValue = currentValue;
                }

                if (filterValue && !isObject(filterValue)) {
                    if (filterInstance instanceof SetFilter) {
                        const filterValues = Array.isArray(filterValue) ? filterValue : filterValue.split(',');
                        applySetFilter(
                            filterInstance,
                            filterValues.map(el => typeof el === 'string' && el.trim())
                        );
                    } else {
                        filterValue = Array.isArray(filterValue) ? filterValue.join(', ') : filterValue;
                        filterInstance.setModel({
                            type: 'equals',
                            filter: filterValue,
                        });
                    }
                } else if (filterInstance instanceof SetFilter) {
                    filterInstance.setModel({values: filterInstance.getValues()});
                    filterInstance.applyModel();
                } else {
                    filterInstance.setModel(null);
                }
                if (isCallback) {
                    waitForFilter--;
                    if (isMounted.current && !waitForFilter) {
                        gridApi?.onFilterChanged?.();
                        setIsDatasourceEnabled(true);
                    }
                }
            }

            useEffect(() => {
                initializeValues();
            }, [gridApi, mapping]);

            // apply initial filter
            const initializeValues = () => {
                // initialize all columns filters with values
                waitForFilter = 0;
                if (isMounted.current && gridApi && Array.isArray(mapping) && mapping.length) {
                    setIsDatasourceEnabled(false);
                    // union of keys for column filter and fixed filter
                    const keys = [
                        ...new Set([
                            ...(filters ? Object.keys(filters) : []),
                            ...(fixedFilter ? Object.keys(fixedFilter) : []),
                        ]),
                    ];
                    keys.forEach(key => {
                        const field = key.replace(/Match/, '');
                        const filterInstance = gridApi?.getFilterInstance?.(field);
                        if (filterInstance) {
                            // if filter is found or is not found but is not readonly
                            initializeFilter(filterInstance, key);
                        } else {
                            // we need to use callback
                            waitForFilter++;
                            gridApi?.getFilterInstance?.(field, filterInstance =>
                                initializeFilter(filterInstance, key, true)
                            );
                        }
                    });

                    if (isMounted.current && !waitForFilter) {
                        gridApi?.onFilterChanged?.();
                        setIsDatasourceEnabled(true);
                    }
                }
            };

            function updateColumnDefs(columnDefs) {
                const copiedColumnDefs = cloneDeep(columnDefs);
                const filterableColumnDefs = copiedColumnDefs.map((columnDef, index) => {
                    const {colId} = copiedColumnDefs[index];

                    const {
                        searchDataType,
                        queryParamName = columnDef.field,
                        queryParamValue = '',
                        queryParamKey,
                        icon,
                    } = (Array.isArray(mapping) &&
                        mapping.find(
                            ({javaVariableName, dataType}) =>
                                javaVariableName === columnDef.field && (colId === 'icon' || dataType !== 'icon')
                        )) ||
                    {};
                    const {field} = columnDef;
                    const isFilterable =
                        FILTERABLE_DATA_TYPES.includes(searchDataType) &&
                        (columns ? columns.includes(columnDef.field) : true) &&
                        !excludedFilterColumns.includes(columnDef.field) &&
                        get(columnDef, 'isFilterable', true);

                    if (isFilterable) {
                        let locked = false;
                        if (fixedFilter && fixedFilter[queryParamName]) {
                            locked = true;
                        }
                        const filterInstance = isMounted.current && gridApi && gridApi.getFilterInstance(field);
                        const {
                            TEXT,
                            NUMBER,
                            SET,
                            CUSTOM_DATE,
                            CUSTOM_COMPLEX,
                            CUSTOM_READONLY,
                            CUSTOM_ICON,
                            CUSTOM_FLOAT_READONLY,
                        } = AG_GRID_COLUMN_FILTER;
                        const {
                            BOOLEAN,
                            INTEGER,
                            ICON,
                            DOUBLE,
                            YEAR,
                            MULTISELECT,
                            PRICE,
                            TERRITORY,
                            AUDIO_LANGUAGE,
                            TIMESTAMP,
                            BUSINESS_DATETIME,
                            REGIONAL_MIDNIGHT,
                            READONLY,
                        } = FILTER_TYPE;
                        if (!locked) {
                            if (
                                filterInstance &&
                                searchDataType !== READONLY &&
                                filterInstance.reactComponent === CustomReadOnlyFilter
                            ) {
                                // if current filter is readonly (it just got unlocked) destroy to create the proper one
                                gridApi.destroyFilter(field);
                            }
                            columnDef.floatingFilter = true;

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
                                    columnDef.filter = SET;
                                    columnDef.filterParams = {
                                        ...DEFAULT_FILTER_PARAMS,
                                        values: [false, true],
                                    };
                                    break;
                                case DOUBLE:
                                case YEAR:
                                    columnDef.filter = NUMBER;
                                    columnDef.filterParams = {
                                        ...DEFAULT_FILTER_PARAMS,
                                    };
                                    break;
                                case MULTISELECT:
                                    columnDef.filter = SET;
                                    columnDef.filterParams = {
                                        ...DEFAULT_FILTER_PARAMS,
                                        values:
                                            Array.isArray(columnDef.options) && !isEmpty(columnDef.options)
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
                                    columnDef.keyCreator = params => {
                                        return params.value.map(({country}) => country);
                                    };
                                    break;
                                case PRICE: {
                                    columnDef.floatingFilterComponent = 'customComplexFloatingFilter';
                                    const priceTypes = getFilterOptions(`${field}.priceType`);
                                    const currencies = getFilterOptions(`${field}.priceCurrency`);
                                    const priceSchema = PriceTypeFormSchema({priceTypes, currencies});
                                    columnDef.filter = CUSTOM_COMPLEX;
                                    columnDef.filterParams = {
                                        ...DEFAULT_FILTER_PARAMS,
                                        searchQuery: filters.priceType,
                                        schema: priceSchema,
                                    };
                                    break;
                                }
                                case AUDIO_LANGUAGE: {
                                    columnDef.floatingFilterComponent = 'customComplexFloatingFilter';
                                    // TODO generate schema and values for select
                                    //  based on initial schema and found subfields
                                    const languages = getFilterOptions('language');
                                    const audioTypes = getFilterOptions(`${field}.audioType`);
                                    const schema = AudioLanguageTypeFormSchema({languages, audioTypes});
                                    columnDef.filter = CUSTOM_COMPLEX;
                                    columnDef.filterParams = {
                                        // TODO; check is this necessary
                                        ...DEFAULT_FILTER_PARAMS,
                                        searchQuery: filters.audioTypeLanguage || {},
                                        schema,
                                    };
                                    break;
                                }
                                case REGIONAL_MIDNIGHT:
                                case TIMESTAMP:
                                case BUSINESS_DATETIME: {
                                    const from =
                                        !filters[`${field}From`] && filters[field] && filters[field][`${field}From`]
                                            ? filters[field][`${field}From`]
                                            : filters[`${field}From`];
                                    const to =
                                        !filters[`${field}To`] && filters[field] && filters[field][`${field}To`]
                                            ? filters[field][`${field}To`]
                                            : filters[`${field}To`];
                                    const initialFilters = {
                                        ...(from && {from}),
                                        ...(to && {to}),
                                    };
                                    columnDef.floatingFilterComponent = 'customDateFloatingFilter';
                                    columnDef.filter = CUSTOM_DATE;
                                    columnDef.filterParams = {
                                        // TODO; check is this necessary
                                        ...DEFAULT_FILTER_PARAMS,
                                        filterOptions: ['inRange'],
                                        //
                                        initialFilters,
                                        isUsingTime:
                                            useDatesWithTime && [TIMESTAMP, BUSINESS_DATETIME].includes(searchDataType),
                                        customDateFilterParamSuffixes,
                                    };
                                    break;
                                }
                                default:
                                    columnDef.filter = TEXT;
                                    columnDef.filterParams = DEFAULT_FILTER_PARAMS;
                            }
                        } else {
                            if (filterInstance && filterInstance.reactComponent !== CustomReadOnlyFilter) {
                                // if we just locked the filter we need to destroy the previous one
                                // and replace it with read only filter
                                gridApi.destroyFilter(field);
                            }
                            const currentVal = Array.isArray(fixedFilter[queryParamName])
                                ? fixedFilter[queryParamName].join(', ')
                                : fixedFilter[queryParamName];
                            columnDef.floatingFilterComponent = CUSTOM_FLOAT_READONLY;
                            columnDef.filter = CUSTOM_READONLY;
                            columnDef.floatingFilterComponentParams = {
                                suppressFilterButton: true,
                                readOnlyValue: currentVal,
                            };
                            columnDef.filterParams = {
                                ...DEFAULT_FILTER_PARAMS,
                                readOnlyValue: currentVal,
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
                    GRID_EVENTS.ROW_DATA_CHANGED,
                ];

                if (type === GRID_EVENTS.READY) {
                    setGridApi(api);
                }

                if (
                    events.includes(type) &&
                    typeof onGridEvent === 'function' &&
                    (type === GRID_EVENTS.SELECTION_CHANGED || type === GRID_EVENTS.READY)
                ) {
                    props.onGridEvent(data);
                }
            };

            // TODO: create separate file for filter API methods
            const applySetFilter = (field, values = []) => {
                // clear filter
                field.setModel(null);
                // select values
                values.forEach(value => field.selectValue(value));
                // APPLY THE MODEL
                field.applyModel();
            };

            const getFilterOptions = field => {
                const defaultOptions = mapping?.find(
                    x => x.javaVariableName === field && x.dataType !== 'icon'
                )?.options;

                if (defaultOptions) {
                    return defaultOptions; // .map(opt => ({id: opt, type: field, value: opt}));
                }

                const alternateSelector =
                    mapping.find(m => m.javaVariableName === field && m.dataType !== 'icon')?.alternateSelector ||
                    field;

                const endpoint = mapping.find(
                    m => m.javaVariableName === field && m.dataType !== 'icon'
                )?.configEndpoint;
                // TODO: refresh and show values when loaded
                const tmpOptions = get(selectValues, alternateSelector, []);
                const options = !!filtersMapping && tmpOptions ? filtersMapping(tmpOptions, endpoint) : tmpOptions;

                return options.map(option => {
                    if (isObject(option)) {
                        // TODO: This is just a temporary solution for territory fields
                        return option.value || option.countryCode;
                    }
                    return option;
                });
            };

            const propsWithoutHocProps = omit(props, [...DEFAULT_HOC_PROPS, ...hocProps]);

            // TODO - HOC should be props proxy, not bloquer
            return filterableColumnDefs.length && Object.keys(selectValues).length > 0 ? (
                <WrappedComponent
                    {...propsWithoutHocProps}
                    columnDefs={filterableColumnDefs}
                    onGridEvent={onGridEvent}
                    frameworkComponents={{
                        ...frameworkComponents,
                        customDateFloatingFilter: CustomDateFloatingFilter,
                        customDateFilter: CustomDateFilter,
                        customIconFilter: CustomIconFilter,
                        customComplexFloatingFilter: CustomComplexFloatingFilter,
                        customComplexFilter: CustomComplexFilter,
                        customReadOnlyFilter: CustomReadOnlyFilter,
                        customReadOnlyFloatingFilter: CustomReadOnlyFloatingFilter,
                        masterTitleSelectionRenderer: MasterTitleSelectionRenderer,
                        duplicateTitleSelectionRenderer: DuplicateTitleSelectionRenderer,
                    }}
                    isDatasourceEnabled={isDatasourceEnabled}
                    prepareFilterParams={prepareFilterParams}
                />
            ) : (
                <div className="nexus-grid-filters-fallback">
                    <SectionMessage className="nexus-grid-fallback-section" title="Preparing table filters...">
                        <span>
                            <Spinner size="small" /> Please wait.
                        </span>
                    </SectionMessage>
                </div>
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

        ComposedComponent.propTypes = {
            selectValues: PropTypes.object,
            params: PropTypes.object,
            customDateFilterParamSuffixes: PropTypes.array,
            fixedFilter: PropTypes.object,
            filterableColumns: PropTypes.array,
            notFilterableColumns: PropTypes.array,
            initialFilter: PropTypes.object,
            columnDefs: PropTypes.array.isRequired,
            mapping: PropTypes.array.isRequired,
            fetchAvailMapping: PropTypes.func.isRequired,
            onGridEvent: PropTypes.func,
        };

        ComposedComponent.defaultProps = {
            selectValues: {},
            params: {},
            customDateFilterParamSuffixes: [],
            fixedFilter: {},
            filterableColumns: null,
            notFilterableColumns: [],
            initialFilter: {},
            onGridEvent: () => null,
        };

        return connect(
            createMapStateToProps,
            mapDispatchToProps
            // eslint-disable-next-line
        )(ComposedComponent);
    };

export default withFilterableColumns;
