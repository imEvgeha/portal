import moment from 'moment';
import {store} from '../index';
import {TIME_FORMAT, TIMESTAMP_FORMAT} from '../ui/elements/nexus-date-and-time-elements/constants';

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
    const isUTC = date && date.endsWith('Z');
    return moment(date).isValid()
        ? `${moment(date).utc(!isUTC).format(dateFormat)}${isUTC && isTimeVisible ? ' (UTC)' : ''}`
        : 'Invalid Date';
};

const ISODateToView = (date, type) => {
    if(date) {
        const {locale} = store.getState().locale;
        const dateFormat = getDateFormatBasedOnLocale(locale);
        switch (type) {
            case DATETIME_FIELDS.TIMESTAMP:
                return `${moment(date).format(dateFormat)} ${moment(date).format(TIMESTAMP_FORMAT)}`;
            case DATETIME_FIELDS.BUSINESS_DATETIME:
                return `${moment(date).format(dateFormat)} ${moment(date).format(TIME_FORMAT)}`;
            case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                return `${moment(date).format(dateFormat)}`;
        }
    }
    return  '';
}

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
}

export {
    DATETIME_FIELDS,
    getDateFormatBasedOnLocale,
    parseSimulcast,
    ISODateToView,
    dateToISO
}