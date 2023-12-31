export default {
    fieldKeys: {
        ID: 'external_id',
        STATUS: 'status',
        DUE_DATE: 'due_date',
        START_DATE: 'start_date',
        COMPLETED_DATE: 'completed_date',
        SERVICER: 'fs',
        NOTES: 'notes',
        READINESS: 'readiness',
        LATE_REASON: 'late_reason',
        LATE: 'late',
        LATE_FAULT: 'late_fault',
        PREMIERING: 'premiering',
        WATERMARK: 'watermark',
        MARKET_TYPE: 'market_type',
        CAR: 'car'
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
    MARKET_TYPES: [
        {value: null, label: 'NONE'},
        {value: 'MAJOR', label: 'Major'},
        {value: 'MINOR', label: 'Minor'},
    ],
    LATE_FAULT: [{value: null, label: 'NONE'}],
    SOURCE_TITLE: 'Sources',
    SOURCE_SUBTITLE: 'Select source to view associated children services indicated by the badge',
    SERVICES_TITLE: 'Services',
    SERVICES_BARCODE: 'Barcode',
};

export const READINESS_CHANGE_WARNING = "You are about to set a Fulfillment Order's readiness status to 'Ready'. Order revisions will only be possible prior to DETE processing";
export const ORDER_REVISION_WARNING = "You are about to submit an order revision to DETE. Order revisions will only be possible prior to DETE processing."
