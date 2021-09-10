import {createSelector} from 'reselect';

const getTitleMetadataReducer = state => {
    const {titleMetadata = {}} = state || {};
    return titleMetadata;
};

export const createTitleSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.title || {});

export const createTitleLoadingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.loading || false);

export const createExternalIdsSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.externalIds || {});

export const createTerritoryMetadataSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.territoryMetadata || {});

export const createEditorialMetadataSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.editorialMetadata || {});

export const createVZTitleIsSyncingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isSyncingVZ || false);

export const createMOVTitleIsSyncingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isSyncingMOV || false);

export const createVZTitleIsPublishingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isPublishingVZ || false);

export const createMOVTitleIsPublishingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isPublishingMOV || false);

export const createIsEditModeSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isEditMode || false);
