import {get} from 'lodash';
import {createSelector} from 'reselect';

export const createLoadingSelector = (actions) => (state) => {
    return (actions)
        .some((action) => get(state, ['ui', 'loading', action]));
};
