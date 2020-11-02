import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';

const columnDefinitions = [
    {
        colId: 'serviceType',
        field: 'serviceType',
        dataSource: 'serviceType',
        headerName: 'Service Type',
    },
    {
        colId: 'assetType',
        field: 'assetType',
        dataSource: 'assetType',
        headerName: 'Asset Type',
    },
    {
        colId: 'spec',
        field: 'spec',
        dataSource: 'spec',
        headerName: 'Spec',
    },
    {
        colId: 'components',
    },
    {
        colId: 'doNotStartBefore',
        field: 'doNotStartBefore',
        headerName: 'Do not start before',
        valueFormatter: params => ISODateToView(params.data.doNotStartBefore, DATETIME_FIELDS.BUSINESS_DATETIME),
    },
    {
        colId: 'priority',
        field: 'priority',
        dataSource: 'priority',
        headerName: 'Priority',
    },
    {
        colId: 'recipient',
        field: 'recipient',
        headerName: 'Recipient',
    },
    {
        colId: 'operationalStatus',
        field: 'operationalStatus',
        headerName: 'Operational Status',
    },
];

export default columnDefinitions;
