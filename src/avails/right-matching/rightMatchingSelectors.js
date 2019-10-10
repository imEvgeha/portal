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

export const getFocusedRight = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.focusedRight;
};

export const getRightMatchPageData = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.rightMatchPageData;
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

export const createFocusedRightSelector = () => createSelector(
    getFocusedRight,
    focusedRight => focusedRight,
);

export const createRightMatchPageDataSelector = () => createSelector(
    getRightMatchPageData,
    rightMatchPageData => rightMatchPageData,
);

export const getSuccessStatus = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.isSuccessFlagVisible;
};

export const getSuccessStatusSelector = () => createSelector(
    getSuccessStatus,
    isSuccessFlagVisible => isSuccessFlagVisible
);

