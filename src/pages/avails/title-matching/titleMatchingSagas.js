import {call, put, all, takeEvery, select, fork} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {isEmpty} from 'lodash';
import * as actionTypes from './titleMatchingActionTypes';
import {createColumnDefs} from '../utils';
import mappings from '../../../../profile/titleMatchingMappings';
import Constants from './titleMatchingConstants';
import {URL} from '../../../util/Common';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA, METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH} from '../../legacy/constants/action-types';
import {createAvailSelectValuesSelector} from '../../legacy/containers/avail/availSelectors';
import {fetchAndStoreSelectItems} from '../../legacy/containers/avail/availSagas';
import {ADD_TOAST} from '../../../ui/toast/toastActionTypes';
import {
    TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
    TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE,
} from '../../../ui/toast/constants';
import {
    ERROR_ICON,
    ERROR_TITLE,
    SUCCESS_ICON,
    SUCCESS_TITLE,
} from '../../../ui/elements/nexus-toast-notification/constants';

function* fetchFocusedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_REQUEST,
            payload: {},
        });

        const focusedRight = yield call(requestMethod, payload);

        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            payload: focusedRight,
        });
        const {title, releaseYear, contentType} = focusedRight;
        const {searchParameters: {TITLE, RELEASE_YEAR, CONTENT_TYPE}} = Constants;
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
            payload: {
                [TITLE]: title,
                [RELEASE_YEAR]: releaseYear,
                [CONTENT_TYPE]: contentType.toString().toUpperCase(),
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

function* createTitleMatchingColumnDefs() {
    const selectItems = yield select(createAvailSelectValuesSelector());
    try {
        if (isEmpty(selectItems)) {
            yield fork(fetchAndStoreSelectItems, mappings);
        }
        const columnDefs = yield call(createColumnDefs, mappings);
        yield put({
            type: actionTypes.STORE_COLUMN_DEFS,
            payload: columnDefs,
        });
    } catch (error) {
        throw new Error();
    }
}

function* mergeAndStoreTitles({payload}) {
    const {matchList, duplicateList, rightId} = payload;
    try {
        let query = '';
        const matches = Object.keys(matchList);
        if (matches.length) {
            query = query.concat('idsToMerge=');
            matches.forEach((key, index) => {
                query = `${query}${matchList[key].id}`;
                if (index < (matches.length - 1)) {
                    query = query.concat(',');
                }
            });
        }
        const mergeIds = query;
        query = query.concat(`&idsToHide=${Object.keys(duplicateList).join(',')}`);

        const response = yield call(titleService.mergeTitles, query) || {data: {}};
        if (!URL.isEmbedded()) {
            const updatedRight = {coreTitleId: response.id};
            yield call(rightsService.update, updatedRight, rightId);
        }
        const url = `/metadata/detail/${response.id}`;
        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE,
                actions: [{content: 'View title', onClick: () => window.open(url, '_blank')}],
            },
        });
        yield put({
            type: actionTypes.STORE_COMBINED_TITLE,
            payload: response,
        });
        yield put({
            type: actionTypes.STORE_TITLES,
            payload: Object.values(matchList),
        });
        // eslint-disable-next-line no-restricted-globals
        yield put(push(URL.keepEmbedded(`${location.pathname}/review?${mergeIds}&combinedTitle=${response.id}`)));
    } catch (e) {
        yield put({
            type: ADD_TOAST,
            payload: {
                title: ERROR_TITLE,
                icon: ERROR_ICON,
                isAutoDismiss: true,
                description: TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
            },
        });
    }
}

export function* titleMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_FOCUSED_RIGHT, fetchFocusedRight, rightsService.get),
        takeEvery(actionTypes.CREATE_COLUMN_DEFS, createTitleMatchingColumnDefs),
        takeEvery(actionTypes.MERGE_TITLES, mergeAndStoreTitles),
    ]);
}
