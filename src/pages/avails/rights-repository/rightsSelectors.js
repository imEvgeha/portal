import {get} from 'lodash';
import {createSelector} from 'reselect';

const getRightsReducer = state => {
    const {avails = {}} = state || {};
    return avails.rights;
};

const getStatusLogReducer = state => {
    const {avails = {}} = state || {};
    return avails.statusLog;
};

export const getRightDetailsRightsSelector = () =>
    createSelector(getRightsReducer, rights => get(rights, 'right') || {});

export const createSelectedRightsSelector = () => createSelector(getRightsReducer, rights => rights?.selected || {});

export const createPreplanRightsSelector = () =>
    createSelector(getRightsReducer, rights => rights?.prePlanRights || {});

export const createRightsFilterSelector = () => createSelector(getRightsReducer, rights => rights?.filter || {});

export const createRightsWithDependenciesSelector = () =>
    createSelector(getRightsReducer, rights => rights?.rightsWithDependencies || {});

export const createDeletedRightsCountSelector = () =>
    createSelector(getRightsReducer, rights => rights?.deletedRightsCount || 0);

export const createUserGridSelector = () => createSelector(getRightsReducer, rights => rights?.gridState || {});

export const createAvailsCurrentUserViewSelector = () =>
    createSelector(getRightsReducer, rights => rights?.currentUserView || {});

export const createFromSelectedTableSelector = () =>
    createSelector(getRightsReducer, rights => rights?.fromSelected || {});

export const createStatusLogCountSelector = () =>
    createSelector(getStatusLogReducer, statusLog => statusLog?.count || 0);

export const createRightGridStateSelector = username =>
    createSelector(
        state => state?.avails?.rights?.gridState?.[username],
        userState => userState
    );

export const getLastUserColumnState = username =>
    createSelector(getRightsReducer, rights => rights?.gridState?.[username]);

export const getPrePlanColumnDefSelector = () =>
    createSelector(getRightsReducer, rights => rights?.prePlanColumnDef || []);
