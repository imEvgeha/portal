import {createSelector} from 'reselect';

export const getConfigApiEndpoints = state => {
    const {settings} = state;
    return settings && settings.configEndpoints;
};

export const createSettingsEndpointsSelector = () =>
    createSelector(getConfigApiEndpoints, endpoints => {
        return endpoints;
    });
