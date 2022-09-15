import {uniqBy} from 'lodash';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {encodedSerialize, prepareSortMatrixParamTitles} from '@vubiquity-nexus/portal-utils/lib/Common';
import TitleSystems from '../../../../metadata/constants/systems';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';

export const getSyncQueryParams = (syncToVZ, syncToMovida) => {
    if (syncToVZ || syncToMovida) {
        if (syncToVZ && syncToMovida) {
            return `${TitleSystems.VZ.toUpperCase()},${TitleSystems.MOVIDA.toUpperCase()}`;
        } else if (syncToVZ) {
            return TitleSystems.VZ.toUpperCase();
        } else {
            return TitleSystems.MOVIDA.toUpperCase();
        }
    }
    return null;
};

export const titleService = {
    freeTextSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = key === 'contentType' ? searchCriteria[key].toUpperCase() : searchCriteria[key];
            }
        }
        const uri = '/titles/search' + prepareSortMatrixParamTitles(sortedParams);
        const url = getApiURI('title', uri);
        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },

    freeTextSearchWithGenres: (searchCriteria, page, pageSize, sortedParams) => {
        const GENRE_KEY = 'editorialGenres';

        return titleService.freeTextSearch(searchCriteria, page, pageSize, sortedParams).then(response => {
            const {data, page, size, total} = response || {};
            const promises = data.map(title => {
                const {id} = title;
                if (title[GENRE_KEY]) {
                    return title;
                }
                return titleService
                    .getEditorialMetadataByTitleId(id)
                    .then(response => {
                        const itemWithGenres = response
                            .filter(editorial => editorial.genres && editorial.genres.length)
                            .map(item => item.genres)
                            .flat();

                        if (itemWithGenres) {
                            const genres = uniqBy(itemWithGenres, 'id');

                            title[GENRE_KEY] = genres;
                        }
                        return title;
                    })
                    .catch(e => e);
            });
            return Promise.all(promises).then(titles => {
                return {
                    data: titles,
                    page,
                    size,
                    total,
                };
            });
        });
    },

    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = searchCriteria[key];
            }
        }

        const uri = '/titles' + prepareSortMatrixParamTitles(sortedParams);
        const url = getApiURI('title', uri);

        const params = encodedSerialize({...queryParams, page, size});

        return nexusFetch(url, {params});
    },

    getTitleById: id => {
        const uri = `/titles/${id}`;
        const url = getApiURI('title', uri);
        return nexusFetch(url);
    },

    bulkGetTitlesWithGenres: ids => {
        const LANGUAGES = ['English', 'en'];
        const LOCALE = ['US'];
        const GENRE_KEY = 'editorialGenres';
        const uri = '/titles?operationType=READ';
        const url = getApiURI('title', uri);

        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(ids),
        }).then(response => {
            const promises = response.map(title => {
                const {id} = title;
                if (title[GENRE_KEY]) {
                    return title;
                }
                return titleService
                    .getEditorialMetadataByTitleId(id)
                    .then(data => {
                        const itemWithGenres = data.find(({locale, language}) => {
                            return LOCALE.includes(locale) && LANGUAGES.includes(language);
                        });
                        if (itemWithGenres) {
                            title[GENRE_KEY] = itemWithGenres.genres;
                        }
                        return title;
                    })
                    .catch(e => e);
            });

            return Promise.all(promises).then(titles => titles);
        });
    },

    addTerritoryMetadata: territoryMetadata => {
        const uri = '/territorymetadata';
        const url = getApiURI('title', uri);
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
        });
    },

    updateTerritoryMetadata: editedTerritoryMetadata => {
        const uri = '/territorymetadata';
        const url = getApiURI('title', uri);
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedTerritoryMetadata),
        });
    },

    getEditorialMetadataByTitleId: id => {
        const uri = `/editorialmetadata?titleId=${id}&includeDeleted=false`;
        const url = getApiURI('title', uri);

        return nexusFetch(url);
    },

    updateEditorialMetadata: editedEditorialMetadata => {
        const uri = '/editorialmetadata';
        const url = getApiURI('title', uri, 2);
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedEditorialMetadata),
        });
    },

    regenerateAutoDecoratedMetadata: masterEmetId => {
        const uri = `/regenerateEmets/${masterEmetId}`;
        const url = getApiURI('title', uri, 2);

        return nexusFetch(url, {
            method: 'put',
        });
    },

    mergeTitles: query => {
        const uri = `/titles/legacyTitleMerge?${query}`;
        const url = getApiURI('title', uri);

        return nexusFetch(url, {
            method: 'post',
        });
    },

    bulkMergeTitles: ({idsToMerge, idsToHide}) => {
        const uri = `/titles/legacyTitleMerge?idsToMerge=${idsToMerge}&idsToHide=${idsToHide}`;
        const url = getApiURI('title', uri);

        return nexusFetch(url, {
            method: 'post',
        });
    },
};
