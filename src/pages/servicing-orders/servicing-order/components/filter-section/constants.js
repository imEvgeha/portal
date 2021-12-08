export const STUDIO = 'Studio';
export const MSS_ORDER_DETAILS = 'MSS Order Details';
export const CREATED_DATE = 'Created Date';
export const CREATED_BY = 'Created By';

export const DATE_FORMAT = 'MMM Do YYYY, h:mm:ss a';

export const COLUMNS = [
    'Title',
    'Version',
    'Due Date',
    'Notes',
    'Primary Video',
    'Secondary Audio',
    'Subtitles Full',
    'Subtitles Forced',
    'Trailer',
    'Metadata',
    'Artwork',
];

export const COLUMN_KEYS = [
    'productDesc',
    'version',
    'srdueDate',
    'materialNotes',
    'primaryVideo',
    'secondaryAudio',
    'subtitlesFull',
    'subtitlesForced',
    'closedCaptions',
    'trailer',
    'metaData',
    'artWork',
];

export const SORT_DIRECTION = [
    {value: 'ID_ASCENDING', type: 'ID', label: 'ID Ascending'},
    {value: 'ID_DESCENDING', type: 'ID', label: 'ID Descending '},
    {value: 'TITLE_ASCENDING', type: 'TITLE', label: 'Title Ascending'},
    {value: 'TITLE_DESCENDING', type: 'TITLE', label: 'Title Descending'},
];
