import {createSelector} from 'reselect';

const getRightMatching = state => state.avails.rightMatching || {};

const getColumnDefs = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching.columnDefs;
};

// move this to availMapping selector
const getAvailsMapping = state => {
    const {root} = state;
    return root && root.availsMapping;
};

const getFocusedRight = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching.focusedRight;
};

const getPendingRight = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching.pendingRight;
};

const getMergeRights = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching.mergeRights;
};

const getRightsForMatching = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching.rightsForMatching;
};

const getCombinedRight = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching && rightMatching.combinedRight;
};

const getRightMatchPageData = state => {
    const rightMatching = getRightMatching(state);
    return rightMatching && rightMatching.rightMatchPageData;
};

export const createRightMatchingColumnDefsSelector = () => createSelector(getColumnDefs, columnDefs => columnDefs);

export const createAvailsMappingSelector = () =>
    createSelector(getAvailsMapping, availsMapping => {
        return (availsMapping && availsMapping.mappings) || [];
    });

export const createFocusedRightSelector = () => createSelector(getFocusedRight, focusedRight => focusedRight);

export const createCombinedRightSelector = () => createSelector(getCombinedRight, combinedRight => combinedRight);

export const createRightMatchPageDataSelector = () =>
    createSelector(getRightMatchPageData, rightMatchPageData => rightMatchPageData);

export const createPendingRightSelector = () => createSelector(getPendingRight, pendingRight => pendingRight);
export const createRightsForMatchingSelector = () =>
    createSelector(getRightsForMatching, rightsForMatching => rightsForMatching);
export const createMergeRightsSelector = () => createSelector(getMergeRights, mergeRights => mergeRights);
