import {createSelector} from 'reselect';

const getTitles = state => {
    const {metadata = {}} = state;
    return metadata.focusedTitle;
};

export const createTitleSelector = () => createSelector(
    getTitle,
    title => title,
);


