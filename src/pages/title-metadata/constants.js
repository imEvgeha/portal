export const TITLE_METADATA = 'Title Metadata';
export const CREATE_NEW_TITLE = 'Create New Title';
export const SYNC_LOG = 'Sync Log';
export const NEXUS = 'NEXUS';
export const MOVIDA = {label: 'Movida', value: 'movida'};
export const MOVIDA_INTL = {label: "Movida Int'l", value: 'movida-uk'};
export const VZ = {label: 'VZ', value: 'vz'};
export const VU = 'vu';
export const MGM = 'MGM';
export const SUCCESS = 'success';
export const ERROR = 'error';
export const EMPTY = 'empty';
export const SYNC = 'sync';
export const PUBLISH = 'publish';
export const CONTENT_TYPE = ['MOVIE', 'EPISODE', 'EVENT', 'SERIES', 'SEASON', 'SPORTS', 'AD', 'SPECIAL'];
export const LEGACY_TOOLTIP_TEXT = 'This is Legacy title. Click to Reconcile';

export const CATALOGUE_OWNER_DROPDOWN_PLACEHOLDER = 'Select Catalogue Owner';
export const DEFAULT_CATALOGUE_OWNER = 'vu';
export const REPOSITORY_COLUMN_ID = 'repository';

export const UPDATE_TITLE_SUCCESS = 'Title updated successfully';
export const UPDATE_TITLE_ERROR = 'Error while updating Title';

export const UPDATE_TERRITORY_METADATA_SUCCESS = 'Territorial Metadata updated successfully';
export const UPDATE_TERRITORY_METADATA_ERROR = 'Error while updating Territorial Metadata';

export const UPDATE_EDITORIAL_METADATA_SUCCESS = 'Editorial Metadata updated successfully';
export const UPDATE_EDITORIAL_METADATA_ERROR = 'Error while updating Editorial Metadata';

export const PROPAGATE_SEASON_PERSONS_SUCCESS = 'Season cast and crew propagated successfully';
export const UNMERGE_TITLE_SUCCESS = 'Title succesfully unmerged!';

export const UPLOAD_SUCCESS_MESSAGE = 'You have successfully uploaded a Title.';

export const UPLOADED_EMETS_COLUMN_MAPPINGS = [
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
        width: 150,
    },
    {
        colId: 'repository',
        field: 'repository',
        headerName: 'Repository',
        dataType: 'string',
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
        dataType: 'string',
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'seriesName',
        field: 'seriesTitleName',
        headerName: 'Series Title',
        javaVariableName: 'seriesTitleName',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        width: 150,
    },
    {
        colId: 'seasonNumber',
        field: 'seasonNumber',
        headerName: 'Season Number',
        javaVariableName: 'seasonNumber',
        enableSearch: true,
        dataType: 'integer',
        searchDataType: 'integer',
        minWidth: 100,
    },
    {
        colId: 'episodeNumber',
        field: 'episodeNumber',
        headerName: 'Episode Number',
        javaVariableName: 'episodeNumber',
        enableSearch: true,
        dataType: 'integer',
        searchDataType: 'integer',
        minWidth: 100,
    },
    {
        colId: 'releaseYear',
        field: 'releaseYear',
        headerName: 'Release Year',
        javaVariableName: 'releaseYear',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        minWidth: 100,
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

export const UPLOAD_COLUMN_MAPPINGS = [
    {
        colId: 'status',
        field: 'status',
        headerName: 'Ingest Status',
        javaVariableName: 'status',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        width: 150,
        sortable: false,
    },
    {
        colId: 'uploadedAt',
        field: 'uploadedAt',
        headerName: 'Upload Date',
        javaVariableName: 'uploadedAt',
        enableSearch: true,
        dataType: 'dateColumn',
        searchDataType: 'businessDateTime',
        width: 250,
        sortable: false,
    },
    {
        colId: 'sourceFileName',
        field: 'sourceFileName',
        headerName: 'File Name',
        javaVariableName: 'sourceFileName',
        enableSearch: false,
        dataType: 'string',
        width: 380,
        sortable: false,
    },
    {
        colId: 'error',
        field: 'error',
        headerName: 'Error',
        javaVariableName: 'error',
        enableSearch: false,
        dataType: 'string',
        width: 225,
        sortable: false,
    },
    {
        colId: 'uploadedBy',
        field: 'uploadedBy',
        headerName: 'Uploaded By',
        javaVariableName: 'uploadedBy',
        enableSearch: true,
        dataType: 'string',
        searchDataType: 'string',
        width: 150,
        sortable: false,
    },
    {
        colId: 'reportId',
        field: 'reportId',
        headerName: 'Report',
        enableSearch: false,
        cellRenderer: 'iconCellRenderer',
        cellRendererParams: {
            icon: 'download',
            tooltip: 'Download',
        },
        width: 100,
        sortable: false,
    },
];

export const FIELDS_TO_REMOVE = ['editorial', 'territorial', 'movidaExternalIds', 'vzExternalIds'];
export const UNABLE_PUBLISH =
    'Unable to Publish: Additional information required in EMets or some of the EMets are not in complete status';

export const METADATA_UPLOAD_TITLE = 'METADATA INGEST';
export const METADATA_UPLOAD_ERROR_TITLE = 'Upload Metadata error';

export const TITLE_METADATA_TABS = [
    {label: 'Repository', value: 'repository'},
    {label: 'Sync Status', value: 'syncLog'},
    {label: 'Upload Log', value: 'uploadLog'},
];

export const TABLE_LABELS = {
    savedDropdownLabel: 'Saved Table View:',
    savedViewslabel: 'My Saved Views',
};

export const TABLE_OPTIONS = [{label: 'All', value: 'all'}];
