export const MOVIE = {
    name: 'Movie',
    apiName: 'MOVIE',
};
export const SERIES = {
    name: 'Series',
    apiName: 'SERIES',
};
export const SEASON = {
    name: 'Season',
    apiName: 'SEASON',
};
export const EPISODE = {
    name: 'Episode',
    apiName: 'EPISODE',
};
export const EVENT = {
    name: 'Event',
    apiName: 'EVENT',
};
export const SPORTS = {
    name: 'Sports',
    apiName: 'SPORTS',
};
export const ADVERTISEMENT = {
    name: 'Advertisement',
    apiName: 'AD',
};
export const SPECIAL = {
    name: 'Special',
    apiName: 'SPECIAL',
};

const allTypes = [MOVIE, SERIES, SEASON, EPISODE, EVENT, SPORTS, ADVERTISEMENT];

export const toPrettyContentTypeIfExist = contentType => {
    const type = allTypes.find(t => t.apiName === contentType);
    if (type) {
        return type.name;
    }
    return contentType;
};
