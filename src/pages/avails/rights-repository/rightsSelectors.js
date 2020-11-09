import {get} from 'lodash';
import {createSelector} from 'reselect';

const getRightsReducer = state => {
    const {avails = {}} = state || {};
    return avails.rights;
};

export const getRightDetailsRightsSelector = () =>
    createSelector(getRightsReducer, rights => get(rights, 'right') || {});

export const createSelectedRightsSelector = () => createSelector(getRightsReducer, rights => rights.selected || {});

export const createPreplanRightsSelector = () => createSelector(getRightsReducer, rights => rights.prePlanRights || {});

export const createRightsFilterSelector = () => createSelector(getRightsReducer, rights => rights.filter || {});

export const createRightsWithDependenciesSelector = () =>
    createSelector(getRightsReducer, rights => rights.rightsWithDependencies || {});

export const createDeletedRightsCountSelector = () =>
    createSelector(getRightsReducer, rights => rights.deletedRightsCount || 0);
