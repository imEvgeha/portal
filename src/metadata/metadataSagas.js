import {call, put, all, select, fork, take, takeEvery} from 'redux-saga/effects';
import {titleService} from '../containers/metadata/service/TitleService';
import * as actionTypes from './metadataActionTypes';
import * as selectors from './metadataSelectors';
import {normalizeDataForStore} from '../util/Common';

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

export function* fetchReconciliationTitles(action) {
    const requestMethod = titleService.bulkGetTitlesWithGenres;

    try {
        yield put({
            type: actionTypes.FETCH_RECONCILIATION_TITLES_REQUEST,
            payload: {}
        });
        const {ids} = action.payload || {};
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
            payload: null,
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

export function* metadataWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AND_STORE_TITLE, fetchAndStoreTitle),
        takeEvery(actionTypes.FETCH_AND_STORE_TITLES, fetchAndStoreTitles),
        takeEvery(actionTypes.FETCH_AND_STORE_RECONCILIATION_TITLES, getReconciliationTitles),
    ]);
}

