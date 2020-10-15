export default {
    REPORT_FIELDS: [
        {
            field: 'total',
            displayName: 'Total Avails',
        },
        {
            field: 'created',
            displayName: 'Created',
        },
        {
            field: 'updated',
            displayName: 'Updated',
        },
        {
            field: 'pending',
            displayName: 'Pending',
        },
        {
            field: 'errors',
            displayName: 'Error',
        },
        {
            field: 'fatal',
            displayName: 'Fatal',
        },
    ],
    REFRESH_INTERVAL: 5 * 1000, //5 seconds
    PAGE_SIZE: 100,
};
