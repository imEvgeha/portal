import {INCORRECT_DURATION} from '../constants';

const NOT_ALLOWED_LAST_CHARS = ['t', 'T'];

export function isDuration(value) {
    if (NOT_ALLOWED_LAST_CHARS.includes(value.slice(-1))) {
        return INCORRECT_DURATION;
    }
    const durationPattern = /^[pP](\d{1,3}[yY])?((\d|[0]\d|[1][01])[mM])?(([0-2]\d|[3][01])[dD])?([tT](([01]\d|[2][0-3])[hH])?([0-5]\d[mM])?([0-5]\d[sS])?)?$/;
    if (value && !durationPattern.test(value)) {
        return INCORRECT_DURATION;
    }
    return undefined;
}
