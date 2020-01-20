export const GRID_EVENTS = {
    READY: 'gridReady',
    SIZE_CHANGED: 'gridSizeChanged',
    SELECTION_CHANGED: 'selectionChanged',
    CELL_VALUE_CHANGED: 'cellValueChanged',
    FIRST_DATA_RENDERED: 'firstDataRendered',
    FILTER_CHANGED: 'filterChanged',
};

export default {
    GRID_EVENTS,
    ROW_BUFFER: 10,
    PAGINATION_PAGE_SIZE: 100,
    CACHE_OVERFLOW_SIZE: 2,
    MAX_CONCURRENT_DATASOURCE_REQUEST: 1,
    MAX_BLOCKS_IN_CACHE: 100,
    ROW_MODEL_TYPE: 'infinite',
    DEFAULT_HOC_PROPS: [
        'initialFilter',
        'filterableColumns',
        'notFilterableColumns',
        'mapping',
        'selectValues'
    ],
    FILTERABLE_DATA_TYPES: [
        'string',
        'integer',
        'double',
        'boolean',
        'select',
        'multiselect',
        'territoryType',
        'year',
        'duration',
        'datetime'
    ],
    NOT_FILTERABLE_COLUMNS: ['id'],
    DEFAULT_FILTER_PARAMS: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
        debounceMs: 1000,
    },
    FILTER_TYPE: {
        string: 'agTextColumnFilter',
        duration: 'agTextColumnFilter',
        integer: 'agNumberColumnFilter',
        double: 'agNumberColumnFilter',
        year: 'agNumberColumnFilter',
        select: 'agSetColumnFilter',
        multiselect: 'agSetColumnFilter',
        territoryType: 'agSetColumnFilter',
        datetime: 'agDateColumnFilter',
    },
    END_DATE_VALUE: 86399999    // + 23 hours 59 minutes 59 seconds
};

