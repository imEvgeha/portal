import React from 'react';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {
    ERROR_ICON,
    SUCCESS_ICON,
    SUCCESS_TITLE,
    TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
    TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {isEmpty} from 'lodash';
import {Button} from 'primereact/button';
import {push} from 'redux-first-history';
import {call, put, all, takeEvery, select, fork} from 'redux-saga/effects';
import mappings from '../../../../profile/titleMatchingMappings.json';
import {
    METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
} from '../../legacy/constants/action-types';
import {fetchAndStoreSelectItems} from '../../legacy/containers/avail/availSagas';
import {createAvailSelectValuesSelector} from '../../legacy/containers/avail/availSelectors';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
import {createColumnDefs} from '../utils';
import * as actionTypes from './titleMatchingActionTypes';
import Constants from './titleMatchingConstants';

function* fetchFocusedRight(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_REQUEST,
            payload: {},
        });

        const focusedRight = yield call(requestMethod, payload);

        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            payload: focusedRight,
        });
        const {title, releaseYear, contentType} = focusedRight;
        const {
            searchParameters: {TITLE, RELEASE_YEAR, CONTENT_TYPE},
        } = Constants;
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
            payload: {
                [TITLE]: title,
                [RELEASE_YEAR]: releaseYear,
                [CONTENT_TYPE]: contentType.toString().toUpperCase(),
            },
        });
        yield put({
            type: METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
            payload: {
                [TITLE]: title,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

function* createTitleMatchingColumnDefs() {
    const selectItems = yield select(createAvailSelectValuesSelector());
    try {
        if (isEmpty(selectItems)) {
            yield fork(fetchAndStoreSelectItems, mappings);
        }
        const columnDefs = yield call(createColumnDefs, mappings);
        yield put({
            type: actionTypes.STORE_COLUMN_DEFS,
            payload: columnDefs,
        });
    } catch (error) {
        throw new Error();
    }
}

function* mergeAndStoreTitles({payload}) {
    const {matchList, duplicateList, rightId} = payload;
    try {
        let query = '';
        const matches = Object.keys(matchList);
        if (matches.length) {
            query = query.concat('idsToMerge=');
            matches.forEach((key, index) => {
                query = `${query}${matchList[key].id}`;
                if (index < matches.length - 1) {
                    query = query.concat(',');
                }
            });
        }
        const mergeIds = query;
        query = query.concat(`&idsToHide=${Object.keys(duplicateList).join(',')}`);

        const response = yield call(titleService.mergeTitles, query) || {data: {}};
        if (!URL.isEmbedded()) {
            const updatedRight = {coreTitleId: response.id};
            yield call(rightsService.update, updatedRight, rightId);
        }
        const url = `/metadata/detail/${response.id}`;
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                content: (
                    <ToastBody
                        summary={SUCCESS_TITLE}
                        detail={TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE}
                        severity="success"
                    >
                        <Button
                            label="View Title"
                            className="p-button-link p-toast-button-link"
                            onClick={() => window.open(url, '_blank')}
                        />
                    </ToastBody>
                ),
            },
        });
        yield put({
            type: actionTypes.STORE_COMBINED_TITLE,
            payload: response,
        });
        yield put({
            type: actionTypes.STORE_TITLES,
            payload: Object.values(matchList),
        });
        // eslint-disable-next-line no-restricted-globals
        yield put(push(URL.keepEmbedded(`${location.pathname}/review?${mergeIds}&combinedTitle=${response.id}`)));
    } catch (e) {
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: ERROR_ICON,
                detail: TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
            },
        });
    }
}

export function* titleMatchingWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_FOCUSED_RIGHT, fetchFocusedRight, rightsService.get),
        takeEvery(actionTypes.CREATE_COLUMN_DEFS, createTitleMatchingColumnDefs),
        takeEvery(actionTypes.MERGE_TITLES, mergeAndStoreTitles),
    ]);
}
