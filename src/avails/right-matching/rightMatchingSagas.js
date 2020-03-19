import {call, put, all, select, fork, take, takeEvery, takeLatest} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import * as actionTypes from './rightMatchingActionTypes';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../containers/avail/availActionTypes';
import {getRightMatchingFieldSearchCriteria} from './rightMatchingService';
import {rightsService} from '../../containers/avail/service/RightsService';
import {URL} from '../../util/Common';
import {getCombinedRight, getRightMatchingList, putCombinedRight, createRightById} from './rightMatchingService';
import {createColumnDefs} from '../utils';
import {SUCCESS_ICON, SUCCESS_TITLE} from '../../ui/elements/nexus-toast-notification/constants';
import {SAVE_COMBINED_RIGHT_SUCCESS_MESSAGE,} from '../../ui/toast/constants';
import {ADD_TOAST} from '../../ui/toast/toastActionTypes';
import {SET_LOCALE} from '../../constants/action-types';

// TODO - refactor this worker saga (use select)
export function* createRightMatchingColumnDefs() {
    const {availsMapping} = yield select(state => state.root);
    try {
        const {mappings = []} = availsMapping || {};
        if (mappings.length) {
            const columnDefs = yield call(createColumnDefs, mappings);
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

function* fetchAndStoreRightMatchingSearchCriteria() {
    // wait to store update with focused right
    // TODO: improve this
    const focusedRightActionResult = yield take(actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS); 
    const {payload = {}} = focusedRightActionResult || {};
    const error = 'Provider is undefined';
    const {availSource = {}} = payload || {};
    const {provider} = availSource || {};

    try {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_REQUEST,
            payload,
        });
        if (!provider) {
            throw {error};
        }
        const {data} = yield call(getRightMatchingFieldSearchCriteria, payload);
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_ERROR,
            payload: error,
        });
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

export function* fetchMatchedRights(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_REQUEST,
            payload: {}
        });

        const matchedRights = [];
        for(const id of payload) {
            const response = yield call(requestMethod, id);
            matchedRights.push(response.data);
        }

        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_SUCCESS,
            payload: {matchedRights},
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
    const {rightIds} = payload || {};
    try {
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_REQUEST,
            payload: {}
        });

        const response = yield call(requestMethod, rightIds);
        const combinedRight = response.data;

        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_SUCCESS,
            payload: {combinedRight},
        });

    } catch (error) {
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_ERROR,
            payload: {combinedRight: {}},
            error: true,
        });
    }
}

export function* saveCombinedRight(requestMethod, {payload}) {
    const {rightIds, combinedRight, redirectPath} = payload || {};
    try {
        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_REQUEST,
            payload: {}
        });
        const response = yield call(requestMethod, rightIds, combinedRight);
        const focusedRight = response.data;

        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_SUCCESS,
            payload: {focusedRight},
        });

        if (redirectPath) {
            yield put(push(URL.keepEmbedded(redirectPath)));
        }

        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: SAVE_COMBINED_RIGHT_SUCCESS_MESSAGE,
            }
        });
    } catch (error) {
        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_ERROR,
            payload: error,
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
            const response = yield call(requestMethod, null, pageNumber, pageSize, searchParams);
            const ids = response.data.data.map(el => el.id);
            if (ids.length === 0) {
                break;
            }
            isIdFounded = ids.includes(id);

            const pages = {};
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
    const {rightId, redirectPath} = payload || {};
    try {
        yield put({
            type: actionTypes.CREATE_NEW_RIGHT_REQUEST,
            payload: {}
        });
        yield call(requestMethod, rightId);
        
        yield put({
            type: actionTypes.CREATE_NEW_RIGHT_SUCCESS
        });
        if (redirectPath) {
            yield put(push(URL.keepEmbedded(redirectPath)));
        }
    } catch (error) {
        yield put({
            type: actionTypes.CREATE_NEW_RIGHT_ERROR,
            payload: error,
        });
    }
}

export function* rightMatchingWatcher() {
    yield all([
        takeLatest(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
        takeLatest(SET_LOCALE, createRightMatchingColumnDefs),
        takeEvery(actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT, fetchAndStoreFocusedRight),
        takeLatest(actionTypes.FETCH_AND_STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA, fetchAndStoreRightMatchingSearchCriteria),
        takeEvery(actionTypes.FETCH_MATCHED_RIGHT, fetchMatchedRights, rightsService.get),
        takeEvery(actionTypes.FETCH_COMBINED_RIGHT, fetchCombinedRight, getCombinedRight),
        takeEvery(actionTypes.SAVE_COMBINED_RIGHT, saveCombinedRight, putCombinedRight),
        takeEvery(actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID, fetchMatchRightUntilFindId, getRightMatchingList),
        takeEvery(actionTypes.CREATE_NEW_RIGHT, createNewRight, createRightById)
    ]);
}

