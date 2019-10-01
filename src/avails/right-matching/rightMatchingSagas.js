import {call, put, all, take, takeEvery} from 'redux-saga/effects';
import moment from 'moment';
import * as actionTypes from './rightMatchingActionTypes';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../containers/avail/availActionTypes';
import createLoadingCellRenderer from '../../ui-elements/nexus-grid/elements/createLoadingCellRenderer';

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
        default: return null;
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

export function* rightMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
    ]);
}
