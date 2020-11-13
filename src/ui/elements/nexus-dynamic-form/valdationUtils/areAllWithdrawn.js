import {
    NOT_ALL_WITHDRAWN_ALLOWED_VALUES,
    ALL_WITHDRAWN_ALLOWED_VALUES,
    ALL_WITHDRAWN_ERROR,
    NOT_ALL_WITHDRAWN_ERROR,
} from '../constants';

export function areAllWithdrawn(value, areAllWithdrawn) {
    const val = value && typeof value === 'object' && !Array.isArray(value) ? value.value : value;
    if (areAllWithdrawn) {
        if (!ALL_WITHDRAWN_ALLOWED_VALUES.includes(val)) return ALL_WITHDRAWN_ERROR;
        return undefined;
    }
    if (!NOT_ALL_WITHDRAWN_ALLOWED_VALUES.includes(val)) return NOT_ALL_WITHDRAWN_ERROR;
    return undefined;
}
