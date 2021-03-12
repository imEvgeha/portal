import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

const columnDefinitions = [
    {
        colId: 'serviceType',
        field: 'serviceType',
        dataSource: 'serviceType',
        headerName: 'Service Type',
        width: 150,
        sortable: false,
    },
    {
        colId: 'assetType',
        field: 'assetType',
        dataSource: 'assetType',
        headerName: 'Asset Type',
        width: 120,
        sortable: false,
    },
    {
        colId: 'spec',
        field: 'spec',
        dataSource: 'spec',
        headerName: 'Format Sheet',
        width: 260,
        sortable: false,
    },
    {
        colId: 'components',
        field: 'components',
        dataSource: 'components',
        headerName: 'Components',
        autoHeight: true,
        width: 250,
        sortable: false,
    },
    {
        colId: 'doNotStartBefore',
        field: 'doNotStartBefore',
        headerName: 'Do not start before',
        width: 200,
        sortable: false,
        valueFormatter: params => ISODateToView(params.data?.doNotStartBefore, DATETIME_FIELDS.BUSINESS_DATETIME),
    },
    {
        colId: 'watermark',
        field: 'watermark',
        headerName: 'watermark',
        width: 50,
        sortable: false,
    },
    {
        colId: 'priority',
        field: 'priority',
        dataSource: 'priority',
        headerName: 'Priority',
        width: 90,
        sortable: false,
    },
    {
        colId: 'recipient',
        field: 'recipient',
        headerName: 'Recipient',
        width: 140,
        sortable: false,
    },
    {
        colId: 'operationalStatus',
        field: 'operationalStatus',
        headerName: 'Operational Status',
        width: 170,
        sortable: false,
    },
];

export default columnDefinitions;
