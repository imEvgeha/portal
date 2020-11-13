export const VIEWS = {
    EDIT: 'EDIT',
    VIEW: 'VIEW',
    CREATE: 'CREATE',
};
export const DELETE_POPUP = 'Are you sure you want to delete the territory?';
export const INCORRECT_LENGTH = 'INCORRECT LENGTH';
export const DATETIME_FIELDS = {
    TIMESTAMP: 'timestamp',
    BUSINESS_DATETIME: 'businessDateTime',
    SIMULCAST: 'simulcast',
    REGIONAL: 'regional',
    REGIONAL_MIDNIGHT: 'regionalMidnight',
};
export const INCORRECT_VALUE = 'INCORRECT_VALUE';
export const FIELD_REQUIRED = 'CANNOT BE EMPTY';
export const INCORRECT_INTEGER = 'INCORRECT VALUE: MUST BE AN INTEGER';

export const TABS_MAPPINGS = [
    {tabName: 'Basic Info and Territory', id: 'Basic Info'},
    {tabName: 'Title and Episodic', id: 'Title'},
    {tabName: 'IDs', id: 'IDs'},
    {tabName: 'Localization and captions', id: 'Localization'},
    {tabName: 'Other', id: 'Other'},
    {tabName: 'Music', id: 'Music'},
];

export const INCORRECT_YEAR = 'INCORRECT YEAR: MUST BE IN FORMAT YYYY';
export const INCORRECT_TIME = 'INCORRECT TIME: MUST BE IN FORMAT HH:MM:SS';

export const NOT_ALL_WITHDRAWN_ALLOWED_VALUES = ['Pending', 'Confirmed', 'Tentative'];
export const ALL_WITHDRAWN_ALLOWED_VALUES = ['Canceled', 'Withdrawn'];
export const ALL_WITHDRAWN_ERROR = 'ONLY WITHDRAWN OR CANCELED ARE ALLOWED IF ALL TERRITORIES ARE WITHDRAWN';
export const NOT_ALL_WITHDRAWN_ERROR =
    'ONLY PENDING, TENTATIVE OR CONFIRMED ARE ALLOWED IF NOT ALL TERRITORIES ARE WITHDRAWN';
