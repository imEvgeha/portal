import {formatNumberTwoDigits} from '@vubiquity-nexus/portal-utils/lib/Common';
// import {
//     CAST,
//     CREW,
//     getFilteredCastList,
//     getFilteredCrewList,
//     PERSONS_PER_REQUEST,
// } from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
// import {searchPerson} from '../../../../../../../../src/pages/legacy/containers/metadata/service/ConfigService';

const EPISODE = {
    name: 'Episode',
    apiName: 'EPISODE',
};

export const isNexusTitle = titleId => {
    return titleId && titleId.startsWith('titl');
};

// export const loadOptionsPerson = (searchPersonText, type) => {
//     if (type === CAST) {
//         return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CAST, true).then(res =>
//             getFilteredCastList(res.data, true, true).map(e => {
//                 return {
//                     id: e.id,
//                     name: e.displayName,
//                     byline: e.personType.toString().toUpperCase(),
//                     original: JSON.stringify(e),
//                 };
//             })
//         );
//     }
//     return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CREW).then(res =>
//         getFilteredCrewList(res.data, true).map(e => {
//             return {
//                 id: e.id,
//                 name: e.displayName,
//                 byline: e.personType.toString().toUpperCase(),
//                 original: JSON.stringify(e),
//             };
//         })
//     );
// };

export const renderTitleName = (title, contentType, seasonNumber, episodeNumber, seriesTitleName) => {
    if (contentType === EPISODE.apiName) {
        return seriesTitleName
            ? `${seriesTitleName} S${formatNumberTwoDigits(seasonNumber)} E${formatNumberTwoDigits(
                  episodeNumber
              )}: ${title}`
            : `[SeriesNotFound] S${formatNumberTwoDigits(seasonNumber)} E${formatNumberTwoDigits(
                  episodeNumber
              )}: ${title}`;
    }
    return title;
};
