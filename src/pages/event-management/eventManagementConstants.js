export const TITLE = 'Event Management';
export const REFRESH_BTN = 'Refresh';
export const CLEAR_FILTERS_BTN = 'Clear Filters';
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

export const NOT_FILTERABLE_FIELDS = ['principal', 'avroClassName', 'eventClassName', 'summary'];

export const EVENT_MESSAGE = 'Event Message';
export const EVENT_ATTACHMENTS = 'Event Attachments';
export const DOWNLOAD = 'Download';

export const INITIAL_SORT = {colId: 'createdTimeStamp', sort: 'desc'};

export const JSON_MIME_TYPE = 'application/json';
export const XML_MIME_TYPE = 'application/xml';

export const JSON_DECODING_ERR_MSG = {error: 'data decoding error'};
export const JSON_PARSING_ERR_MSG = {error: 'data parsing error'};
export const XML_DECODING_ERR_MSG = '<rawData>data decoding error</rawData>';
export const XML_EMPTY_ELEMENT = '<rawData></rawData>';
