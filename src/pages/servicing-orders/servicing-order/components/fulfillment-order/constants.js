export default {
    fieldKeys: {
        ID: 'external_id',
        STATUS: 'status',
        DUE_DATE: 'definition.dueDate',
        START_DATE: 'definition.startDate',
        SERVICER: 'fs',
        NOTES: 'notes',
        READINESS: 'readiness',
    },
    BILL_TO_LIST: [
        {value: 'MGM', label: 'MGM'},
        {value: 'WB', label: 'WB'},
    ],
    RATE_CARD_LIST: [
        {value: 'MGM Rate Card', label: 'MGM Rate Card'},
        {value: 'WB Rate Card', label: 'WB Rate Card'},
    ],
    STATUS: {
        NOT_STARTED: 'Not Started',
        IN_PROGRESS: 'In Progress',
        COMPLETE: 'Complete',
        CANCELLED: 'Cancelled',
        FAILED: 'Failed',
        ACCEPTED: 'Accepted',
    },
    READINESS_STATUS: [
        {value: 'NEW', label: 'New'},
        {value: 'ON_HOLD', label: 'On Hold'},
        {value: 'READY', label: 'Ready'},
    ],
    SOURCE_TITLE: 'Sources',
    SOURCE_SUBTITLE: 'Select source to view associated children services indicated by the badge',
    SERVICES_TITLE: 'Services',
    SERVICES_BARCODE: 'Barcode',
};
