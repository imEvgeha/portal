import {TITLES_RECONCILE} from '../../metadata/metadataActionTypes';

const WHITE_LIST = [TITLES_RECONCILE];
const ACTION_STATES = ['REQUEST', 'SUCCESS', 'FAILURE', 'ERROR'];

const loadingReducer = (state = {}, action) => {
    const {type, payload} = action;
    const regex = new RegExp(`_(${ACTION_STATES.join('|')})`);
    const whiteListPrefixes = WHITE_LIST.map(item => item.replace(regex, ''));
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
