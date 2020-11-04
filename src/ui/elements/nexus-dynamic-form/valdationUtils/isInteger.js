import {INCORRECT_VALUE} from '../constants';

export function isInteger(value) {
    const integerPattern = /^\d+$/;
    if (value && !integerPattern.test(value)) {
        return INCORRECT_VALUE;
    }
    return undefined;
}
