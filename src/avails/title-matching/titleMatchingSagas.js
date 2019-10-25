import {call, put, all, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './titleMatchingActionTypes';
import {rightsService} from '../../containers/avail/service/RightsService';
import { createColumnDefs } from '../utils';
import mappings from '../../../profile/titleMatchingMappings';
import {METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH} from '../../constants/action-types';
import Constants from './titleMatchingConstants';
import {URL} from '../../util/Common';
import {titleService} from '../../containers/metadata/service/TitleService';

function* fetchFocusedRight(requestMethod, {payload}) {
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
        const { title, releaseYear } = focusedRight;
        const {searchParameters: { TITLE, RELEASE_YEAR}} = Constants;
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
            payload: {
                [TITLE]: title,
                [RELEASE_YEAR]: releaseYear,
            },
        });
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
            payload: {
                [TITLE]: title,
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

function* createTitleMatchingColumnDefs(){
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

function* mergeAndStoreTitles({payload}){
    try{
        const {matchList, duplicateList, historyPush} = payload;
        let query = '';
        const matches = Object.keys(matchList);
        if(matches.length){
            query = query.concat('idsToMerge=');
            matches.forEach((key, index) => {
                query = `${query}${matchList[key].id}`;
                if(index < (matches.length -1 )){
                    query = query.concat(',');
                }
            });
        }
        const mergeIds = query;
        query = query.concat(`&idsToHide=${Object.keys(duplicateList).join(',')}`);

        const response = yield call(titleService.mergeTitles, query) || {data: {}};

        yield put({
            type: actionTypes.STORE_COMBINED_TITLE,
            payload: response.data,
        });
        yield put({
            type: actionTypes.STORE_TITLES,
            payload: Object.values(matchList),
        });
        historyPush(URL.keepEmbedded(`${location.pathname}/review?${mergeIds}&combinedTitle=${response.data.id}`));
    } catch (error) {
        //can cover error handling here
    }
}

export function* titleMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_FOCUSED_RIGHT, fetchFocusedRight, rightsService.get),
        takeEvery(actionTypes.CREATE_COLUMN_DEFS, createTitleMatchingColumnDefs),
        takeEvery(actionTypes.MERGE_TITLES, mergeAndStoreTitles)
    ]);
}
