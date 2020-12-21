import {INCORRECT_TIME} from '../constants';

export function isTime(value) {
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
    if (value && !timePattern.test(value)) {
        return INCORRECT_TIME;
    }
    return undefined;
}
