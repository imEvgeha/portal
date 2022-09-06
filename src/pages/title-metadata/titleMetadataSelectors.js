import {createSelector} from 'reselect';

const getTitleMetadataReducer = state => {
    const {titleMetadata = {}} = state || {};
    return titleMetadata;
};

export const createTitleSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.title || {});

export const createTitleLoadingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.titleLoading || false);

export const createEmetLoadingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.emetLoading || false);

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

export const createMovIntTitleIsSyncingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isSyncingMovInt || false);

export const createVZTitleIsPublishingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isPublishingVZ || false);

export const createMOVTitleIsPublishingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isPublishingMOV || false);

export const createMovIntTitleIsPublishingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.isPublishingMovInt || false);

export const createInitialTitleDataSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.initialData || null);

export const createExternalIdsLoadingSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.externalIdLoading || false);

export const createGridStateSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.gridState || {});

export const createUploadLogMetadataFilterSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.uploadLogFilter || {});

export const createTitleMetadataFilterSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.filter || {});

export const createCurrentUserViewSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.currentUserView || {});

export const createSelectedIdSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.selectedId || '');

export const createContentTypesSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.contentTypes || []);

export const externalIDTypesSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata.externalDropdownIDs || {});

export const createSelectedTitlesSelector = () =>
    createSelector(getTitleMetadataReducer, titleMetadata => titleMetadata?.selected || {});

export const propagateAddPersonsSelector = state => state?.titleMetadata?.propagateAddPersons || [];
export const propagateRemovePersonsSelector = state => state?.titleMetadata?.propagateRemovePersons || [];
