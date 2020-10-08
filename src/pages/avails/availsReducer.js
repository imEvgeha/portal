import {combineReducers} from 'redux';
import ingestReducer from './ingest-panel/ingestReducer';
import rightDetailsOptionsReducer from './right-details/rightDetailsReducer';
import rightMatchingReducer from './right-matching/rightMatchingReducer';
import rightsReducer from './rights-repository/rightsReducer';
import titleMatchingReducer from './title-matching/titleMatchingReducer';

const availsReducer = combineReducers({
    ingest: ingestReducer,
    rights: rightsReducer,
    rightMatching: rightMatchingReducer,
    titleMatching: titleMatchingReducer,
    rightDetailsOptions: rightDetailsOptionsReducer,
});

export default availsReducer;
