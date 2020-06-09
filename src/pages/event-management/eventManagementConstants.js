export const TITLE = 'Event Management';
export const DRAWER_TITLE = 'Event Details';

export const EVENT_HEADER = 'Event Header';
export const EVENT_HEADER_MAIN_FIELDS = [
    'eventId',
    'correlationId',
    'eventType',
    'eventSource',
    'tenantId',
    'objectId',
    'createdTimeStamp',
];
export const EVENT_HEADER_SECONDARY_FIELDS = [
    'postedTimeStamp',
    'replyTo',
    'autoClassName',
    'eventClassName',
    'summary',
];

export const EVENT_MESSAGE = 'Event Message';
export const EVENT_ATTACHMENTS = 'Event Attachments';
export const DOWNLOAD = 'Download';

export const INITIAL_SORT = {colId: 'createdTimeStamp', sort: 'desc'};
