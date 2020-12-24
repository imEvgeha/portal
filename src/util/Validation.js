import {getDateFormatBasedOnLocale} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import moment from 'moment';

const datePattern = new RegExp('[0-9]{2}[\\/][0-9]{2}[\\/][0-9]{4}');

const DATE_FORMAT_LENGTH = 'YYYY-MM-DD'.length;

function validateDate(date, locale = 'en') {
    const dateFormat = getDateFormatBasedOnLocale(locale);
    return (
        date &&
        `${date}`.length === DATE_FORMAT_LENGTH &&
        datePattern.test(`${date}`) &&
        moment(date, dateFormat).isValid()
    );
}

function rangeValidation(name, displayName, date, avail) {
    let startDate = '';
    let endDate = '';
    let rangeError = '';

    if (name === 'createdAt' && avail['updatedAt']) {
        startDate = date;
        endDate = avail['updatedAt'];
        rangeError = `${displayName} must be before Updated At date`;
    } else if (name === 'updatedAt' && avail['createdAt']) {
        startDate = avail['createdAt'];
        endDate = date;
        rangeError = `${displayName} must be after Created At date`;
    }

    if (name === 'originallyReceivedAt' && avail['lastUpdateReceivedAt']) {
        startDate = date;
        endDate = avail['lastUpdateReceivedAt'];
        rangeError = `${displayName} must be before Last Update Received At date`;
    } else if (name === 'lastUpdateReceivedAt' && avail['originallyReceivedAt']) {
        startDate = avail['originallyReceivedAt'];
        endDate = date;
        rangeError = `${displayName} must be after Originally Received At date`;
    }

    if (name === 'start' && avail['end']) {
        startDate = date;
        endDate = avail['end'];
        rangeError = `${displayName} must be before corresponding end date`;
    } else if (name === 'end' && avail['start']) {
        startDate = avail['start'];
        endDate = date;
        rangeError = `${displayName} must be after corresponding start date`;
    }

    if (name.endsWith('Start') && avail[name.replace('Start', 'End')]) {
        startDate = date;
        endDate = avail[name.replace('Start', 'End')];
        rangeError = `${displayName} must be before corresponding end date`;
    } else if (name.endsWith('End') && avail[name.replace('End', 'Start')]) {
        startDate = avail[name.replace('End', 'Start')];
        endDate = date;
        rangeError = `${displayName} must be after corresponding start date`;
    }
    if (startDate && endDate && moment(endDate) < moment(startDate)) {
        return rangeError;
    }
}

// eslint-disable-next-line max-params
function oneOfValidation(name, displayName, date, pair, displayNamePair, avail) {
    if (!date && !avail[pair]) {
        return `${displayName} or ${displayNamePair} needs to have a value`;
    }
}

export {validateDate, rangeValidation, oneOfValidation};
