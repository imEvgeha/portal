export const TITLE_METADATA = 'Title Metadata';
export const CREATE_NEW_TITLE = 'Create New Title';
export const SYNC_LOG = 'Sync Log';
export const NEXUS = 'NEXUS';
export const MOVIDA = 'MOVIDA';
export const VZ = 'VZ';
export const VU = 'vu';
export const MGM = 'mgm';
export const SUCCESS = 'success';
export const ERROR = 'error';
export const SYNC = 'sync';
export const PUBLISH = 'publish';
export const CONTENT_TYPE = ['MOVIE', 'EPISODE', 'EVENT', 'SERIES', 'SEASON', 'SPORTS', 'AD', 'SPECIAL'];
export const LEGACY_TOOLTIP_TEXT = 'This is Legacy title. Click to Reconcile';

export const CATALOGUE_OWNER_OPTIONS = [
    {label: 'Vubiquity', value: 'vu'},
    {label: 'MGM', value: 'mgm'},
];
export const CATALOGUE_OWNER_DROPDOWN_PLACEHOLDER = 'Select Catalogue Owner';
export const DEFAULT_CATALOGUE_OWNER = 'vu';
export const REPOSITORY_COLUMN_ID = 'repository';

export const UPDATE_TITLE_SUCCESS = 'Title updated successfully';
export const UPDATE_TITLE_ERROR = 'Error while updating Title';

export const UPDATE_TERRITORY_METADATA_SUCCESS = 'Territorial Metadata updated successfully';
export const UPDATE_TERRITORY_METADATA_ERROR = 'Error while updating Territorial Metadata';

export const UPDATE_EDITORIAL_METADATA_SUCCESS = 'Editorial Metadata updated successfully';
export const UPDATE_EDITORIAL_METADATA_ERROR = 'Error while updating Editorial Metadata';

export const COLUMN_MAPPINGS = [
    {
        colId: 'id',
        field: 'id',
        headerName: 'ID',
        javaVariableName: 'id',
        enableSearch: false,
        dataType: 'string',
        hide: true,
        width: 150,
    },
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        javaVariableName: 'title',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        cellRenderer: 'loadingCellRenderer',
        width: 200,
    },
    {
        colId: 'repository',
        field: 'repository',
        headerName: 'Repository',
        dataType: 'string',
        javaVariableName: 'repository',
        enableSearch: false,
        readOnly: true,
        minWidth: 120,
        maxWidth: 120,
    },
    {
        colId: 'contentType',
        field: 'contentType',
        headerName: 'Content Type',
        javaVariableName: 'contentType',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'releaseYear',
        field: 'releaseYear',
        headerName: 'Release Year',
        javaVariableName: 'releaseYear',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'contentSubType',
        field: 'contentSubType',
        headerName: 'Content SubType',
        javaVariableName: 'contentSubType',
        dataType: 'string',
        enableSearch: false,
        width: 120,
        hide: true,
    },
    {
        colId: 'duration',
        field: 'duration',
        headerName: 'Duration',
        javaVariableName: 'duration',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 120,
        hide: true,
    },
    {
        colId: 'countryOfOrigin',
        field: 'countryOfOrigin',
        headerName: 'Country of Origin',
        javaVariableName: 'countryOfOrigin',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 120,
        hide: true,
    },
    {
        colId: 'animated',
        field: 'animated',
        headerName: 'Animated',
        javaVariableName: 'animated',
        dataType: 'boolean',
        enableSearch: false,
        readOnly: true,
        width: 120,
        hide: true,
    },
    {
        colId: 'eventType',
        field: 'eventType',
        headerName: 'Event Type',
        javaVariableName: 'eventType',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 120,
        hide: true,
    },
    {
        colId: 'originalLanguage',
        field: 'originalLanguage',
        headerName: 'Original Language',
        javaVariableName: 'originalLanguage',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 120,
        hide: true,
    },
    {
        colId: 'usBoxOffice',
        field: 'usBoxOffice',
        headerName: 'US Box Office',
        javaVariableName: 'usBoxOffice',
        dataType: 'integer',
        enableSearch: false,
        readOnly: true,
        width: 120,
        hide: true,
    },
    {
        colId: 'category',
        field: 'category',
        headerName: 'Category',
        javaVariableName: 'category',
        dataType: 'select',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'assetName',
        field: 'assetName',
        headerName: 'Asset Name',
        javaVariableName: 'assetName',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'eidrTitleId',
        field: 'eidrTitleId',
        headerName: 'EIDR Title ID',
        javaVariableName: 'eidrTitleId',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'tmsId',
        field: 'tmsId',
        headerName: 'TMS ID',
        javaVariableName: 'tmsId',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'eidrEditId',
        field: 'eidrEditId',
        headerName: 'EIDR Edit ID',
        javaVariableName: 'eidrEditId',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'xfinityMovieId',
        field: 'xfinityMovieId',
        headerName: 'Xfinity Movie ID',
        javaVariableName: 'xfinityMovieId',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'maId',
        field: 'maId',
        headerName: 'MA ID',
        javaVariableName: 'maId',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'isan',
        field: 'isan',
        headerName: 'ISAN',
        javaVariableName: 'isan',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'alid',
        field: 'alid',
        headerName: 'ALID',
        javaVariableName: 'alid',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'cid',
        field: 'cid',
        headerName: 'C ID',
        javaVariableName: 'cid',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
    {
        colId: 'isrc',
        field: 'isrc',
        headerName: 'ISRC',
        javaVariableName: 'isrc',
        dataType: 'string',
        enableSearch: false,
        readOnly: true,
        width: 150,
        hide: true,
    },
];

export const FIELDS_TO_REMOVE = ['editorial', 'territorial', 'movidaExternalIds', 'vzExternalIds'];
