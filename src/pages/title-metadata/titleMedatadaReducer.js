import * as actionTypes from './titleMetadataActionTypes';
import {VZ, MOVIDA} from './constants';

const initialState = {
    title: {},
    initialData: {},
    externalIds: [],
    emetLoading: false,
    titleLoading: false,
    externalIdLoading: false,
    territoryMetadata: [],
    editorialMetadata: [],
    propagateAddPersons: [],
    propagateRemovePersons: [],
    isSyncingVZ: false,
    isPublishingVZ: false,
    isSyncingMOV: false,
    isPublishingMOV: false,
};

const titleMetadataReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case actionTypes.PROPAGATE_ADD_PERSONS:
            return {
                ...state,
                propagateAddPersons: payload.added,
                propagateRemovePersons: payload.removed
            };
        case actionTypes.PROPAGATE_REMOVE_PERSONS:
            return {
                ...state,
                propagateRemovePersons: payload
            }
        case actionTypes.CLEAR_TITLE:
            return {
                ...initialState,
            };
        case actionTypes.CLEAR_SEASON_PERSONS:
            return {
                ...state,
                propagateAddPersons: initialState.propagateAddPersons,
                propagateRemovePersons: initialState.propagateRemovePersons,
            };
        case actionTypes.GET_TITLE_SUCCESS:
            return {
                ...state,
                title: payload,
            };
        case actionTypes.GET_TITLE_ERROR:
            return {
                ...state,
            };
        case actionTypes.GET_TITLE_LOADING:
            return {
                ...state,
                titleLoading: payload,
            };
        case actionTypes.GET_EXTERNAL_IDS_LOADING:
            return {
                ...state,
                externalIdLoading: payload,
            };
        case actionTypes.GET_EXTERNAL_IDS_SUCCESS:
            return {
                ...state,
                externalIds: payload,
                externalIdLoading: false,
            };
        case actionTypes.GET_EXTERNAL_IDS_ERROR:
            return {
                ...state,
                externalIdLoading: false,
            };
        case actionTypes.GET_TERRITORY_METADATA_SUCCESS:
            return {
                ...state,
                territoryMetadata: payload,
            };
        case actionTypes.GET_TERRITORY_METADATA_ERROR:
            return {
                ...state,
            };
        case actionTypes.GET_EDITORIAL_METADATA_SUCCESS:
            return {
                ...state,
                editorialMetadata: payload,
            };
        case actionTypes.GET_EDITORIAL_METADATA_ERROR:
            return {
                ...state,
            };
        case actionTypes.GET_EDITORIAL_METADATA_LOADING:
            return {
                ...state,
                emetLoading: payload,
            };
        case actionTypes.UPDATE_TITLE_SUCCESS:
            return {
                ...state,
                title: payload,
            };
        case actionTypes.UPDATE_TITLE_ERROR:
            return {
                ...state,
            };
        case actionTypes.TITLE_IS_SYNCING_START:
            return {
                ...state,
                isSyncingVZ: payload === VZ ? true : state.isSyncingVZ,
                isSyncingMOV: payload === MOVIDA ? true : state.isSyncingMOV,
            };
        case actionTypes.TITLE_IS_SYNCING_END:
            return {
                ...state,
                isSyncingVZ: payload === VZ ? false : state.isSyncingVZ,
                isSyncingMOV: payload === MOVIDA ? false : state.isSyncingMOV,
            };
        case actionTypes.TITLE_IS_PUBLISHING_START:
            return {
                ...state,
                isPublishingVZ: payload === VZ ? true : state.isPublishingVZ,
                isPublishingMOV: payload === MOVIDA ? true : state.isPublishingMOV,
            };
        case actionTypes.TITLE_IS_PUBLISHING_END:
            return {
                ...state,
                isPublishingVZ: payload === VZ ? false : state.isPublishingVZ,
                isPublishingMOV: payload === MOVIDA ? false : state.isPublishingMOV,
            };
        default:
            return state;
    }
};

export default titleMetadataReducer;
