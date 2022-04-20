import {
    ADVERTISEMENT,
    EPISODE,
    EVENT,
    MOVIE,
    SEASON,
    SERIES,
    SPORTS,
    SPECIAL,
} from '../../../metadata/constants/contentType';

const NEW_TITLE_MODAL_TITLE = 'Create New Title';
const NEW_TITLE_TOAST_SUCCESS_MESSAGE = 'You successfully created a new title!';
const NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE = 'You successfully published the new title!';
const NEW_TITLE_TOAST_ERROR_PUBLISHING_MESSAGE = 'Title publishing failed!';
const NEW_TITLE_LABEL_CANCEL = 'Cancel';
const NEW_TITLE_LABEL_SUBMIT = 'Match & Create';
const NEW_TITLE_ERROR_ALREADY_EXISTS =
    'WARNING! Title already exists. Please select existing title or edit title details.';
const NEW_TITLE_ERROR_EMPTY_FIELDS = 'WARNING! Please add all required fields.';

const CREATE_TITLE_RESTRICTIONS = {
    MAX_TITLE_LENGTH: 20,
    MAX_SEASON_LENGTH: 3,
    MAX_EPISODE_LENGTH: 4,
    MAX_NUMBER_OF_EPISODES: 9999,
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

export const CONTENT_TYPE_ITEMS = [
    {label: 'Select Content Type', value: ''},
    {label: MOVIE.name, value: MOVIE.apiName},
    {label: SERIES.name, value: SERIES.apiName},
    {label: SEASON.name, value: SEASON.apiName},
    {label: EPISODE.name, value: EPISODE.apiName},
    {label: EVENT.name, value: EVENT.apiName},
    {label: SPORTS.name, value: SPORTS.apiName},
    {label: ADVERTISEMENT.name, value: ADVERTISEMENT.apiName},
    {label: SPECIAL.name, value: SPECIAL.apiName},
];

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
};
