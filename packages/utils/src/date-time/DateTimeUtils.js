import {get} from 'lodash';
import moment from 'moment';
import {
    RELATIVE_TIME_FORMAT,
    SIMULCAST_TIME_FORMAT,
    TIMESTAMP_TIME_FORMAT,
    LOCALE_TIME_FORMAT,
    DATETIME_FIELDS,
    SORT_DIRECTION,
} from './constants';

const localStorageLanguage = localStorage.getItem('localization');
const browserLocale = navigator.language.toString().toLowerCase();
const allowedLocale = ['en-us', 'en-gb'];

const locale =
    localStorageLanguage && localStorageLanguage !== ''
        ? localStorageLanguage
        : allowedLocale.includes(browserLocale)
        ? browserLocale
        : allowedLocale[0];

// Create date format based on locale
const getDateFormatBasedOnLocale = locale => moment().locale(locale).localeData().longDateFormat('L');

// Attach (UTC) to date, if it is simulcast
const parseSimulcast = (date = null, dateFormat, isTimeVisible = true) => {
    const isUTC = isUtc(date);
    return moment(date).isValid()
        ? `${moment(date).utc(!isUTC).format(dateFormat)}${isUTC && isTimeVisible ? ' (UTC)' : ''}`
        : 'Invalid Date';
};

// Check if a provided date ends with 'Z' which would mean it is UTC date
// https://en.wikipedia.org/wiki/ISO_8601#Coordinated_Universal_Time_(UTC)
const isUtc = (date = '') => typeof date === 'string' && date.endsWith('Z');

/**
 * Returns a date-time string for the given timestamp and format.
 * @param {string} date the timestamp to render
 * @param {string} type a `DATETIME_FIELDS` enum value from `src/util/date-time/constants`
 * @param {boolean} [isLocal=false] set `true` if you want to return the local datetime for the given date, default false
 * @param {boolean} [shouldDisplayTime=true] set `false` if you don't want to display the time, default true
 */
// eslint-disable-next-line max-params
const ISODateToView = (date, type, isLocal = false, shouldDisplayTime = true) => {
    if (date) {
        const dateFormat = getDateFormatBasedOnLocale(locale);
        const momentDate = moment(date);

        let dateTimeFormat = null;
        let isUtcTime = null;

        const appendDateTimeFormats = (dateFormat, timeFormat) => {
            return `${dateFormat} ${shouldDisplayTime ? timeFormat : ''}`.trim();
        };

        switch (type) {
            case DATETIME_FIELDS.TIMESTAMP: {
                dateTimeFormat = appendDateTimeFormats(dateFormat, TIMESTAMP_TIME_FORMAT);
                isUtcTime = false;
                break;
            }

            case DATETIME_FIELDS.BUSINESS_DATETIME: {
                const isUtcDate = isUtc(date);
                const timeFormat = isUtcDate ? SIMULCAST_TIME_FORMAT : RELATIVE_TIME_FORMAT;

                dateTimeFormat = appendDateTimeFormats(dateFormat, timeFormat);
                isUtcTime = !isUtcDate;
                break;
            }

            case DATETIME_FIELDS.REGIONAL_MIDNIGHT: {
                dateTimeFormat = dateFormat;
                isUtcTime = true;
                break;
            }

            default:
                return '';
        }

        if (isLocal) {
            return momentDate.utc(isUtcTime).local().format(appendDateTimeFormats(dateFormat, LOCALE_TIME_FORMAT));
        }
        return momentDate.utc(isUtcTime).format(dateTimeFormat);
    }
    return '';
};

const dateToISO = (date, type) => {
    // format date without utc to show local time
    const localDate = moment(date).utc().toISOString();
    switch (type) {
        case DATETIME_FIELDS.TIMESTAMP:
            return moment(localDate).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        case DATETIME_FIELDS.SIMULCAST:
            return moment(localDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        case DATETIME_FIELDS.REGIONAL:
            return moment(localDate).format('YYYY-MM-DD[T]HH:mm:ss');
        case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
            return moment(localDate).format('YYYY-MM-DD');
        default:
            return moment(localDate).format('MM/DD/YYYY');
    }
};

/**
 * Sorts the given array of objects by date.
 *
 * @param {any[]} array an array of objects to sort
 * @param {string|string[]} pathToDate the node path to traverse to get to the date in each element in the array
 * @param {('ASCENDING'|'DESCENDING')} direction the sort direction. Default is 'ASCENDING'.
 *   Use SORT_DIRECTION in util/date-time/constants
 */
const sortByDateFn = (array, pathToDate, direction = SORT_DIRECTION.ASCENDING) => {
    const getMomentObjFromDate = (obj, pathToDate) => {
        return moment(get(obj, pathToDate));
    };
    const sortFn = (prevObj, currObj) => {
        const prevDueDate = getMomentObjFromDate(prevObj, pathToDate);
        const currDueDate = getMomentObjFromDate(currObj, pathToDate);
        const diff = prevDueDate.diff(currDueDate);

        switch (direction) {
            case SORT_DIRECTION.ASCENDING:
                return diff;
            case SORT_DIRECTION.DESCENDING:
                return -diff;
            default:
                break;
        }
    };
    return array.slice().sort(sortFn);
};

export {getDateFormatBasedOnLocale, parseSimulcast, ISODateToView, dateToISO, isUtc, sortByDateFn};
