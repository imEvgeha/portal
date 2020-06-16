export const STUDIO = 'Studio';
export const MSS_ORDER_DETAILS = 'MSS Order Details';
export const CREATED_DATE = 'Created Date';
export const CREATED_BY = 'Created By';

export const DATE_FORMAT = 'MMM Do YYYY, h:mm:ss a';

export const COLUMNS = [
    'Title',
    'Version',
    'Due Date',
    'Primary Video',
    'Secondary Audio',
    'Sub-titles Full',
    'Sub-titles Forced',
    'Trailer',
    'Metadata',
    'Artwork',
    'Notes'
];

export const COLUMN_KEYS = [
    'productDesc',
    'version',
    'srdueDate',
    'primaryVideo',
    'secondaryAudio',
    'subtitlesFull',
    'subtitlesForced',
    'trailer',
    'metaData',
    'artWork',
    'materialNotes'
];

export const FILTER_LIST = [
    { value: 'All', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'complete', label: 'Complete' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'failed', label: 'Failed' }
];

export const SORT_DIRECTION = [
    { value: 'NONE', label: 'None' },
    { value: 'ASCENDING', label: 'Ascending' },
    { value: 'DESCENDING', label: 'Descending' }
];
