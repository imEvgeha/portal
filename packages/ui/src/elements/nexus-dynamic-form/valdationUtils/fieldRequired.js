import {FIELD_REQUIRED} from '../constants';

export function fieldRequired(value) {
    if (!value) {
        return FIELD_REQUIRED;
    }
    return undefined;
}
