import {createSelector} from 'reselect';

export const getTitleId = state => {
    const {metadata = {}} = state;
    return metadata.titleId;
};

const getTitles = state => {
    const {metadata = {}} = state;
    return metadata.titles;
};

export const createTitleSelector = () => createSelector(
    [getTitleId, getTitles],
    (titleId, titles) => titles[titleId],
);

export const createTitlesSelector = () => createSelector(
    getTitles,
    titles => titles,
);


