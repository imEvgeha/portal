export default {
    filterKeys: {
        BILL_TO: 'billTo',
        RATE_CARD: 'rateCard',
        STATUS: 'status',
        DUE_DATE: 'dueDate',
        START_DATE: 'startDate'
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
        { value: 'Completed', label: 'Completed'},
        { value: 'On Hold', label: 'On Hold'},
        { value: 'In Progress', label: 'In Progress'},
        { value: 'Canceled', label: 'Canceled'},
        { value: 'Not Started', label: 'Not Started'},
        { value: 'Pending', label: 'Pending'},
    ],
};