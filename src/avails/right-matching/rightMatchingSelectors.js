import {createSelector} from 'reselect';

const getRightMatching = state => state.avails.rightMatching || {};

const getColumnDefs = (state) => {
    const rightMatching = getRightMatching(state);
    return rightMatching.columnDefs;
};

// move this to availMapping selector
const getAvailsMapping = (state) => {
    const {root} = state;
    return root && root.availsMapping;
};

const getFieldSearchCriteria = (state) => {
    const rightMatching = getRightMatching(state);
    return rightMatching.fieldSearchCriteria;
};

const getFocusedRight = (state) => {
    const rightMatching = getRightMatching(state);
    return rightMatching.focusedRight;
};

const getMatchedRights = (state) => {
    const rightMatching = getRightMatching(state);
    return rightMatching.matchedRights;
};

const getCombinedRight = (state) => {
    const rightMatching = getRightMatching(state);
    return rightMatching && rightMatching.combinedRight;
};

const getRightMatchPageData = (state) => {
    const rightMatching = getRightMatching(state);
    return rightMatching && rightMatching.rightMatchPageData;
};

export const createRightMatchingColumnDefsSelector = () => createSelector(
    getColumnDefs,
    columnDefs => columnDefs,
);

export const createAvailsMappingSelector = () => createSelector(
    getAvailsMapping,
    availsMapping => {
        return availsMapping && availsMapping.mappings;
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

export const createMatchedRightsSelector = () => createSelector(
    getMatchedRights,
    matchedRights => matchedRights,
);

export const createCombinedRightSelector = () => createSelector(
    getCombinedRight,
    combinedRight => combinedRight
);

export const createRightMatchPageDataSelector = () => createSelector(
    getRightMatchPageData,
    rightMatchPageData => rightMatchPageData,
);
