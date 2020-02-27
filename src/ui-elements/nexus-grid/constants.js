const GRID_EVENTS = {
    READY: 'gridReady',
    SIZE_CHANGED: 'gridSizeChanged',
    SELECTION_CHANGED: 'selectionChanged',
    CELL_VALUE_CHANGED: 'cellValueChanged',
    FIRST_DATA_RENDERED: 'firstDataRendered',
    FILTER_CHANGED: 'filterChanged',
};
const ROW_BUFFER = 10;
const PAGINATION_PAGE_SIZE = 100;
const CACHE_OVERFLOW_SIZE = 2;
const MAX_CONCURRENT_DATASOURCE_REQUEST = 1;
const MAX_BLOCKS_IN_CACHE = 100;
const ROW_MODEL_TYPE = 'infinite';
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
    string: 'agTextColumnFilter',
    duration: 'agTextColumnFilter',
    integer: 'agNumberColumnFilter',
    double: 'agNumberColumnFilter',
    year: 'agNumberColumnFilter',
    select: 'agSetColumnFilter',
    multiselect: 'agSetColumnFilter',
    territoryType: 'agSetColumnFilter',
};
const DATEPICKER_LABELS = ['From', 'To'];

const EXCLUDED_INITIAL_FILTER_VALUES = [null, '', undefined];

export {
    GRID_EVENTS,
    DEFAULT_FILTER_PARAMS,
    CACHE_OVERFLOW_SIZE,
    DATEPICKER_LABELS,
    DEFAULT_HOC_PROPS,
    FILTER_TYPE,
    FILTERABLE_DATA_TYPES,
    MAX_BLOCKS_IN_CACHE,
    MAX_CONCURRENT_DATASOURCE_REQUEST,
    NOT_FILTERABLE_COLUMNS,
    PAGINATION_PAGE_SIZE,
    ROW_BUFFER,
    ROW_MODEL_TYPE,
    EXCLUDED_INITIAL_FILTER_VALUES,
};


