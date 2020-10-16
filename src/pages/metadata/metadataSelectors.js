import {createSelector} from 'reselect';

export const getTitleId = state => {
    const {metadata = {}} = state;
    return metadata.titleId;
};

export const getTitles = state => {
    const {metadata = {}} = state;
    return metadata.titles;
};

const getTitlePageSize = state => {
    const {metadata = {}} = state;
    return metadata.size;
};

const getTitlePageNumber = state => {
    const {metadata = {}} = state;
    return metadata.page;
};

export const createTitleSelector = () => createSelector([getTitleId, getTitles], (titleId, titles) => titles[titleId]);

export const createTitlesSelector = () => createSelector(getTitles, titles => Object.values(titles || {}));

export const createTitlesInfoSelector = () =>
    createSelector([getTitles, getTitlePageNumber, getTitlePageSize], (titles, page, size) => {
        return {list: titles, page, size};
    });
