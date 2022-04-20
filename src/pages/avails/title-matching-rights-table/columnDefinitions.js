const columnDefinitions = [
    {
        colId: 'id',
        field: 'id',
        headerName: 'Right ID',
        cellRendererParams: {
            link: 'avails/rights/',
            newTab: true,
        },
        cellRenderer: 'loadingCellRenderer',
    },
    {
        colId: 'updatedCatalogReceived',
        field: 'updatedCatalogReceived',
        headerName: '',
        cellRenderer: 'iconCellRenderer',
        cellRendererParams: {
            icon: 'warning',
            tooltip: 'Removed from Catalog',
        },
        width: 45,
    },
    {
        colId: 'rightStatus',
        field: 'rightStatus',
        headerName: '',
        cellRenderer: 'iconCellRenderer',
        cellRendererParams: {
            icon: 'block',
            tooltip: 'Withdrawn',
            valueToDisplay: 'Withdrawn',
        },
        width: 45,
    },
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        cellRenderer: 'loadingCellRenderer',
    },
    {
        colId: 'sourceRightId',
        field: 'sourceRightId',
        headerName: 'Source Right ID',
    },
    {
        colId: 'bonusRight',
        field: 'bonusRight',
        headerName: 'Bonus Right',
        valueFormatter: params => {
            return params.value ? 'Yes' : 'No';
        },
    },
    {
        colId: 'coreTitleId',
        field: 'coreTitleId',
        headerName: 'Core Title Id',
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
        colId: 'seriesTitle',
        field: 'seriesTitle',
        headerName: 'Series Title',
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
