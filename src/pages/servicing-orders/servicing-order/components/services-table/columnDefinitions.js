const columnDefinitions = [
    {
        colId: 'externalServices',
        field: 'externalServices',
        dataSource: 'externalServices.externalId',
        headerName: 'Component ID',
    },
    {
        colId: 'spec',
        field: 'spec',
        dataSource: 'externalServices.formatType',
        headerName: 'Spec',
    },
    {
        colId: 'addRecipient',
        field: 'addRecipient',
        dataSource: 'deteTasks.deteDeliveries.externalDelivery.deliverToId',
        headerName: 'Add recipient',
    },
    {
        colId: 'overrideDueDate',
        field: 'overrideDueDate',
        headerName: 'Do not start before',
    },
    {
        colId: 'status',
        field: 'status',
        headerName: 'Operational Status',
    }
];

export default columnDefinitions;
