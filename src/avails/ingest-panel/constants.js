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
        total: { label: 'Rights', value: '' },
        created: { label: 'New', value: 'Created' },
        updated: { label: 'Updated', value: 'Updated' },
        fatal: { label: 'Fatals', value: 'Fatal' },
        pending: { label: 'Pending', value: 'Pending' },
        errors:  { label: 'Errors', value: 'Error' },
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
    },
    SERVICE_REGIONS: [
        {label: 'US', value: 'US'},
        {label: 'UK', value: 'UK'}
    ],
    TEMPLATES: [
        {label: 'Use International Template', value: 'International'},
        {label: 'Use US Template', value: 'US Master'},
        {label: 'Use Studio Template', value: 'Studio'}
    ],
};