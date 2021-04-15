import {
    CAST,
    CREW,
    getFilteredCastList,
    getFilteredCrewList,
    PERSONS_PER_REQUEST,
} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {searchPerson} from '../../../service/ConfigService';
import {formatNumberTwoDigits} from '@vubiquity-nexus/portal-utils/lib/Common';

export const isNexusTitle = titleId => {
    return titleId && titleId.startsWith('titl');
};

export const loadOptionsPerson = (searchPersonText, type) => {
    if (type === CAST) {
        return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CAST, true).then(res =>
            getFilteredCastList(res.data, true, true).map(e => {
                return {
                    id: e.id,
                    name: e.displayName,
                    byline: e.personType.toString().toUpperCase(),
                    original: JSON.stringify(e),
                };
            })
        );
    } else {
        return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CREW).then(res =>
            getFilteredCrewList(res.data, true).map(e => {
                return {
                    id: e.id,
                    name: e.displayName,
                    byline: e.personType.toString().toUpperCase(),
                    original: JSON.stringify(e),
                };
            })
        );
    }
};

export const renderTitleName = (title, seasonNumber, episodeNumber) => {
    if (seasonNumber && episodeNumber) {
        return `${title} S${formatNumberTwoDigits(seasonNumber)} E${formatNumberTwoDigits(episodeNumber)}`;
    }
    return title;
};
