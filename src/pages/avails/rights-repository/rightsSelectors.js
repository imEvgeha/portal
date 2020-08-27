import {createSelector} from 'reselect';

const getRightsReducer = state => {
    const {avails = {}} = state || {};
    return avails.rights;
};

export const createSelectedRightsSelector = () =>
    createSelector(getRightsReducer, rights => Object.values(rights.selected || {}));

export const createPreplanRightsSelector = () =>
    createSelector(getRightsReducer, rights => rights.prePlanRights || {});

export const createRightsFilterSelector = () => createSelector(getRightsReducer, rights => rights.filter || {});
