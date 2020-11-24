import {createSelector} from 'reselect';

const getTitleMetadataReducer = state => {
    const {titleMetadata = {}} = state || {};
    return titleMetadata;
};

export const createTitleSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.title || {});
export const createExternalIdsSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.externalIds || {});
export const createTerritoryMetadataSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.territoryMetadata || {});
export const createEditorialMetadataSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.editorialMetadata || {});
