import {call, put, all, fork, take, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './rightMatchingActionTypes';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../containers/avail/availActionTypes';
import createLoadingCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';
import createValueFormatter from '../../ui-elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {historyService} from '../../containers/avail/service/HistoryService';
import {getRightMatchingFieldSearchCriteria} from './rightMatchingService';
import {rightsService} from '../../containers/avail/service/RightsService';

export function* createRightMatchingColumnDefs({payload}) {
    try {
        if (payload && payload.length) {
            const columnDefs = yield call(createColumnDefs, payload);
            yield put({
                type: actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS,
                payload: {columnDefs},
            });
            return;
        }
        yield put({
            type: FETCH_AVAIL_MAPPING,
            payload: {},
        });
        while (true) {
            const {payload} = yield take(STORE_AVAIL_MAPPING);
            if (payload && payload.mappings) {
                const columnDefs = yield call(createColumnDefs, payload.mappings);
                yield put({
                    type: actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS,
                    payload: {columnDefs},
                });
            }
            break;
        }
    } catch (error) {throw new Error();}
}

function createColumnDefs(payload) {
    const result = payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName, id} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: id,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createValueFormatter(column),
            width: 150,
        };
        return [...columnDefs, columnDef];
    }, []);

    return result;
}

function* storeRightMatchingSearchCriteria(payload = []) {
    // temporal filtering
    const TYPES = ['Field'];
    const CRITERIA = ['EQ'];
    const fieldSearchCriteria = payload.filter(({type, criteria}) => TYPES.includes(type) && CRITERIA.includes(criteria));
    yield put({
        type: actionTypes.STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA,
        payload: {fieldSearchCriteria},
    });
}

function* fetchRightMatchingFieldSearchCriteria(requestMethod, provider) {
    try {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_REQUEST,
            payload: provider,
        });
        const {data} = yield call(requestMethod, provider);
        const {fieldSearchCriteria} = data || {};
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_SUCCESS,
            payload: fieldSearchCriteria,
        });
        // move this to separate saga worker
        yield call(storeRightMatchingSearchCriteria, fieldSearchCriteria);
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_ERROR,
            paylaod: error,
        });
    }
}

function* fetchRightMatchingProvider(requestMethod, id) {
    try {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_REQUEST,
            payload: {},
        });
        const {data = {}} = yield call(requestMethod, id);
        const {provider} = data;
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_SUCCESS,
            payload: provider,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_ERROR,
            paylaod: error,
        });
    }
}

function* fetchAndStoreRightMatchingSearchCriteria({payload}) {
    yield fork(fetchRightMatchingProvider, historyService.getHistory, payload);

    while (true) {
        const fetchResult  = yield take([
             actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_SUCCESS,
             actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_ERROR,
        ]);

        if (fetchResult.type === actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_SUCCESS) {
            const {payload} = fetchResult;
            const provider = 'sony_latam';
            if (provider) {
                yield call(fetchRightMatchingFieldSearchCriteria, getRightMatchingFieldSearchCriteria, provider);
            }
        }
    }
}

function* fetchFocusedRight(action) {
    const requestMethod = rightsService.get;
    try {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_REQUEST,
            payload: {},
        });
        const response = yield call(requestMethod, action.payload);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

function* fetchAndStoreFocusedRight(requestMethod) {
    yield fork(fetchFocusedRight, requestMethod);

    while (true) {
        const fetchFocusedRightResult = yield take([
            actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
        ]);

        if (fetchFocusedRightResult.type === actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS) {
            yield put({
                type: actionTypes.STORE_FOCUSED_RIGHT,
                payload: {focusedRight: fetchFocusedRightResult.payload},
            });
            break;
        }
    }

}

export function* rightMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
        takeEvery(actionTypes.FETCH_AND_STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA, fetchAndStoreRightMatchingSearchCriteria),
        takeEvery(actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT, fetchAndStoreFocusedRight),
    ]);
}
