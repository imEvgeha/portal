import {INCORRECT_YEAR} from '../constants';

export function isYear(value) {
    const yearPattern = /^[1-9]\d\d\d$/;
    return yearPattern.test(value) ? undefined : INCORRECT_YEAR;
}
