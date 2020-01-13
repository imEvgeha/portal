import {createSelector} from 'reselect';

const getRightsReducer = state => {
    const {avails = {}} = state || {};
    return avails.rights;
};

export const getRights = () => createSelector(
    getRightsReducer,
    rights => rights.list,
);

export const createSelectedRightsSelector = () => createSelector(
    getRightsReducer,
    rights => rights.selected,
);

