import {DATETIME_FIELDS} from '../../../util/date-time/constants';

const GRID_EVENTS = {
    READY: 'gridReady',
    SIZE_CHANGED: 'gridSizeChanged',
    SELECTION_CHANGED: 'selectionChanged',
    CELL_VALUE_CHANGED: 'cellValueChanged',
    FIRST_DATA_RENDERED: 'firstDataRendered',
    FILTER_CHANGED: 'filterChanged',
    ROW_DATA_CHANGED: 'rowDataChanged',
};
const ROW_BUFFER = 10;
const PAGINATION_PAGE_SIZE = 100;
const CACHE_OVERFLOW_SIZE = 2;
const MAX_CONCURRENT_DATASOURCE_REQUEST = 1;
const MAX_BLOCKS_IN_CACHE = 100;
const ROW_MODEL_TYPE = 'infinite';
const DEFAULT_HOC_PROPS = [
    'initialFilter',
    'fixedFilter',
    'filterableColumns',
    'notFilterableColumns',
    'mapping',
    'selectValues',
];

const NOT_FILTERABLE_COLUMNS = ['id'];
const DEFAULT_FILTER_PARAMS = {
    filterOptions: ['equals'],
    suppressAndOrCondition: true,
    debounceMs: 1000,
};
const FILTER_TYPE = {
    BOOLEAN: 'boolean',
    STRING: 'string',
    DURATION: 'duration',
    INTEGER: 'integer',
    DOUBLE: 'double',
    YEAR: 'year',
    MULTISELECT: 'multiselect',
    PRICE: 'priceType',
    TERRITORY: 'territoryType',
    AUDIO_LANGUAGE: 'audioLanguageType',
    READONLY: 'readonly',
    TIMESTAMP: DATETIME_FIELDS.TIMESTAMP,
    BUSINESS_DATETIME: DATETIME_FIELDS.BUSINESS_DATETIME,
    REGIONAL_MIDNIGHT: DATETIME_FIELDS.REGIONAL_MIDNIGHT,
};
const FILTERABLE_DATA_TYPES = [
    'string',
    'integer',
    'double',
    'boolean',
    'multiselect',
    'priceType',
    'territoryType',
    'audioLanguageType',
    'year',
    'duration',
    'readonly',
    DATETIME_FIELDS.TIMESTAMP,
    DATETIME_FIELDS.BUSINESS_DATETIME,
    DATETIME_FIELDS.REGIONAL_MIDNIGHT,
];

const MULTISELECT_SEARCHABLE_DATA_TYPES = ['multiselect', 'territoryType'];

const AG_GRID_COLUMN_FILTER = {
    TEXT: 'agTextColumnFilter',
    NUMBER: 'agNumberColumnFilter',
    SET: 'agSetColumnFilter',
    CUSTOM_DATE: 'customDateFilter',
    CUSTOM_COMPLEX: 'customComplexFilter',
    CUSTOM_READONLY: 'customReadOnlyFilter',
    CUSTOM_FLOAT_READONLY: 'customReadOnlyFloatingFilter',
};

const DATEPICKER_LABELS = ['From', 'To'];

const EXCLUDED_INITIAL_FILTER_VALUES = [null, '', undefined];

const DEFAULT_SORT_ORDER = ['asc', 'desc', null];

export {
    GRID_EVENTS,
    DEFAULT_FILTER_PARAMS,
    CACHE_OVERFLOW_SIZE,
    DATEPICKER_LABELS,
    DEFAULT_HOC_PROPS,
    FILTER_TYPE,
    FILTERABLE_DATA_TYPES,
    MULTISELECT_SEARCHABLE_DATA_TYPES,
    MAX_BLOCKS_IN_CACHE,
    MAX_CONCURRENT_DATASOURCE_REQUEST,
    NOT_FILTERABLE_COLUMNS,
    PAGINATION_PAGE_SIZE,
    ROW_BUFFER,
    ROW_MODEL_TYPE,
    EXCLUDED_INITIAL_FILTER_VALUES,
    AG_GRID_COLUMN_FILTER,
    DEFAULT_SORT_ORDER,
};
