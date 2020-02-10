import {createSelector} from 'reselect';
import get from 'lodash.get';

export const createLoadingSelector = (actions) => (state) => {
    return (actions)
        .some((action) => get(state, ['ui', 'loading', action]));
};
