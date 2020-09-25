import {INCORRECT_LENGTH} from '../constants';

export function length4(value) {
    const length = 4;
    if (value && value.length !== length) {
        return INCORRECT_LENGTH;
    }
    return undefined;
}
