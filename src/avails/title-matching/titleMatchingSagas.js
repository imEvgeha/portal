import {call, put, all, takeEvery} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import * as actionTypes from './titleMatchingActionTypes';
import {rightsService} from '../../containers/avail/service/RightsService';
import { createColumnDefs } from '../utils';
import mappings from '../../../profile/titleMatchingMappings';
import {METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH} from '../../constants/action-types';
import Constants from './titleMatchingConstants';
import {getDomainName, URL} from '../../util/Common';
import {titleService} from '../../containers/metadata/service/TitleService';
import {ADD_TOAST} from '../../ui-elements/nexus-toast-notification/actionTypes';
import {
    ERROR_ICON,
    ERROR_TITLE,
    SUCCESS_ICON,
    TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
    SUCCESS_TITLE, TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE
} from '../../ui-elements/nexus-toast-notification/constants';

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
        const { title, releaseYear, contentType } = focusedRight;
        const {searchParameters: {TITLE, RELEASE_YEAR, CONTENT_TYPE}} = Constants;
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
            payload: {
                [TITLE]: title,
                [RELEASE_YEAR]: releaseYear,
                [CONTENT_TYPE]: contentType.toString().toUpperCase()
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
    const {matchList, duplicateList, rightId} = payload;
    try{
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
        if(!URL.isEmbedded()) {
            const updatedRight = {coreTitleId: response.data.id};
            yield call(rightsService.update, updatedRight, rightId);
        }
        const url = `${getDomainName()}/metadata/detail/${response.data.id}`;
        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE,
                actions: [{content:'View title', onClick: () => window.open(url, '_blank')}],
            }
        });
        yield put({
            type: actionTypes.STORE_COMBINED_TITLE,
            payload: response.data,
        });
        yield put({
            type: actionTypes.STORE_TITLES,
            payload: Object.values(matchList),
        });
        yield put(push(URL.keepEmbedded(`${location.pathname}/review?${mergeIds}&combinedTitle=${response.data.id}`)));
    } catch (e) {
        yield put({
            type: ADD_TOAST,
            payload: {
                title: ERROR_TITLE,
                icon: ERROR_ICON,
                isAutoDismiss: true,
                description: TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
            }
        });
    }
}

export function* titleMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_FOCUSED_RIGHT, fetchFocusedRight, rightsService.get),
        takeEvery(actionTypes.CREATE_COLUMN_DEFS, createTitleMatchingColumnDefs),
        takeEvery(actionTypes.MERGE_TITLES, mergeAndStoreTitles)
    ]);
}
