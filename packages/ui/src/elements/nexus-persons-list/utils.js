import {getFilteredCastList, getFilteredCrewList} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {CAST, PERSONS_PER_REQUEST, MIN_CHARS_FOR_SEARCHING} from './constants';

export const loadOptions = (uiConfig, searchText, searchPerson) => {
    const {type} = uiConfig;
    if (searchText.length < MIN_CHARS_FOR_SEARCHING) return [];
    if (type === CAST) {
        return searchPerson(searchText, PERSONS_PER_REQUEST, type, true).then(res =>
            getFilteredCastList(res.data, true, true).map(e => {
                return {
                    id: e.id,
                    name: e.displayName,
                    byline: e.personType.toString().toUpperCase(),
                    original: JSON.stringify(e),
                };
            })
        );
    }
    return searchPerson(searchText, PERSONS_PER_REQUEST, type).then(res =>
        getFilteredCrewList(res.data, true).map(e => {
            return {
                id: e.id,
                name: e.displayName,
                byline: e.personType.toString().toUpperCase(),
                original: JSON.stringify(e),
            };
        })
    );
};
