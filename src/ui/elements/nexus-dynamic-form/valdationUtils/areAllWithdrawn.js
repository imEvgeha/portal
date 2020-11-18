const NOT_ALL_WITHDRAWN_ALLOWED_VALUES = ['Pending', 'Confirmed', 'Tentative'];
const ALL_WITHDRAWN_ALLOWED_VALUES = ['Canceled', 'Withdrawn'];
const ALL_WITHDRAWN_ERROR = 'ONLY WITHDRAWN OR CANCELED ARE ALLOWED IF ALL TERRITORIES ARE WITHDRAWN';
const NOT_ALL_WITHDRAWN_ERROR = 'ONLY PENDING, TENTATIVE OR CONFIRMED ARE ALLOWED IF NOT ALL TERRITORIES ARE WITHDRAWN';

export function areAllWithdrawn(value, getCurrentValues) {
    const val = value && typeof value === 'object' && !Array.isArray(value) ? value.value : value;
    const currentValues = getCurrentValues();
    const notWithdrawn = currentValues.territory && currentValues.territory.filter(terr => !terr.dateWithdrawn);
    const areAllWithdrawn = !notWithdrawn.length;
    if (areAllWithdrawn) {
        if (!ALL_WITHDRAWN_ALLOWED_VALUES.includes(val)) return ALL_WITHDRAWN_ERROR;
        return undefined;
    }
    if (!NOT_ALL_WITHDRAWN_ALLOWED_VALUES.includes(val)) return NOT_ALL_WITHDRAWN_ERROR;
    return undefined;
}
