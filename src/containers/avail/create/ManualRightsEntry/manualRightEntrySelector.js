import {createSelector} from 'reselect';

const getSelectedTab = (state) => {
    const {manualRightsEntry} = state;
    return manualRightsEntry && manualRightsEntry.session.selectedTab;
};

export const createManualRightsEntrySelectedTabSelector = () => createSelector(
    getSelectedTab,
    selectedTab => selectedTab,
);