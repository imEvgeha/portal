import {get} from 'lodash';
import {INCORRECT_LENGTH} from '../constants';

export function lengthEqual(value, params) {
    const l = get(params, 'length');
    if (l && value && value.length !== l) {
        return INCORRECT_LENGTH;
    }
    return undefined;
}
