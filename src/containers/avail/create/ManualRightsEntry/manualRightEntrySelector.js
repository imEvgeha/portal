import {createSelector} from 'reselect';

const getSelectedTab = (state) => {
    const {manualRightsEntry} = state;
    return manualRightsEntry && manualRightsEntry.session.selectedTab;
};

const getColumns = (state) => {
    const {manualRightsEntry} = state;
    return manualRightsEntry && manualRightsEntry.session.columns;
};

export const createManualRightsEntrySelectedTabSelector = () => createSelector(
    getSelectedTab,
    selectedTab => selectedTab,
);

export const createManualRightsEntryColumnsSelector = () => createSelector(
    getColumns,
    columns => columns,
);