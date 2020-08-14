import {get} from 'lodash';
import moment from 'moment';
import {store} from '../../index';
import {
    RELATIVE_TIME_FORMAT,
    SIMULCAST_TIME_FORMAT,
    TIMESTAMP_TIME_FORMAT,
} from '../../ui/elements/nexus-date-and-time-elements/constants';
import {DATETIME_FIELDS, SORT_DIRECTION} from './constants';

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

const ISODateToView = (date, type) => {
    if (date) {
        const {locale} = store.getState().locale;
        const dateFormat = getDateFormatBasedOnLocale(locale);
        switch (type) {
            case DATETIME_FIELDS.TIMESTAMP: {
                const timestampFormat = `${dateFormat} ${TIMESTAMP_TIME_FORMAT}`;
                return `${moment(date).utc(false).format(timestampFormat)}`;
            }
            case DATETIME_FIELDS.BUSINESS_DATETIME: {
                const isUtcDate = isUtc(date);

                const timeFormat = isUtcDate ? SIMULCAST_TIME_FORMAT : RELATIVE_TIME_FORMAT;
                const dateTimeFormat = `${dateFormat} ${timeFormat}`;

                return `${moment(date).utc(!isUtcDate).format(dateTimeFormat)}`;
            }
            case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                return `${moment(date).utc(true).format(dateFormat)}`;
            default:
                return '';
        }
    }
    return '';
};

const dateToISO = (date, type) => {
    switch (type) {
        case DATETIME_FIELDS.TIMESTAMP:
            return moment(date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        case DATETIME_FIELDS.SIMULCAST:
            return moment(date).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        case DATETIME_FIELDS.REGIONAL:
            return moment(date).format('YYYY-MM-DD[T]HH:mm:ss');
        case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
            return moment(date).format('YYYY-MM-DD');
        default:
            return null;
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
