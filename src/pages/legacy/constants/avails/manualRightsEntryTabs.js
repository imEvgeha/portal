export const TOTAL_RIGHTS = 'TOTAL_RIGHTS';
export const SUCCESS = 'SUCCESS';
export const UNMATCHED = 'UNMATCHED';
export const ERRORS = 'ERRORS';
export const ERRORS_UNMATCHED = 'ERRORS_UNMATCHED';
export const FATAL = 'FATAL';
export const VIEW_JSON = 'VIEW_JSON';
export const ATTACHMENTS_TAB = 'ATTACHMENTS_TAB';

export const tabFilter = new Map([
    [SUCCESS, {status: 'Ready,ReadyNew'}],
    [UNMATCHED, {status: 'Pending'}],
    [ERRORS, {status: 'Error'}],
    [ERRORS_UNMATCHED, {status: 'Pending,Error'}],
    [VIEW_JSON],
    [ATTACHMENTS_TAB],
]);
