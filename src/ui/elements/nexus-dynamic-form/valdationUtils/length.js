import {INCORRECT_LENGTH} from '../constants';

export function length(value) {
    const l = 4;
    if (value && value.length !== l) {
        return INCORRECT_LENGTH;
    }
    return undefined;
}
