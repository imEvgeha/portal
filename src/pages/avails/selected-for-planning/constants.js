export const DOP_PROJECT_STATUS_COMPLETED = 'COMPLETED';
export const DOP_PROJECT_STATUS_IN_PROGRESS = 'CIN PROGRESS';
export const DOP_PROJECT_STATUS_CANCELLED = 'CANCELLED';
export const EXCLUDED_STATUSES = [DOP_PROJECT_STATUS_CANCELLED, DOP_PROJECT_STATUS_COMPLETED];
export const SELECTED_FOR_PLANNING_TAB = 'Selected for Planning';
export const PAGE_SIZE = 100;
export const PROJECT_ID = '5bbe8921-ab75-469b-b410-30955a0589d3';
export const getSearchPayload = (user, offset, limit) => ({
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
    offset,
    limit,
});
export const COLUMN_MAPPINGS = [
    {
        colId: 'id',
        field: 'rightID',
        headerName: 'Right ID',
        width: 150,
    },
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        width: 180,
    },
    {
        colId: 'territory',
        field: 'territory',
        headerName: 'Planned Territory',
        width: 150,
    },
    {
        colId: 'keywords',
        field: 'keywords',
        headerName: 'Keywords',
        width: 150,
    },
    {
        colId: 'status',
        field: 'status',
        headerName: 'DOP Status',
        width: 180,
    },
    {
        colId: 'format',
        field: 'format',
        headerName: 'Format',
        width: 120,
    },
    {
        colId: 'licensor',
        field: 'licensor',
        headerName: 'Licensor',
        width: 120,
    },
    {
        colId: 'licensee',
        field: 'licensee',
        headerName: 'Licensee',
        width: 120,
    },
    {
        colId: 'licenseType',
        field: 'licenseType',
        headerName: 'License type',
        width: 120,
    },
];
export const TABLE_FIELDS = 'rightID,title,territory,keywords,format,licensor,licensee,licenseType';
export const DOP_PROJECT_URL = '/AmdocsOSS/Portal/index.html?launchApp=Projects&projectId=';
