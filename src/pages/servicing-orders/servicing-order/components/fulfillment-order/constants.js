export default {
    fieldKeys: {
        ID: 'external_id',
        STATUS: 'status',
        DUE_DATE: 'definition.dueDate',
        START_DATE: 'definition.startDate',
        SERVICER: 'fs',
        NOTE: 'note',
    },
    BILL_TO_LIST: [
        { value: 'MGM', label: 'MGM' },
        { value: 'WB', label: 'WB' }
    ],
    RATE_CARD_LIST: [
        { value: 'MGM Rate Card', label: 'MGM Rate Card' },
        { value: 'WB Rate Card', label: 'WB Rate Card' }
    ],
    STATUS_LIST: [
        { value: 'NEW', label: 'New'},
        { value: 'ACCEPTED', label: 'Accepted'},
        { value: 'REJECTED', label: 'Rejected'},
        { value: 'COMPLETE', label: 'Complete'},
        { value: 'CANCELED', label: 'Canceled'},
        { value: 'FAILED', label: 'Failed'}
    ],
    SOURCE_TITLE: 'Sources',
    SOURCE_SUBTITLE: 'Select source to view associated children services indicated by the badge',
    SERVICES_TITLE: 'Services',
    SERVICES_BARCODE: 'Barcode',
};
