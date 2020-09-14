import moment from 'moment';
import {getDateFormatBasedOnLocale, isUtc} from '../../../util/date-time/DateTimeUtils';
import {RELATIVE_TIME_FORMAT, SIMULCAST_TIME_FORMAT, TIMESTAMP_TIME_FORMAT} from './constants';

export const getDateFormat = (locale, isTimestamp, isSimulcast) => {
    const timeFormat = isTimestamp ? TIMESTAMP_TIME_FORMAT : isSimulcast ? SIMULCAST_TIME_FORMAT : RELATIVE_TIME_FORMAT;

    // Create date format based on locale
    return getDateFormatBasedOnLocale(locale).toUpperCase().concat(timeFormat);
};

export const getDisplayDate = (date, locale, isTimestamp, isSimulcast) => {
    const dateFormat = getDateFormat(locale, isTimestamp, isSimulcast);
    const format = dateFormat || getDateFormat(locale, isTimestamp, isSimulcast);
    return date ? moment(date).utc(!isUtc(date)).format(format) : '';
};
