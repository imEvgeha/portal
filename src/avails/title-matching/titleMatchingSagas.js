import {call, put, all, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './titleMatchingActionTypes';
import {rightsService} from '../../containers/avail/service/RightsService';
import { createColumnDefs } from '../utils';
import mappings from './titleMatchingMappings';
import {METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA} from '../../constants/action-types';
import Constants from './titleMatchingConstants';

export function* fetchFocusedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_REQUEST,
            payload: {}
        });

        const response = yield call(requestMethod, payload);
        const focusedRight = response.data;

        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            payload: focusedRight,
        });
        const { title, releaseYear, contentType } = focusedRight;
        const {searchParameters: { TITLE, CONTENT_TYPE, RELEASE_YEAR}} = Constants;
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
            payload: {
                [TITLE]: title,
                [RELEASE_YEAR]: releaseYear,
                [CONTENT_TYPE]: contentType
            },
        });

    } catch (error) {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* createTitleMatchingColumnDefs(){
    try{
        const columnDefs = yield call(createColumnDefs, mappings);
        yield put({
            type: actionTypes.STORE_COLUMN_DEFS,
            payload: columnDefs,
        });
    } catch (error) {
        throw new Error();
    }
}

export function* titleMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_FOCUSED_RIGHT, fetchFocusedRight, rightsService.get),
        takeEvery(actionTypes.CREATE_COLUMN_DEFS, createTitleMatchingColumnDefs)
    ]);
}
