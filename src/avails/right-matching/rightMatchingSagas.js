import {call, put, all, select, fork, take, takeEvery, takeLatest} from 'redux-saga/effects';
import {goBack} from 'connected-react-router';
import * as actionTypes from './rightMatchingActionTypes';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../containers/avail/availActionTypes';
import {getRightMatchingFieldSearchCriteria} from './rightMatchingService';
import {rightsService} from '../../containers/avail/service/RightsService';
import {switchCase} from '../../util/Common';
import {getCombinedRight, getRightMatchingList, putCombinedRight, createRightById} from './rightMatchingService';
import {setCombinedSavedFlag} from './rightMatchingActions';
import {createColumnDefs} from '../utils';


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

function* storeRightMatchingSearchCriteria(payload = []) {
    // get focused right
    const {focusedRight} = yield select(state => state.rightMatching);
    const searchCriteria = payload.filter(({type}) => (!type || type === 'Field'));
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

function* fetchRightMatchingFieldSearchCriteria(requestMethod, payload) {
    const error = 'Provider is undefined';
    const {provider, templateName} = payload;
    try {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_REQUEST,
            payload,
        });
        if (!provider) {
            throw {error};
        }
        const {data} = yield call(requestMethod, provider, templateName);
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
            payload: error,
        });
    }
}

function* fetchAndStoreRightMatchingSearchCriteria() {
    // wait to store update with focused right
    const focusedRightActionResult = yield take(actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS); 
    const {payload = {}} = focusedRightActionResult || {};
    const {availSource = {}} = payload || {};
    const {provider, templateName} = availSource || {};

    yield call(fetchRightMatchingFieldSearchCriteria, getRightMatchingFieldSearchCriteria, {provider, templateName});
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
    console.log(payload, 'payload')
    return;
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

export function* createNewRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.CREATE_NEW_RIGHT_REQUEST,
            payload: {}
        });
        yield call(requestMethod, payload.rightId);
        
        yield put({
            type: actionTypes.CREATE_NEW_RIGHT_SUCCESS
        });

        yield call(payload.addToast, {
            appearance: 'normal',
            id: 'new-right-success',
            icon: 'success',
            title: 'Success',
            description: 'You have successfully declared a new right.',
        });
        yield put(goBack());
    } catch (error) {
        yield put({
            type: actionTypes.CREATE_NEW_RIGHT_ERROR,
            payload: error,
            error: true
        });
    }
}

export function* rightMatchingWatcher() {
    yield all([
        takeLatest(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
        takeEvery(actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT, fetchAndStoreFocusedRight),
        takeLatest(actionTypes.FETCH_AND_STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA, fetchAndStoreRightMatchingSearchCriteria),
        takeEvery(actionTypes.FETCH_MATCHED_RIGHT, fetchMatchedRight, rightsService.get),
        takeEvery(actionTypes.FETCH_COMBINED_RIGHT, fetchCombinedRight, getCombinedRight),
        takeEvery(actionTypes.SAVE_COMBINED_RIGHT, saveCombinedRight, putCombinedRight),
        takeEvery(actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID, fetchMatchRightUntilFindId, getRightMatchingList),
        takeEvery(actionTypes.CREATE_NEW_RIGHT, createNewRight, createRightById)
    ]);
}

