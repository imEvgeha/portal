export default {
    STATUS_LIST: [
        { value: '', label: 'ALL' },
        { value: 'PENDING', label: 'PENDING' },
        { value: 'MANUAL', label: 'MANUAL' },
        { value: 'COMPLETED', label: 'COMPLETED' },
        { value: 'FAILED', label: 'FAILED' },
    ],
    DATEPICKER_LABELS: ['From', 'To'],
    REPORT: {
        total: 'Rights',
        created: 'Created',
        updated: 'Updated',
        fatal: 'Fatals',
        pending: 'Pending',
        errors: 'Errors'
    },
    ingestTypes: {
        EMAIL: 'Email',
        UPLOAD: 'Upload'
    },
    attachmentTypes: {
        EXCEL: 'Excel',
        EMAIL: 'Email'
    },
    filterKeys: {
        RECEIVED_FROM: 'receivedFrom',
        RECEIVED_TO: 'receivedTo',
        STATUS: 'status',
        PROVIDER: 'provider'
    },
    URLFilterKeys: {
        receivedFrom: 'igReceivedFrom',
        receivedTo: 'igReceivedTo',
        status: 'igStatus',
        provider: 'igProvider'
    }
};