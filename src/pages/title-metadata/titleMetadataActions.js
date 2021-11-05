import * as actionTypes from './titleMetadataActionTypes';

export const getTitle = payload => ({
    type: actionTypes.GET_TITLE,
    payload,
});

export const getExternalIds = payload => ({
    type: actionTypes.GET_EXTERNAL_IDS,
    payload,
});

export const getTerritoryMetadata = payload => ({
    type: actionTypes.GET_TERRITORY_METADATA,
    payload,
});

export const propagateAddPersons = payload => ({
    type: actionTypes.PROPAGATE_ADD_PERSONS,
    payload,
});

export const removeSeasonPerson = payload => ({
    type: actionTypes.PROPAGATE_REMOVE_PERSONS,
    payload,
});

export const getEditorialMetadata = payload => ({
    type: actionTypes.GET_EDITORIAL_METADATA,
    payload,
});

export const updateTitle = payload => ({
    type: actionTypes.UPDATE_TITLE,
    payload,
});

export const syncTitle = payload => ({
    type: actionTypes.SYNC_TITLE,
    payload,
});

export const publishTitle = payload => ({
    type: actionTypes.PUBLISH_TITLE,
    payload,
});

export const clearTitle = () => ({
    type: actionTypes.CLEAR_TITLE,
});

export const clearSeasonPersons = () => ({
    type: actionTypes.CLEAR_SEASON_PERSONS,
});

export const storeTitleUserDefinedGridState = payload => {
    return {
        type: actionTypes.SET_TITLE_USER_DEFINED_GRID_STATE,
        payload,
    };
};
