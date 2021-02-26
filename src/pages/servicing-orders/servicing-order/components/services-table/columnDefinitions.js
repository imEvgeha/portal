import React from 'react';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

const WaterMark  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       className="bi bi-droplet-half" viewBox="0 0 16 16">
    <path fill-rule="evenodd"
          d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
    <path fill-rule="evenodd"
          d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
</svg>`

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
        headerName: '',
        headerComponentParams: { menuIcon: WaterMark},
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
