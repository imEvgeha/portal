import {getFilteredCastList, getFilteredCrewList} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {CAST, PERSONS_PER_REQUEST, MIN_CHARS_FOR_SEARCHING} from './constants';

const handleResponse = (resTable, searchText) => {
    if (resTable && resTable.length > 0) {
        return resTable.map(e => {
            return {
                id: e.id,
                name: e.displayName,
                byline: e.personType.toString().toUpperCase(),
                original: JSON.stringify(e),
            };
        });
    }
    return {
        id: 'create',
        name: `+ Create "${searchText}"`,
        original: 'create',
    };
};

export const loadOptions = (uiConfig, searchText, searchPerson) => {
    const {type} = uiConfig;
    if (searchText.length < MIN_CHARS_FOR_SEARCHING) return [];
    if (type === CAST) {
        return searchPerson(searchText, PERSONS_PER_REQUEST, type, true).then(res => {
            const resTable = getFilteredCastList(res.data, true, true);
            return handleResponse(resTable, searchText);
        });
    }
    return searchPerson(searchText, PERSONS_PER_REQUEST, type).then(res => {
        const resTable = getFilteredCrewList(res.data, true);
        return handleResponse(resTable, searchText);
    });
};
