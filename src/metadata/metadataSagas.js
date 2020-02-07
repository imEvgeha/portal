import {call, put, all, select, fork, take, takeEvery} from 'redux-saga/effects';
import {titleService} from '../containers/metadata/service/TitleService';
import * as actionTypes from './metadataActionTypes';
import * as selectors from './metadataSelectors';
import get from 'lodash.get';
import {ADD_TOAST} from '../ui-elements/nexus-toast-notification/actionTypes';
import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
} from '../ui-elements/nexus-toast-notification/constants';
import {push} from 'connected-react-router';
import {URL} from '../util/Common';

export function* fetchTitle(action) {
    const {payload} = action || {};
    const requestMethod = titleService.getTitleById;
    try {
        yield put({
            type: actionTypes.FETCH_TITLE_REQUEST,
            payload: {}
        });
        const response = yield call(requestMethod, payload.id);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_TITLE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_TITLE_ERROR,
            payload: null,
            error,
        });
    }
}

export function* fetchAndStoreTitle(action) {
    const titleId = yield select(selectors.getTitleId);
    const {id} = action.payload || {};
    if (id && id === titleId) {
        return;
    }

    yield fork(fetchTitle, action);

    while (true) {
        const {type, payload} = yield take([
            actionTypes.FETCH_TITLE_SUCCESS,
            actionTypes.FETCH_TITLE_ERROR,
        ]);

        if (type === actionTypes.FETCH_TITLE_SUCCESS) {
            yield put({
                type: actionTypes.STORE_TITLE,
                payload: {[payload.id]: payload},
            });

            break;
        }
    }
}

export function* reconcileTitles({payload}) {
        const {matchList, duplicateList} = payload;
        try {
            const masterIds = [];
            const masters = {};
            Object.keys(matchList).map(key => {
                const id = matchList[key].id;
                masterIds.push(id);
                masters[id] = matchList[key];
            });
            const duplicateIds = Object.keys(duplicateList);
            let query = `idsToMerge=${masterIds.join(',')}&idsToHide=${duplicateIds.join(',')}`;
            const response = yield call(titleService.mergeTitles, query);
            const newTitleId = get(response, 'data.id', '');
            yield put({
                type: actionTypes.TITLES_RECONCILE_SUCCESS,
                payload: {
                    ...masters,
                    ...duplicateList,
                    [newTitleId]: response.data
                },
            });
            const mLength = masterIds.length;
            const dLength = duplicateIds.length;
            yield put({
                type: ADD_TOAST,
                payload: {
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                    description: `You have successfully ${mLength ? 'created a new Nexus title' : ''}
                    ${mLength && dLength && ' and ' || ''}${dLength ? `marked ${dLength} titles as duplicates.` : ''}`,
                }
            });
            query = `duplicateIds=${duplicateIds.join(',')}&masterIds=${masterIds.join(',')}&mergedId=${newTitleId}`;
            yield put(push(URL.keepEmbedded(`${location.pathname}/review?${query}`)));
        } catch (e) {
            //error handling
        }
}

export function* metadataWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AND_STORE_TITLE, fetchAndStoreTitle),
        takeEvery(actionTypes.TITLES_RECONCILE, reconcileTitles)
    ]);
}

