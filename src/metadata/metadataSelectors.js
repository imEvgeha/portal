import {createSelector} from 'reselect';

const getTitle = state => {
    const {metadata = {}} = state;
    return metadata.focusedTitle;
};

const getTitles = state => {
    const {metadata = {}} = state;
    return metadata.titles;
};

export const createTitleSelector = () => createSelector(
    getTitle,
    title => title,
);

export const createTitlesSelector = () => createSelector(
    getTitles,
    titles => titles,
);


