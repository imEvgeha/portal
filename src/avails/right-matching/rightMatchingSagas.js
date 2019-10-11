import {call, put, all, select, fork, take, takeEvery, takeLatest} from 'redux-saga/effects';
import * as actionTypes from './rightMatchingActionTypes';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../containers/avail/availActionTypes';
import createLoadingCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';
import createValueFormatter from '../../ui-elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {historyService} from '../../containers/avail/service/HistoryService';
import {getRightMatchingFieldSearchCriteria} from './rightMatchingService';
import {rightsService} from '../../containers/avail/service/RightsService';
import {getCombinedRight, getRightMatchingList, putCombinedRight} from './rightMatchingService';

// TODO - refactor this worker sagra (use select)
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
    } catch (error) {
        throw new Error();
    }
}

function createColumnDefs(payload) {
    const result = payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: javaVariableName,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createValueFormatter(column),
            width: 150,
        };
        return [...columnDefs, columnDef];
    }, []);

    return result;
}

function* storeRightMatchingSearchCriteria(payload = []) {
    // get focused right
    const {focusedRight} = yield select(state => state.rightMatching);
    const searchCriteria = payload.filter(({type}) => (!type || type === 'field'));
    const switchCase = cases => defaultCase => key => cases.hasOwnProperty(key) ? cases[key] : defaultCase;
    const parseFieldNames = (criteria, name) => {
        const fieldNames = {
            EQ: name,
            SUB: name,
            GTE: `${name}From`,
            GT: `${name}From`,
            LT: `${name}To`,
            LTE: `${name}To`,
        };
        const parsedFieldName = switchCase(fieldNames)(name)(criteria);
        return parsedFieldName;
    };

    const parseFieldValue = (criteria, value) => {
        const fieldValues = {
            EQ: value,
            SUB: Array.isArray(value) ? value.join('') : value,
            GTE: value,
            GT: value,
            LT: value,
            LTE: value,
        };
        const parsedValue = switchCase(fieldValues)(value)(criteria);
        return parsedValue;
    };  

    try {
        const fieldSearchCriteria = searchCriteria.reduce((query, field) => {
            const {targetFieldName, fieldName, criteria} = field;
            const name = targetFieldName || fieldName;
            const preparedName = `${name.slice(0, 1).toLowerCase()}${name.slice(1)}`;
            const fieldValue = focusedRight[`${fieldName.slice(0,1).toLowerCase()}${fieldName.slice(1)}`];
            const key = parseFieldNames(criteria, preparedName);
            const value = parseFieldValue(criteria, fieldValue);
            query[key] = value;
            return query;
        }, {});

        yield put({
            type: actionTypes.STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA,
            payload: {fieldSearchCriteria},
        });
    } catch (error) {
        yield put({
            type: actionTypes.STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_ERROR,
            payload: {error},
        });

    }
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
    // wait to store update with focused right
    yield take(actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS); 

    yield fork(fetchRightMatchingProvider, historyService.getHistory, payload);

    while (true) {
        const fetchResult  = yield take([
             actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_SUCCESS,
             actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_ERROR,
        ]);

        if (fetchResult.type === actionTypes.FETCH_RIGHT_MATCHING_PROVIDER_SUCCESS) {
            const {payload} = fetchResult;
            if (payload) {
                yield call(fetchRightMatchingFieldSearchCriteria, getRightMatchingFieldSearchCriteria, payload);
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
        });
    }
}

function* fetchAndStoreFocusedRight(action) {
    yield fork(fetchFocusedRight, action);

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

export function* fetchMatchedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_REQUEST,
            payload: {}
        });

        const response = yield call(requestMethod, payload);
        const matchedRight = response.data;

        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_SUCCESS,
            payload: {matchedRight},
        });

    } catch (error) {
        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* fetchCombinedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_REQUEST,
            payload: {}
        });

        const response = yield call(requestMethod, payload.focusedRightId, payload.matchedRightId);
        const combinedRight = response.data;

        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_SUCCESS,
            payload: {combinedRight},
        });

    } catch (error) {
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* saveCombinedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_REQUEST,
            payload: {}
        });

        const response = yield call(requestMethod, payload.focusedRightId, payload.matchedRightId, payload.combinedRight);
        const focusedRight = response.data;

        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_SUCCESS,
            payload: {focusedRight},
        });

    } catch (error) {
        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* fetchMatchRightUntilFindId(requestMethod, {payload}) {
    try {
        const {id, pageSize, searchParams} = payload || {};
        let {pageNumber} = payload || {};

        let rightMatchPageData = {};
        let isIdFounded = false;
        let isBoundaryValue = false;
        while (!isIdFounded || isBoundaryValue) {
            const response = yield call(requestMethod, pageNumber, pageSize, searchParams);
            const ids = response.data.data.map(el => el.id);
            if (ids.length === 0) {
                break;
            }
            isIdFounded = ids.includes(id);

            let pages = {};
            pages[pageNumber] = ids;
            rightMatchPageData = {
                pages: {...rightMatchPageData.pages, ...pages},
                total: response.data.total
            };

            if (isBoundaryValue || ids.length < pageSize) {
                break;
            }
            isBoundaryValue = isIdFounded && (ids[ids.length - 1] === id);

            pageNumber = pageNumber + 1;
        }

        yield put({
                type: actionTypes.STORE_RIGHT_MATCH_DATA_WITH_IDS,
                payload: {rightMatchPageData}
            }
        );

    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID_FAILED,
            payload: error,
            error: true,
        });
    }
}

export function* rightMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
        takeEvery(actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT, fetchAndStoreFocusedRight),
        takeLatest(actionTypes.FETCH_AND_STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA, fetchAndStoreRightMatchingSearchCriteria),
        takeEvery(actionTypes.FETCH_MATCHED_RIGHT, fetchMatchedRight, rightsService.get),
        takeEvery(actionTypes.FETCH_COMBINED_RIGHT, fetchCombinedRight, getCombinedRight),
        takeEvery(actionTypes.SAVE_COMBINED_RIGHT, saveCombinedRight, putCombinedRight),
        takeEvery(actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID, fetchMatchRightUntilFindId, getRightMatchingList)
    ]);
}

