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

/*
DETAILS ABOUT THIS COMPLEX REGEX:
windowDuration field has a tooltip:
"format: PnYnMnDTnHnMnS. eg. P3Y6M4DT12H30M5S
(three years, six months, four days, twelve hours, thirty minutes, and five seconds)"

Some VALID values are: pt20H, p1Yt6s, p, p06Mt05M, ...
Some INVALID values are: PT, P45d, PT26h, ...
*/
