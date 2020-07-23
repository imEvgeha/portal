import {combineReducers} from 'redux';
import ingestReducer from './ingest-panel/ingestReducer';
import rightHistoryReducer from './right-history-view/rightHistoryReducer';
import rightMatchingReducer from './right-matching/rightMatchingReducer';
import rightsReducer from './rights-repository/rightsReducer';
import titleMatchingReducer from './title-matching/titleMatchingReducer';

const availsReducer = combineReducers({
    ingest: ingestReducer,
    rights: rightsReducer,
    rightHistory: rightHistoryReducer,
    rightMatching: rightMatchingReducer,
    titleMatching: titleMatchingReducer,
});

export default availsReducer;

