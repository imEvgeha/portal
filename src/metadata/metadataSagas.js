import {call, put, all, select, fork, take, takeEvery} from 'redux-saga/effects';
import {titleService} from '../containers/metadata/service/TitleService';
import * as actionTypes from './metadataActionTypes';
import * as selectors from './metadataSelectors';

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
        const {titleId} = yield select(state => state.metadata);
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

export function* getTitleReconciliation(action) {
    yield put({
        type: actionTypes.FETCH_AND_STORE_TITLE,
        payload: {id: action.payload.id},
    });

    while (true) {
        const {type, payload} = yield take([
           actionTypes.STORE_TITLE,
           actionTypes.FETCH_TITLE_ERROR,
        ]);

        if (type === actionTypes.STORE_TITLE) {
            const {contentType, title, releaseYear} = yield select(selectors.createTitleSelector());
            const {list, page, size} = yield select(selectors.createTitlesInfoSelector());
            yield put({
                type: actionTypes.FETCH_AND_STORE_TITLES,
                payload: {
                    params: {title, contentType, releaseYear},
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
    if (titles && titles.length) {
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
            const normalizedData = data.reduce((obj, item) => {
                obj[item.id] = item;
                return obj;
            }, {});
            yield put({
                type: actionTypes.STORE_TITLES,
                payload: {page, size, data: normalizedData},
            });

            break;
        }
    }
}

export function* metadataWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AND_STORE_TITLE, fetchAndStoreTitle),
        takeEvery(actionTypes.FETCH_AND_STORE_TITLES, fetchAndStoreTitles),
        takeEvery(actionTypes.GET_TITLE_RECONCILIATION, getTitleReconciliation),
    ]);
}

