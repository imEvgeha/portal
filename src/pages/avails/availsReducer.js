import {combineReducers} from 'redux';
import ingestReducer from './ingest-panel/ingestReducer';
import rightsReducer from './rights-repository/rightsReducer';
import rightMatchingReducer from './right-matching/rightMatchingReducer';
import titleMatchingReducer from './title-matching/titleMatchingReducer';
import rightHistoryReducer from './right-history-view/rightHistoryReducer';

const availsReducer = combineReducers({
    ingest: ingestReducer,
    rights: rightsReducer,
    rightHistory: rightHistoryReducer,
    rightMatching: rightMatchingReducer,
    titleMatching: titleMatchingReducer,
});

export default availsReducer;

