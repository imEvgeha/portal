import {combineReducers} from 'redux';
import assetManagementReducer from './asset-management/assetManagementReducer';

const manualTasksReducer = combineReducers({
    assets: assetManagementReducer,
});

export default manualTasksReducer;
