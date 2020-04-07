import {call, put, all, select, fork, take, takeEvery} from 'redux-saga/effects';
import {get} from 'lodash';
import {push} from 'connected-react-router';
import {titleService} from '../legacy/containers/metadata/service/TitleService';
import * as actionTypes from './metadataActionTypes';
import * as selectors from './metadataSelectors';
import {normalizeDataForStore} from '../../util/Common';
import {ADD_TOAST} from '../../ui/toast/toastActionTypes';
import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
} from '../../ui/elements/nexus-toast-notification/constants';
import {URL} from '../../util/Common';

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
            error,
        });
    }
}

export function* fetchTitles(action) {
    const {payload} = action || {};
    const requestMethod = titleService.freeTextSearchWithGenres;

    try {
        const {params, page, size} = payload || {};
        yield put({
            type: actionTypes.FETCH_TITLES_REQUEST,
            payload: {}
        });
        const response = yield call(requestMethod, params, page, size);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_TITLES_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_TITLES_ERROR,
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

export function* fetchReconciliationTitles(action) {
    const requestMethod = titleService.bulkGetTitlesWithGenres;

    try {
        yield put({
            type: actionTypes.FETCH_RECONCILIATION_TITLES_REQUEST,
            payload: {}
        });
        const {ids = []} = action.payload || {};
        const body = ids.map(el => {
            return {id: el};
        });
        const response = yield call(requestMethod, body);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_RECONCILIATION_TITLES_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RECONCILIATION_TITLES_ERROR,
            error,
        });
    }
}

export function* getReconciliationTitles(action) {
    const {list, page, size} = yield select(selectors.createTitlesInfoSelector());
    const {ids = []} = action.payload || {};
    const titleIdsToFetch = ids.filter(id => !(Object.keys(list || {}).includes(id))) || [];

    if (!titleIdsToFetch) {
        return;
    };

    const newAction = {
        type: action.type,
        payload: {
            ids: titleIdsToFetch,
        }
    };

    yield fork(fetchReconciliationTitles, newAction);

    while (true) {
        const {type, payload} = yield take([
            actionTypes.FETCH_RECONCILIATION_TITLES_SUCCESS,
            actionTypes.FETCH_RECONCILIATION_TITLES_ERROR,
        ]);

        if (type === actionTypes.FETCH_RECONCILIATION_TITLES_SUCCESS) {
            const {page, size} = yield select(selectors.createTitlesInfoSelector());
            const data = normalizeDataForStore(payload);

            yield put({
                type: actionTypes.STORE_TITLES,
                payload: {
                    data,
                    page,
                    size,
                }
            });

            break;
        }
    }
}

export function* fetchAndStoreTitles(action) {
    const titles = yield select(selectors.getTitles);
    if (titles) {
        return;
    }

    yield fork(fetchTitles, action);

    while (true) {
        const {type, payload} = yield take([
           actionTypes.FETCH_TITLES_SUCCESS,
           actionTypes.FETCH_TITLES_ERROR,
        ]);

        if (type === actionTypes.FETCH_TITLES_SUCCESS) {
            const {page, size, data} = payload || {};

            yield put({
                type: actionTypes.STORE_TITLES,
                payload: {page, size, data: normalizeDataForStore(data)},
            });

            break;
        }
    }
}

export function* reconcileTitles({payload}) {
    const {matchList = {}, duplicateList = {}} = payload || {};
    try {
        const masterIds = [];
        const masters = {};
        Object.keys(matchList || {}).map(key => {
            const id = matchList[key].id;
            masterIds.push(id);
            masters[id] = matchList[key];
        });
        const duplicateIds = Object.keys(duplicateList || {});
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
        yield put({
            type: actionTypes.TITLES_RECONCILE_ERROR,
        });
    }
}

export function* metadataWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AND_STORE_TITLE, fetchAndStoreTitle),
        takeEvery(actionTypes.FETCH_AND_STORE_TITLES, fetchAndStoreTitles),
        takeEvery(actionTypes.FETCH_AND_STORE_RECONCILIATION_TITLES, getReconciliationTitles),
        takeEvery(actionTypes.TITLES_RECONCILE, reconcileTitles)
    ]);
}
