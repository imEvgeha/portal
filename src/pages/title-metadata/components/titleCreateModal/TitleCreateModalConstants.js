const NEW_TITLE_MODAL_TITLE = 'Create New Title';
const NEW_TITLE_TOAST_SUCCESS_MESSAGE = 'You successfully created a new title!';
const NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE = 'You successfully published the new title!';
const NEW_TITLE_TOAST_ERROR_PUBLISHING_MESSAGE = 'Title publishing failed!';
const NEW_TITLE_LABEL_CANCEL = 'Cancel';
const NEW_TITLE_LABEL_SUBMIT = 'Match & Create';
const NEW_TITLE_ERROR_ALREADY_EXISTS =
    'WARNING! Title already exists. Please select existing title or edit title details.';
const NEW_TITLE_ERROR_EMPTY_FIELDS = 'WARNING! Please add all required fields.';
const EXTERNAL_ID_TYPE_DUPLICATE_ERROR = 'External ID Type + External ID combination must be unique.';

const CREATE_TITLE_RESTRICTIONS = {
    MAX_TITLE_LENGTH: 250,
    MAX_SEASON_LENGTH: 3,
    MAX_EPISODE_LENGTH: 6,
    MAX_NUMBER_OF_EPISODES: 999999,
    MAX_NUMBER_OF_SEASONS: 999,
    MAX_RELEASE_YEAR: 9999,
    MAX_SEASONS_LENGTH: 3,
    MIN_DURATION_LENGTH: 8,
    MAX_DURATION_LENGTH: 8,
    MAX_RELEASE_YEAR_LENGTH: 4,
    MAX_BRIEF_TITLE_LENGTH: 500,
    MAX_MEDIUM_TITLE_LENGTH: 500,
    MAX_SORT_TITLE_LENGTH: 500,
    MAX_SYNOPSIS_LENGTH: 4000,
    MAX_COPYRIGHT_LENGTH: 1000,
};

const TENANT_CODE_ITEMS = [
    {
        label: 'Vubiquity',
        value: 'VU',
    },
    {
        label: 'MGM',
        value: 'MGM',
    },
];

export const CONTENT_TYPES = {
    MOVIE: 'Movie',
    SERIES: 'Series',
    MINI_SERIES: 'Mini Series',
    SEASON: 'Season',
    EPISODE: 'Episode',
    PREVIEW: 'Preview',
    SPORTS: 'Sports',
    SPECIAL: 'Special',
    PAID_PROGRAMMING: 'Paid Programming',
    AD: 'Advertisement',
    PODCAST: 'Podcast',
    DOCUMENTARY: 'Documentary',
};

export const DEFAULT_VALUES_FOR_TITLE_CREATE_MODAL = {
    title: '',
    contentType: null,
    contentSubtype: null,
    releaseYear: '',
};

export default {
    NEW_TITLE_TOAST_SUCCESS_MESSAGE,
    NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE,
    NEW_TITLE_TOAST_ERROR_PUBLISHING_MESSAGE,
    NEW_TITLE_MODAL_TITLE,
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
    NEW_TITLE_ERROR_ALREADY_EXISTS,
    NEW_TITLE_ERROR_EMPTY_FIELDS,
    CREATE_TITLE_RESTRICTIONS,
    TENANT_CODE_ITEMS,
    EXTERNAL_ID_TYPE_DUPLICATE_ERROR,
};
