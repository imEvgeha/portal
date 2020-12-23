import {INCORRECT_INTEGER} from '../constants';

export function isInteger(value) {
    const integerPattern = /^\d+$/;
    if (value && !integerPattern.test(value)) {
        return INCORRECT_INTEGER;
    }
    return undefined;
}
