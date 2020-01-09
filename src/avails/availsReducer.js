import {combineReducers} from 'redux';
import ingestReducer from './ingest-panel/ingestReducer';
import rightsReducer from './rights-repository/rightsReducer';

const availsReducer = combineReducers({
    ingest: ingestReducer,
    rights: rightsReducer,
});

export default availsReducer;

