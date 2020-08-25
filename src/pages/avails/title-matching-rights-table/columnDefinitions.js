const columnDefinitions = [
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        cellRenderer: 'loadingCellRenderer',
    },
    {
        colId: 'releaseYear',
        field: 'releaseYear',
        headerName: 'Release Year',
        width: 120,
    },
    {
        colId: 'licensor',
        field: 'licensor',
        headerName: 'Licensor',
        width: 120,
    },
    {
        colId: 'coreTitleId',
        field: 'coreTitleId',
        headerName: 'Core Title Id',
    },
    {
        colId: 'rightStatus',
        field: 'rightStatus',
        headerName: 'Right Status',
        width: 120,
    },
    {
        colId: 'status',
        field: 'status',
        headerName: 'Status',
        width: 120,
    },
    {
        colId: 'licenseType',
        field: 'licenseType',
        headerName: 'License Type',
        width: 120,
    },
    {
        colId: 'territory',
        field: 'territory',
        headerName: 'Country',
        width: 120,
    },
    {
        colId: 'contentType',
        field: 'contentType',
        headerName: 'Content Type',
        width: 120,
    },
    {
        colId: 'seasonNumber',
        field: 'seasonNumber',
        headerName: 'Season Number',
        width: 150,
    },
    {
        colId: 'episodeNumber',
        field: 'episodeNumber',
        headerName: 'Episode Number',
        width: 150,
    },
    {
        colId: 'format',
        field: 'format',
        headerName: 'Format',
        width: 100,
    },
];

export default columnDefinitions;
