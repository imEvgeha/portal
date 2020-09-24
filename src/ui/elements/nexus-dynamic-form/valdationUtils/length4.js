import {INCORRECT_LENGTH} from '../constants';

export function length4(value) {
    if (value && value.length !== 4) {
        return INCORRECT_LENGTH;
    }
    return undefined;
}
