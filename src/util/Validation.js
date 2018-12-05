import moment from 'moment';
const datePattern = new RegExp('[0-9]{2}[\\/][0-9]{2}[\\/][0-9]{4}');

function validateDate(date) {
    return date && ('' + date).length === 10 && datePattern.test('' + date) && moment(date).isValid();
}

function rangeValidation(name, displayName, date, avail) {
    let startDate, endDate, rangeError;

    if (name.endsWith('Start') && avail[name.replace('Start', 'End')]) {
        startDate = date;
        endDate = avail[name.replace('Start', 'End')];
        rangeError = displayName + ' must be before corresponding end date';
    } else if (name.endsWith('End') && avail[name.replace('End', 'Start')]) {
        startDate = avail[name.replace('End', 'Start')];
        endDate = date;
        rangeError = displayName + ' must be after corresponding end date';
    }
    if (startDate && endDate && moment(endDate) < moment(startDate)) {
        return rangeError;
    }
}

export {validateDate, rangeValidation};