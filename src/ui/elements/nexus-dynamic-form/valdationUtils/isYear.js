import {INCORRECT_YEAR} from '../constants';

export function isYear(value) {
    const yearPattern = /^[1-9]\d\d\d$/;
    if (value && !yearPattern.test(value)) {
        return INCORRECT_YEAR;
    }
    return undefined;
}
