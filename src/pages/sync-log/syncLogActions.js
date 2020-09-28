import {SAVE_DATE_FROM, SAVE_DATE_TO} from './syncLogActionTypes';

export const createSaveDateFromAction = payload => ({
    type: SAVE_DATE_FROM,
    payload,
});

export const createSaveDateToAction = payload => ({
    type: SAVE_DATE_TO,
    payload,
});
