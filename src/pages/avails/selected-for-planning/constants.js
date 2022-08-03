export const DOP_PROJECT_STATUS_COMPLETED = 'COMPLETED';
export const DOP_PROJECT_STATUS_IN_PROGRESS = 'CIN PROGRESS';
export const DOP_PROJECT_STATUS_IN_PROGRESS_DISPLAY = 'IN PROGRESS';
export const DOP_PROJECT_STATUS_CANCELLED = 'CANCELLED';
export const EXCLUDED_STATUSES = [DOP_PROJECT_STATUS_CANCELLED, DOP_PROJECT_STATUS_COMPLETED];
export const SELECTED_FOR_PLANNING_TAB = 'Selected for Planning';
export const PAGE_SIZE = 100;
export const PROJECT_ID = '5bbe8921-ab75-469b-b410-30955a0589d3';

export const getInitialSearchPayload = (user, offset, limit) => ({
    filterCriterion: [
        {
            fieldName: 'MANAGER',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: user,
        },
        {
            fieldName: 'STATUS',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: DOP_PROJECT_STATUS_IN_PROGRESS,
        },
        {
            fieldName: 'TYPE',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: 'Rights_Planning',
        },
    ],
    sortCriterion: [
        {
            fieldName: 'ID',
            ascending: true,
        },
    ],
    field: ['!projectAttribute'],
    embed: ['plan'],
    offset,
    limit,
});
export const COLUMN_MAPPINGS = [
    {
        colId: 'rightID',
        field: 'rightID',
        headerName: 'Right ID',
        javaVariableName: 'rightID',
        enableSearch: true,
        searchDataType: 'string',
        width: 150,
        cellRenderer: 'loadingCellRenderer',
        cellRendererParams: {
            link: 'avails/rights/',
            newTab: true,
        },
    },
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        javaVariableName: 'title',
        enableSearch: true,
        searchDataType: 'string',
        width: 180,
    },
    {
        colId: 'territory',
        field: 'territory',
        headerName: 'Planned Territory',
        javaVariableName: 'territory',
        enableSearch: true,
        searchDataType: 'string',
        width: 150,
    },
    {
        colId: 'keywords',
        field: 'keywords',
        headerName: 'Keywords',
        javaVariableName: 'keywords',
        enableSearch: true,
        searchDataType: 'string',
        width: 150,
    },
    {
        colId: 'projectId',
        field: 'projectId',
        headerName: 'DOP Status',
        javaVariableName: 'projectId',
        enableSearch: false,
        readOnly: true,
        width: 180,
        cellRenderer: 'loadingCellRenderer',
        valueFormatter: () => DOP_PROJECT_STATUS_IN_PROGRESS_DISPLAY,
    },
    {
        colId: 'format',
        field: 'format',
        headerName: 'Format',
        javaVariableName: 'format',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'licensor',
        field: 'licensor',
        headerName: 'Licensor',
        javaVariableName: 'licensor',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'licensee',
        field: 'licensee',
        headerName: 'Licensee',
        javaVariableName: 'licensee',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'licenseType',
        field: 'licenseType',
        headerName: 'License type',
        javaVariableName: 'licenseType',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
];
export const TABLE_FIELDS = 'rightID,title,territory,keywords,format,licensor,licensee,licenseType';
