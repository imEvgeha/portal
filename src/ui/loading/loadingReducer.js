import {REPLAY_EVENT} from '../../pages/event-management/eventManagementActionTypes';
import {TITLES_RECONCILE} from '../../pages/metadata/metadataActionTypes';
import {SAVE_COMBINED_RIGHT} from '../../pages/avails/right-matching/rightMatchingActionTypes';
import {UPLOAD_INGEST} from '../../pages/avails/ingest-panel/ingestActionTypes';

const WHITELIST = [TITLES_RECONCILE, SAVE_COMBINED_RIGHT, UPLOAD_INGEST, REPLAY_EVENT];
const ACTION_STATES = ['REQUEST', 'SUCCESS', 'FAILURE', 'ERROR'];

const loadingReducer = (state = {}, action) => {
    const {type, payload} = action;
    const regex = new RegExp(`_(${ACTION_STATES.join('|')})`);
    const whiteListPrefixes = WHITELIST.filter(Boolean).map(item => item.replace(regex, ''));
    const actionPrefixes = whiteListPrefixes.join('|');

    const matches = new RegExp(`(${actionPrefixes})_(${ACTION_STATES.join('|')})`).exec(type);
    if (!matches) {
        return state;
    };
    const [, requestName, requestState] = matches;

    return {
        ...state,
        [requestName]: requestState === 'REQUEST',
    };
};

export default loadingReducer;
