import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';

const columnDefinitions = [
    {
        colId: 'serviceType',
        field: 'serviceType',
        dataSource: 'serviceType',
        headerName: 'Service Type',
        width: 150,
    },
    {
        colId: 'assetType',
        field: 'assetType',
        dataSource: 'assetType',
        headerName: 'Asset Type',
        width: 150,
    },
    {
        colId: 'spec',
        field: 'spec',
        dataSource: 'spec',
        headerName: 'Spec',
        width: 150,
    },
    {
        colId: 'components',
    },
    {
        colId: 'doNotStartBefore',
        field: 'doNotStartBefore',
        headerName: 'Do not start before',
        width: 220,
        valueFormatter: params => ISODateToView(params.data.doNotStartBefore, DATETIME_FIELDS.BUSINESS_DATETIME),
    },
    {
        colId: 'priority',
        field: 'priority',
        dataSource: 'priority',
        headerName: 'Priority',
        width: 90,
    },
    {
        colId: 'recipient',
        field: 'recipient',
        headerName: 'Recipient',
        width: 160,
    },
    {
        colId: 'operationalStatus',
        field: 'operationalStatus',
        headerName: 'Operational Status',
        width: 200,
    },
];

export default columnDefinitions;
