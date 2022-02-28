export default [
    {
        colId: 'status',
        field: 'status',
        headerName: 'Status',
        javaVariableName: 'status',
        enableSearch: true,
        searchDataType: 'string',
        dataType: 'string',
        minWidth: 100,
    },
    {
        colId: 'rightTitle',
        field: 'rightTitle',
        headerName: 'Right Title',
        javaVariableName: 'rightTitle',
        minWidth: 150,
    },
    {
        colId: 'entityId',
        field: 'entityId',
        enableSearch: true,
        javaVariableName: 'entityId',
        dataType: 'string',
        searchDataType: 'string',
        headerName: 'Right ID',
        minWidth: 150,
    },
    {
        colId: 'titleId',
        field: 'titleId',
        javaVariableName: 'titleId',
        dataType: 'string',
        searchDataType: 'string',
        enableSearch: true,
        headerName: 'Title ID',
        minWidth: 150,
    },
    {
        colId: 'externalSystem',
        field: 'externalSystem',
        javaVariableName: 'externalSystem',
        headerName: 'External System',
        minWidth: 120,
    },
    {
        colId: 'publishedAt',
        field: 'publishedAt',
        searchDataType: "regionalMidnight",
        javaVariableName: 'publishedAt',
        enableSearch: true,
        dataType: 'timestamp',
        headerName: 'Publish date',
        minWidth: 150,
    },
    {
        colId: 'publishErrors',
        field: 'publishErrors',
        javaVariableName: 'publishErrors',
        headerName: 'Errors',
        minWidth: 150,
        cellRenderer: 'publishErrors',
    },
];