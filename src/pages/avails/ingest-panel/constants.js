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
    INGEST_LIST: [
        {value: '', label: 'ALL'},
        {value: 'EMAIL', label: 'EMAIL'},
        {value: 'UPLOAD', label: 'UPLOAD'},
    ],
    ingestTypes: {
        EMAIL: 'Email',
        UPLOAD: 'Upload',
    },
    attachmentTypes: {
        EXCEL: 'Excel',
        EMAIL: 'Email',
        PDF: 'PDF',
    },
    filterKeys: {
        RECEIVED_FROM: 'receivedFrom',
        RECEIVED_TO: 'receivedTo',
        STATUS: 'status',
        LICENSOR: 'licensor',
        INGEST_TYPE: 'ingestType',
        EMAIL_SUBJECT: 'emailSubject',
        FILE_NAME: 'attachmentFilename',
    },
    URLFilterKeys: {
        receivedFrom: 'igReceivedFrom',
        receivedTo: 'igReceivedTo',
        ingestType: 'ingestType',
        status: 'igStatus',
        licensor: 'igLicensor',
        emailSubject: 'emailSubject',
        attachmentFilename: 'attachmentFilename',
    },
    SERVICE_REGIONS: [
        {label: 'US', value: 'US'},
        {label: 'UK', value: 'UK'},
    ],
    CATALOG_TYPES: [
        {label: 'Full', value: 'Full Catalog'},
        {label: 'Title', value: 'Title Catalog'},
    ],
    TEMPLATES: {
        STUDIO: 'Studio',
        USMASTER: 'US Master',
        INTERNATIONAL: 'International',
        LICENSEE: 'Licensee',
    },
    LICENSEE_WARNING: 'Any mismatches between the file and the selected licensees will result in a fatal',
    LICENSEE_TOOLTIP_MSG:
        'If Licensee is defined anywhere in the file, the system will use the file to determine Licensee.',
};

export const DEBOUNCE_TIMEOUT = 2000;
