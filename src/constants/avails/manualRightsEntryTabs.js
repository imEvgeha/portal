export const TOTAL_RIGHTS = 'TOTAL_RIGHTS';
export const SUCCESS ='SUCCESS';
export const PENDING = 'PENDING';
export const ERRORS = 'ERRORS';
export const FATAL = 'FATAL';

export const tabFilter = new Map([
    [SUCCESS, {status: 'Ready,ReadyNew'}],
    [PENDING, {status: 'Pending'}],
    [ERRORS, {status: 'Error'}],
]);