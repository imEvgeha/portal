import {createSelector} from 'reselect';

const getTitleReducer = state => state.titleReducer;
const getSession = createSelector(getTitleReducer, titleReducer => titleReducer.session);
export const getSearchCriteria = createSelector(getSession, session => session.searchCriteria);
