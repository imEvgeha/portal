import {createSelector} from 'reselect';

export const getColumnDefs = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.columnDefs;
};

// move this to availMapping selector
export const getAvailsMapping = (state) => {
    const {root} = state;
    return root && root.availsMapping;
};

export const getFieldSearchCriteria = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.fieldSearchCriteria;
};

export const getFocusedRight = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.focusedRight;
};

export const getMatchedRight = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.matchedRight;
};

export const getCombinedRight = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.combinedRight;
};

export const getRightMatchPageData = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.rightMatchPageData;
};

export const getCombinedRightSavedFlag = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.isCombinedRightSaved;
};

export const createRightMatchingColumnDefsSelector = () => createSelector(
    getColumnDefs,
    columnDefs => columnDefs,
);

export const createAvailsMappingSelector = () => createSelector(
    getAvailsMapping,
    availsMapping => {
        return availsMapping && availsMapping.mapping;
    }
);

export const createFieldSearchCriteriaSelector = () => createSelector(
    getFieldSearchCriteria,
    fieldSearchCriteria => fieldSearchCriteria,
);

export const createFocusedRightSelector = () => createSelector(
    getFocusedRight,
    focusedRight => focusedRight,
);

export const createMatchedRightSelector = () => createSelector(
    getMatchedRight,
    matchedRight => matchedRight,
);

export const createCombinedRightSelector = () => createSelector(
    getCombinedRight,
    combinedRight => combinedRight
);

export const createCombinedRightSavedFlagSelector = () => createSelector(
    getCombinedRightSavedFlag,
    isCombinedRightSaved => isCombinedRightSaved
);

export const createRightMatchPageDataSelector = () => createSelector(
    getRightMatchPageData,
    rightMatchPageData => rightMatchPageData,
);

export const getSuccessStatus = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.isNewRightSuccessFlagVisible;
};

export const getSuccessStatusSelector = () => createSelector(
    getSuccessStatus,
    isNewRightSuccessFlagVisible => isNewRightSuccessFlagVisible
);

