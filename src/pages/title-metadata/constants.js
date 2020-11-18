export const TITLE_METADATA = 'Title Metadata';
export const CREATE_NEW_TITLE = 'Create New Title';
export const SYNC_LOG = 'Sync Log';
export const NEXUS = 'NEXUS';
export const MOVIDA = 'MOVIDA';
export const VZ = 'VZ';
export const CONTENT_TYPE = ['MOVIE', 'EPISODE', 'EVENT', 'SERIES', 'SEASON', 'SPORTS', 'AD', 'SPECIAL'];

export const COLUMN_MAPPINGS = [
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        javaVariableName: 'title',
        enableSearch: true,
        searchDataType: 'string',
        cellRenderer: 'loadingCellRenderer',
        width: 200,
    },
    {
        colId: 'repository',
        field: 'repository',
        headerName: 'Repository',
        javaVariableName: 'repository',
        enableSearch: false,
        readOnly: true,
        width: 120,
    },
    {
        colId: 'contentType',
        field: 'contentType',
        headerName: 'Content Type',
        javaVariableName: 'contentType',
        enableSearch: true,
        searchDataType: 'multiselect',
        options: CONTENT_TYPE,
        width: 120,
    },
    {
        colId: 'releaseYear',
        field: 'releaseYear',
        headerName: 'Release Year',
        javaVariableName: 'releaseYear',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
];
