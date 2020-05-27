export default {
    fieldKeys: {
        BILL_TO: 'billTo',
        RATE_CARD: 'rateCard',
        STATUS: 'status',
        DUE_DATE: 'dueDate',
        START_DATE: 'startDate',
        PRIORITY: 'priority'
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
        { value: 'completed', label: 'Completed'},
        { value: 'on-hold', label: 'On Hold'},
        { value: 'in-progress', label: 'In Progress'}
    ],
    NOTES: 'notes',
    SOURCE_TITLE: 'Sources',
    SOURCE_SUBTITLE: 'Select source to view associated children services indicated by the badge',
};
