export const TOTAL_RIGHTS = 'TOTAL_RIGHTS';
export const CREATED = 'CREATED';
export const UPDATED = 'UPDATED';
export const PENDING = 'PENDING';
export const ERRORS = 'ERRORS';
export const FATAL = 'FATAL';

export const tabFilter = new Map([
    [CREATED, {status: 'Ready'}],
    [UPDATED, {status: 'ReadyNew'}],
    [PENDING, {status: 'Pending'}],
    [ERRORS, {status: 'Error'}],
]);