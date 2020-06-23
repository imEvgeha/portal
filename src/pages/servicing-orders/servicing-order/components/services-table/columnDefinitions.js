import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';

const columnDefinitions = [
    {
        colId: 'componentId',
        field: 'componentId',
        dataSource: 'componentId',
        headerName: 'Component ID',
    },
    {
        colId: 'spec',
        field: 'spec',
        dataSource: 'spec',
        headerName: 'Spec',
    },
    {
        colId: 'doNotStartBefore',
        field: 'doNotStartBefore',
        headerName: 'Do not start before',
        width: 320,
        valueFormatter: params =>
            ISODateToView(params.data.doNotStartBefore, DATETIME_FIELDS.BUSINESS_DATETIME)
        },
    {
        colId: 'priority',
        field: 'priority',
        dataSource: 'priority',
        headerName: 'Priority',
    },
    {
        colId: 'deliverToVu',
        field: 'deliverToVu',
        dataSource: 'deliverToVu',
        headerName: 'Deliver to VU',
    },
    {
        colId: 'operationalStatus',
        field: 'operationalStatus',
        headerName: 'Operational Status',
    }
];

export default columnDefinitions;
