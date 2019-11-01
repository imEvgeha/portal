import {ADVERTISEMENT, EPISODE, EVENT, MOVIE, SEASON, SERIES, SPORTS} from '../../../../constants/metadata/contentType';
import MetadataConstants from '../../../../containers/metadata/MetadataConstants';
const NEW_TITLE_MAX_NUMBER_OF_SEASONS = 999;
const NEW_TITLE_MAX_NUMBER_OF_EPISODES = 9999;
const NEW_TITLE_MAX_RELEASE_YEAR = 9999;
const NEW_TITLE_MODAL_TITLE = 'Create New Title';
const NEW_TITLE_TOAST_SUCCESS_MESSAGE = 'You successfully created a new title!';
const NEW_TITLE_LABEL_CANCEL = 'Cancel';
const NEW_TITLE_LABEL_SUBMIT = 'Match & Create';
const NEW_TITLE_ERROR_ALREADY_EXISTS = 'WARNING! Title already exists. Please select existing title or edit title details.';
const NEW_TITLE_ERROR_EMPTY_FIELDS = 'WARNING! Please add all required fields.';
const NEW_TITLE_FORM_SCHEMA = [
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
                length: MetadataConstants.MAX_TITLE_LENGTH,
                message: `Title must have less than ${MetadataConstants.MAX_TITLE_LENGTH} characters`
            },
        },
    },
    {
        name: 'contentType',
        id: 'contentType',
        label: 'Content Type',
        type: 'select',
        shouldFitContainer: true,
        omitWhenHidden: true,
        placeholder: 'Select content type',
        required: true,
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
                ],
            },
        ],
    },
    {
        name: 'seriesTitleName',
        id: 'titleSeriesName',
        label: 'Series Title Name',
        type: 'text',
        placeholder: 'Enter Series Name',
        shouldFitContainer: true,
        omitWhenHidden: true,
        requiredWhen: [
            {
                field: 'contentType',
                is: [
                    SEASON.apiName,
                    EPISODE.apiName,
                ]
            }
        ],
        visibleWhen: [
            {
                field: 'contentType',
                is: [
                    SEASON.apiName,
                    EPISODE.apiName,
                    EVENT.apiName,
                    SPORTS.apiName,
                ]
            }
        ],
    },
    {
        name: 'seasonNumber',
        id: 'titleSeasonNumber',
        label: 'Season',
        placeholder: 'Enter Season Number',
        type: 'text',
        shouldFitContainer: true,
        omitWhenHidden: true,
        requiredWhen: [
            {
                field: 'contentType',
                is: [
                    SEASON.apiName,
                    EPISODE.apiName,
                ]
            }
        ],
        visibleWhen: [
            {
                field: 'contentType',
                is: [
                    SEASON.apiName,
                    EPISODE.apiName,
                    EVENT.apiName,
                    SPORTS.apiName,
                ]
            }
        ],
        validWhen: {
            fallsWithinNumericalRange: {
                max: NEW_TITLE_MAX_NUMBER_OF_SEASONS,
                message: `Season number can't be higher than ${NEW_TITLE_MAX_NUMBER_OF_SEASONS}`
            },
            matchesRegEx: {
                pattern: '^[0-9]+$',
                message: 'Only numbers are allowed'
            },
        },
    },
    {
        name: 'episodeNumber',
        id: 'titleEpisodeNumber',
        label: 'Episode',
        type: 'text',
        placeholder: 'Enter Episode Number',
        shouldFitContainer: true,
        omitWhenHidden: true,
        requiredWhen: [
            {
                field: 'contentType',
                is: [
                    EPISODE.apiName,
                ]
            }
        ],
        visibleWhen: [
            {
                field: 'contentType',
                is: [
                    EPISODE.apiName,
                    EVENT.apiName,
                    SPORTS.apiName,
                ]
            }
        ],
        validWhen: {
            fallsWithinNumericalRange: {
                max: NEW_TITLE_MAX_NUMBER_OF_EPISODES,
                message: `Episode number can't be higher than ${NEW_TITLE_MAX_NUMBER_OF_EPISODES}`
            },
            matchesRegEx: {
                pattern: '^[0-9]+$',
                message: 'Only numbers are allowed'
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
        requiredWhen: [
            {
                field: 'contentType',
                isNot: [
                    SERIES.apiName,
                ]
            }
        ],
        visibleWhen: [
            {
                field: 'contentType',
                isNot: [
                    SEASON.apiName,
                ]
            }
        ],
        validWhen: {
            fallsWithinNumericalRange: {
                max: NEW_TITLE_MAX_RELEASE_YEAR,
                message: `Release Year can't be past year ${NEW_TITLE_MAX_RELEASE_YEAR}`
            },
            matchesRegEx: {
                pattern: '^[0-9]+$',
                message: 'Only numbers are allowed'
            },
        },
    },
];
export default {
    NEW_TITLE_TOAST_SUCCESS_MESSAGE,
    NEW_TITLE_FORM_SCHEMA,
    NEW_TITLE_MODAL_TITLE,
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
    NEW_TITLE_ERROR_ALREADY_EXISTS,
    NEW_TITLE_ERROR_EMPTY_FIELDS,
};