import {PROPAGATE_ADD_PERSONS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-person/elements/PropagateForm/PropagateForm';
import {PROPAGATE_REMOVE_PERSONS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/NexusPersonsList';
import * as actionTypes from './titleMetadataActionTypes';
import {VZ, MOVIDA, MOVIDA_INTL} from './constants';

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
    isSyncingMovInt: false,
    isPublishingMOV: false,
    isPublishingMovInt: false,
    gridState: {},
    filter: {},
    uploadLogFilter: {},
    selectedId: '',
    isEditorial: false,
    currentUserView: {},
    contentTypes: [],
    externalDropdownIDs: [],
};

const titleMetadataReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case PROPAGATE_ADD_PERSONS:
            return {
                ...state,
                propagateAddPersons: payload.added,
                propagateRemovePersons: payload.removed,
            };
        case PROPAGATE_REMOVE_PERSONS:
            return {
                ...state,
                propagateRemovePersons: payload,
            };
        case actionTypes.CLEAR_TITLE: {
            const {gridState, filter, ...gridStateExcluded} = initialState;
            return {
                ...state,
                ...gridStateExcluded,
            };
        }
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
                isSyncingVZ: payload === VZ?.value ? true : state.isSyncingVZ,
                isSyncingMOV: payload === MOVIDA?.value ? true : state.isSyncingMOV,
                isSyncingMovInt: payload === MOVIDA_INTL?.value ? true : state.isSyncingMovInt,
            };
        case actionTypes.TITLE_IS_SYNCING_END:
            return {
                ...state,
                isSyncingVZ: payload === VZ?.value ? false : state.isSyncingVZ,
                isSyncingMOV: payload === MOVIDA?.value ? false : state.isSyncingMOV,
                isSyncingMovInt: payload === MOVIDA_INTL?.value ? false : state.isSyncingMovInt,
            };
        case actionTypes.TITLE_IS_PUBLISHING_START:
            return {
                ...state,
                isPublishingVZ: payload === VZ?.value ? true : state.isPublishingVZ,
                isPublishingMOV: payload === MOVIDA?.value ? true : state.isPublishingMOV,
                isPublishingMovInt: payload === MOVIDA_INTL?.value ? true : state.isPublishingMovInt,
            };
        case actionTypes.TITLE_IS_PUBLISHING_END:
            return {
                ...state,
                isPublishingVZ: payload === VZ?.value ? false : state.isPublishingVZ,
                isPublishingMOV: payload === MOVIDA?.value ? false : state.isPublishingMOV,
                isPublishingMovInt: payload === MOVIDA_INTL?.value ? false : state.isPublishingMovInt,
            };
        case actionTypes.SET_TITLE_USER_DEFINED_GRID_STATE: {
            const {gridState = {}} = state;
            return {
                ...state,
                gridState: {...gridState, ...payload},
            };
        }
        case actionTypes.SET_UPLOAD_LOG_TITLE_FILTER:
            return {
                ...state,
                uploadLogFilter: payload,
            };
        case actionTypes.CLEAR_UPLOAD_LOG_TITLE_FILTER:
            return {
                ...state,
                uploadLogFilter: {},
            };
        case actionTypes.SET_TITLE_FILTER:
            return {
                ...state,
                filter: payload,
            };
        case actionTypes.CLEAR_TITLE_FILTER:
            return {
                ...state,
                filter: {},
            };
        case actionTypes.SET_CURRENT_USER_VIEW:
            return {
                ...state,
                currentUserView: payload,
            };
        case actionTypes.SET_TITLE_CONTENT_TYPES:
            return {
                ...state,
                contentTypes: payload,
            };
        case actionTypes.SET_EXTERNAL_ID_DROPDOWN:
            return {
                ...state,
                externalDropdownIDs: [...state.externalDropdownIDs, ...payload.responseOptions],
            };
        case actionTypes.SET_SELECTED_TITLES: {
            return {
                ...state,
                selected: {...payload},
            };
        }
        default:
            return state;
    }
};

export default titleMetadataReducer;
