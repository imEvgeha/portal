import {TITLES_RECONCILE} from '../../metadata/metadataActionTypes';
import {SAVE_COMBINED_RIGHT} from '../../avails/right-matching/rightMatchingActionTypes';
import {UPLOAD_INGEST} from '../../avails/ingest-panel/ingestActionTypes';

const WHITELIST = [TITLES_RECONCILE, SAVE_COMBINED_RIGHT, UPLOAD_INGEST];
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
