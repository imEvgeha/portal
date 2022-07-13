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
export const INCORRECT_YEAR = 'INCORRECT YEAR: MUST BE IN FORMAT YYYY';
export const INCORRECT_TIME = 'INCORRECT TIME: MUST BE IN FORMAT HH:MM:SS';
export const INCORRECT_DURATION = 'INCORRECT DURATION FORMAT: SEE TOOLTIP';
export const RIGHT_STATUS_CANCELED = 'RIGHT STATUS SHOULD BE WITHDRAWN/CANCELED IF ALL TERRITORIES ARE WITHDRAWN';

export const FIELDS_WITHOUT_LABEL = ['castCrew', 'licensors', 'rowDataItem'];

export const NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS = {
    editorialMetadata: 'editorial',
    territorialMetadata: 'territorial',
    ratings: 'ratings',
};

export const MASTER_EMET_MESSAGE =
    'You are about to edit Master Editorial Record. All linked records will be updated accordingly.';

// todo: remove below
export const TABS_MAPPINGS = [
    {tabName: 'Basic Info and Territory', id: 'Basic Info'},
    {tabName: 'Title and Episodic', id: 'Title'},
    {tabName: 'IDs', id: 'IDs'},
    {tabName: 'Localization and captions', id: 'Localization'},
    {tabName: 'Other', id: 'Other'},
    {tabName: 'Music', id: 'Music'},
    {tabName: 'Title', id: 'Core Title'},
    {tabName: 'Cast & Crew', id: 'Cast & Crew'},
    {tabName: 'Ratings', id: 'Ratings'},
    {tabName: "External ID's", id: 'External IDs'},
    {tabName: 'Editorial', id: 'Editorial'},
    {tabName: 'Territorial', id: 'Territorial'},
    {tabName: 'Rights', id: 'Rights'},
    {tabName: 'Sync Log', id: 'Sync Log'},
];

export const SEASON = 'season';
export const SERIES = 'series';
export const EPISODE = 'episode';
export const MINI_SERIES = 'mini-series';
export const CORE_TITLE_SECTION = 'Core Title';
export const CAST_AND_CREW_TITLE = 'Cast & Crew';
export const PROPAGATE_TITLE = 'Propagate';

export const MANDATORY_VZ = 'Mandatory if title will be published to VZ';
export const ONE_MANDATORY_VZ = 'At least one synopsis is mandatory if title will be published to VZ';
export const LOCALIZED_VALUE_NOT_DEFINED = 'Localized value not defined';
