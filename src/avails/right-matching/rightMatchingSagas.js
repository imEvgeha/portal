import {call, put, all, take, takeEvery} from 'redux-saga/effects';
import moment from 'moment';
import {goBack} from 'connected-react-router';
import * as actionTypes from './rightMatchingActionTypes';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../containers/avail/availActionTypes';
import createLoadingCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';
import {rightsService} from '../../containers/avail/service/RightsService';
import {getRightMatchingList, createRightById} from './rightMatchingService';

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

// should be outside sagas, in selector?
function createFormatter({dataType, javaVariableName}) {
    switch (dataType) {
        case 'localdate':
            return (params) => {
                const {data = {}} = params || {};
                if (data[javaVariableName]) {
                    return `${moment(data[javaVariableName]).format('L')} ${moment(data[javaVariableName]).format('HH:mm')}`;
                }
            };
        case 'date':
            return (params) => {
                const {data = {}} = params || {};
                if ((data[javaVariableName]) && moment(data[javaVariableName].toString().substr(0, 10)).isValid()) {
                    return moment(data[javaVariableName].toString().substr(0, 10)).format('L');
                }
            };
        case 'territoryType':
            return (params) => {
                const {data = {}} = params || {};
                if (data[javaVariableName]) {
                    return data[javaVariableName].map(e => String(e.country)).join(', ');
                }
            };
        case 'string':
            if (javaVariableName === 'castCrew') {
                return (params) => {
                    const {data = {}} = params || {};
                    if (data[javaVariableName]) {
                        const result = data[javaVariableName]
                            .map(({personType, displayName}) => `${personType}: ${displayName}`)
                            .join('; ');
                        return result;
                    }
                };
            }
            return;
        default:
            return null;
    }
}

function createColumnDefs(payload) {
    const result = payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName, id} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: id,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createFormatter(column),
            width: 150,
        };
        return [...columnDefs, columnDef];
    }, []);


    return result;
}

export function* fetchFocusedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_REQUEST,
            payload: {}
        });

        const response = yield call(requestMethod, payload);
        const focusedRight = response.data;

        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            payload: {focusedRight},
        });

    } catch (error) {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
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

            if (isBoundaryValue) {
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
        yield call(requestMethod, payload);
        yield put({
            type: actionTypes.SET_RIGHT_SUCCESS_FLAG,
            payload: {isSuccessFlagVisible: true}
        });
        yield put(goBack());
    } catch (error) {
        yield put({
            type: actionTypes.SET_CREATE_NEW_RIGHT_ERROR,
            payload: error,
            error: true
        });
    }
}

export function* rightMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
        takeEvery(actionTypes.FETCH_FOCUSED_RIGHT, fetchFocusedRight, rightsService.get),
        takeEvery(actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID, fetchMatchRightUntilFindId, getRightMatchingList),
        takeEvery(actionTypes.CREATE_NEW_RIGHT, createNewRight, createRightById)
    ]);
}
