import {uniqBy} from 'lodash';
import {call, put, all, takeLatest} from 'redux-saga/effects';
import DopTasksService from './dopTasks-services';
import {GET_DOP_TASKS_OWNERS, SET_OWNERS_LIST} from './dopTasksActionTypes';

function* fetchOwners({payload}) {
    try {
        const response = yield call(DopTasksService.getOwners, payload.join(','));
        let owners = [];
        response.forEach(d => {
            owners = owners.concat(d.potentialOwner.groupMember);
        });
        yield put({
            type: SET_OWNERS_LIST,
            payload: uniqBy(owners, 'userId'),
        });
    } catch (error) {
        yield put({
            type: SET_OWNERS_LIST,
            payload: [],
        });
    }
}

export default function* dopTasksWatcher() {
    yield all([takeLatest(GET_DOP_TASKS_OWNERS, fetchOwners)]);
}
