import moment from 'moment';
import {store} from '../index';
import {
    RELATIVE_TIME_FORMAT, SIMULCAST_TIME_FORMAT,
    TIMESTAMP_TIME_FORMAT
} from '../ui/elements/nexus-date-and-time-elements/constants';

const DATETIME_FIELDS = {
    TIMESTAMP: 'timestamp',
    BUSINESS_DATETIME: 'businessDateTime',
    SIMULCAST: 'simulcast',
    REGIONAL: 'regional',
    REGIONAL_MIDNIGHT: 'regionalMidnight'
};

// Create date format based on locale
const getDateFormatBasedOnLocale = (locale) => (moment().locale(locale).localeData().longDateFormat('L'));

// Attach (UTC) to date, if it is simulcast
const parseSimulcast = (date = null, dateFormat, isTimeVisible = true) => {
    const isUTC = isUtc(date);
    return moment(date).isValid()
        ? `${moment(date).utc(!isUTC).format(dateFormat)}${(isUTC && isTimeVisible) ? ' (UTC)' : ''}`
        : 'Invalid Date';
};

// Check if a provided date ends with 'Z' which would mean it is UTC date
// https://en.wikipedia.org/wiki/ISO_8601#Coordinated_Universal_Time_(UTC)
const isUtc = (date = '') => typeof date === 'string' && date.endsWith('Z');

const ISODateToView = (date, type) => {
    if(date) {
        const {locale} = store.getState().locale;
        const dateFormat = getDateFormatBasedOnLocale(locale);
        switch (type) {
            case DATETIME_FIELDS.TIMESTAMP:
                const timestampFormat = `${dateFormat} ${TIMESTAMP_TIME_FORMAT}`;
                return `${moment(date).utc(false).format(timestampFormat)}`;
            case DATETIME_FIELDS.BUSINESS_DATETIME:
                const isUtcDate = isUtc(date);

                const timeFormat = isUtcDate ? SIMULCAST_TIME_FORMAT : RELATIVE_TIME_FORMAT;
                const dateTimeFormat = `${dateFormat} ${timeFormat}`;

                return `${moment(date).utc(!isUtcDate).format(dateTimeFormat)}`;
            case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                return `${moment(date).utc(true).format(dateFormat)}`;
        }
    }
    return  '';
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

export {
    DATETIME_FIELDS,
    getDateFormatBasedOnLocale,
    parseSimulcast,
    ISODateToView,
    dateToISO,
    isUtc,
};