import {
    UPLOAD_INGEST,
    SAVE_COMBINED_RIGHT,
    REPLAY_EVENT,
    REPLICATE_EVENT,
    TITLES_RECONCILE,
    SAVE_FULFILLMENT_ORDER,
} from './loadingActionTypes';

const WHITELIST = [
    TITLES_RECONCILE,
    SAVE_COMBINED_RIGHT,
    UPLOAD_INGEST,
    REPLAY_EVENT,
    REPLICATE_EVENT,
    SAVE_FULFILLMENT_ORDER,
];
const ACTION_STATES = ['REQUEST', 'SUCCESS', 'FAILURE', 'ERROR'];

const loadingReducer = (state = {}, action) => {
    const {type} = action;
    const regex = new RegExp(`_(${ACTION_STATES.join('|')})`);
    const whiteListPrefixes = WHITELIST.filter(Boolean).map(item => item.replace(regex, ''));
    const actionPrefixes = whiteListPrefixes.join('|');

    const matches = new RegExp(`(${actionPrefixes})_(${ACTION_STATES.join('|')})`).exec(type);

    if (!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;

    return {
        ...state,
        [requestName]: requestState === 'REQUEST',
    };
};

export default loadingReducer;
