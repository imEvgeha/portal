import {
    ADVERTISEMENT,
    EPISODE,
    EVENT,
    MOVIE,
    SEASON,
    SERIES,
    SPORTS,
    SPECIAL,
} from '../../../../../../metadata/constants/contentType';

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
    MAX_TITLE_LENGTH: 2000,
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

const getTitleFormSchema = currentValue => [
    {
        name: 'title',
        id: 'title',
        label: 'Title',
        type: 'text',
        shouldFitContainer: true,
        omitWhenHidden: true,
        placeholder: 'Enter Title',
        required: true,
        validWhen: {
            lengthIsLessThan: {
                length: CREATE_TITLE_RESTRICTIONS.MAX_TITLE_LENGTH,
                message: `Title must have less than ${CREATE_TITLE_RESTRICTIONS.MAX_TITLE_LENGTH} characters`,
            },
        },
        defaultValue: currentValue.title,
    },
    {
        name: 'contentType',
        id: 'contentType',
        label: 'Content Type',
        type: 'select',
        shouldFitContainer: true,
        omitWhenHidden: true,
        defaultValue: currentValue.contentType,
        placeholder: 'Select content type',
        required: true,
        defaultDisabled: true,
        options: [
            {
                items: [
                    {label: MOVIE.name, value: MOVIE.apiName},
                    {label: SERIES.name, value: SERIES.apiName},
                    {label: SEASON.name, value: SEASON.apiName},
                    {label: EPISODE.name, value: EPISODE.apiName},
                    {label: EVENT.name, value: EVENT.apiName},
                    {label: SPORTS.name, value: SPORTS.apiName},
                    {label: ADVERTISEMENT.name, value: ADVERTISEMENT.apiName},
                    {label: SPECIAL.name, value: SPECIAL.apiName},
                ],
            },
        ],
    },
    {
        name: 'seriesTitleName',
        id: 'seriesTitleName',
        label: 'Series Title Name',
        type: 'text',
        placeholder: 'Enter Series Name',
        shouldFitContainer: true,
        omitWhenHidden: true,
        defaultValue: '',
        requiredWhen: [
            {
                field: 'contentType',
                is: [SEASON.apiName, EPISODE.apiName],
            },
            {
                field: 'seasonNumber',
                isNot: [''],
            },
            {
                field: 'episodeNumber',
                isNot: [''],
            },
        ],
        visibleWhen: [
            {
                field: 'contentType',
                is: [SEASON.apiName, EPISODE.apiName, EVENT.apiName, SPORTS.apiName, SPECIAL.apiName],
            },
        ],
    },
    {
        name: 'seasonNumber',
        id: 'seasonNumber',
        label: 'Season',
        defaultValue: '',
        placeholder: 'Enter Season Number',
        type: 'text',
        shouldFitContainer: true,
        omitWhenHidden: true,
        requiredWhen: [
            {
                field: 'contentType',
                is: [SEASON.apiName, EPISODE.apiName],
            },
            {
                field: 'seriesTitleName',
                isNot: [''],
            },
            {
                field: 'episodeNumber',
                isNot: [''],
            },
        ],
        visibleWhen: [
            {
                field: 'contentType',
                is: [SEASON.apiName, EPISODE.apiName, EVENT.apiName, SPORTS.apiName, SPECIAL.apiName],
            },
        ],
        validWhen: {
            fallsWithinNumericalRange: {
                max: CREATE_TITLE_RESTRICTIONS.MAX_NUMBER_OF_SEASONS,
                message: `Season number can't be higher than ${CREATE_TITLE_RESTRICTIONS.MAX_NUMBER_OF_SEASONS}`,
            },
            matchesRegEx: {
                pattern: '^[0-9]+$',
                message: 'Only numbers are allowed',
            },
        },
    },
    {
        name: 'episodeNumber',
        id: 'episodeNumber',
        label: 'Episode',
        type: 'text',
        defaultValue: '',
        placeholder: 'Enter Episode Number',
        shouldFitContainer: true,
        omitWhenHidden: true,
        requiredWhen: [
            {
                field: 'contentType',
                is: [EPISODE.apiName],
            },
            {
                field: 'seriesTitleName',
                isNot: [''],
            },
            {
                field: 'seasonNumber',
                isNot: [''],
            },
        ],
        visibleWhen: [
            {
                field: 'contentType',
                is: [EPISODE.apiName, EVENT.apiName, SPORTS.apiName, SPECIAL.apiName],
            },
        ],
        validWhen: {
            fallsWithinNumericalRange: {
                max: CREATE_TITLE_RESTRICTIONS.MAX_NUMBER_OF_EPISODES,
                message: `Episode number can't be higher than ${CREATE_TITLE_RESTRICTIONS.MAX_NUMBER_OF_EPISODES}`,
            },
            matchesRegEx: {
                pattern: '^[0-9]+$',
                message: 'Only numbers are allowed',
            },
        },
    },
    {
        name: 'releaseYear',
        id: 'releaseYear',
        label: 'Release Year',
        type: 'text',
        placeholder: 'Enter Release Year',
        shouldFitContainer: true,
        omitWhenHidden: true,
        defaultValue: currentValue.releaseYear,
        requiredWhen: [
            {
                field: 'contentType',
                isNot: [SERIES.apiName],
            },
        ],
        visibleWhen: [
            {
                field: 'contentType',
                isNot: [SEASON.apiName],
            },
        ],
        validWhen: {
            fallsWithinNumericalRange: {
                max: CREATE_TITLE_RESTRICTIONS.MAX_RELEASE_YEAR,
                message: `Release Year can't be past year ${CREATE_TITLE_RESTRICTIONS.MAX_RELEASE_YEAR}`,
            },
            matchesRegEx: {
                pattern: '^[0-9]+$',
                message: 'Only numbers are allowed',
            },
        },
    },
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
    getTitleFormSchema,
};
