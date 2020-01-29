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
        pending: 'Pending',
        errors: 'Error',
        fatal: 'Fatal'
    },
    ingestTypes: {
        EMAIL: 'Email',
        UPLOAD: 'Upload'
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
    },
    SERVICE_REGIONS: [
        {label: 'US'},
        {label: 'UK'}
    ],
};