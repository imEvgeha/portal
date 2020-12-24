import {get} from 'lodash';
import {INCORRECT_VALUE} from '../constants';

export function incorrectValue(value, params) {
    const l = get(params, 'value');
    if (l && value && value === l) {
        return INCORRECT_VALUE;
    }
    return undefined;
}
