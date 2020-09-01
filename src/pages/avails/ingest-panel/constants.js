export default {
    STATUS_LIST: [
        {value: '', label: 'ALL'},
        {value: 'PENDING', label: 'PENDING'},
        {value: 'MANUAL', label: 'MANUAL'},
        {value: 'COMPLETED', label: 'COMPLETED'},
        {value: 'FAILED', label: 'FAILED'},
    ],
    DATEPICKER_LABELS: ['From', 'To'],
    REPORT: {
        total: {label: 'Rights', value: ''},
        created: {label: 'New', value: 'Created'},
        updated: {label: 'Updated', value: 'Updated'},
        fatal: {label: 'Fatals', value: 'Fatal'},
        pending: {label: 'Pending', value: 'Pending'},
        errors: {label: 'Errors', value: 'Error'},
    },
    ingestTypes: {
        EMAIL: 'Email',
        UPLOAD: 'Upload',
    },
    attachmentTypes: {
        EXCEL: 'Excel',
        EMAIL: 'Email',
    },
    filterKeys: {
        RECEIVED_FROM: 'receivedFrom',
        RECEIVED_TO: 'receivedTo',
        STATUS: 'status',
        LICENSOR: 'licensor',
    },
    URLFilterKeys: {
        receivedFrom: 'igReceivedFrom',
        receivedTo: 'igReceivedTo',
        status: 'igStatus',
        licensor: 'igLicensor',
    },
    SERVICE_REGIONS: [
        {label: 'US', value: 'US'},
        {label: 'UK', value: 'UK'},
    ],
    TEMPLATES: {
        STUDIO: 'Studio',
        USMASTER: 'US Master',
        INTERNATIONAL: 'International',
    },
    LICENSEE_WARNING: 'Any mismatches between the file and the selected licensees will result in a fatal',
};

export const DEBOUNCE_TIMEOUT = 2000;
