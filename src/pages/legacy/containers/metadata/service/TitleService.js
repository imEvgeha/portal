import {uniqBy} from 'lodash';
import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {getDomainName, prepareSortMatrixParamTitles, encodedSerialize} from '../../../../../util/Common';
import TitleSystems from '../../../constants/metadata/systems';
import constants from '../../../../avails/title-matching/components/create-title-form/CreateTitleFormConstants';

const getSyncQueryParams = (syncToVZ, syncToMovida) => {
    if(syncToVZ || syncToMovida) {
        if(syncToVZ && syncToMovida) {
            return `${TitleSystems.VZ.toUpperCase()},${TitleSystems.MOVIDA.toUpperCase()}`;
        } else if(syncToVZ) {
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
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles/search' + prepareSortMatrixParamTitles(sortedParams);
        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },

    freeTextSearchWithGenres: (searchCriteria, page, pageSize, sortedParams) => {
        const GENRE_KEY = 'editorialGenres';

        return titleService.freeTextSearch(searchCriteria, page, pageSize, sortedParams).then(response => {
            const {data, page, size, total} = response || {};
            const promises = data.map((title) => {
                const {id} = title;
                if (title[GENRE_KEY]) {
                    return title;
                }
                return titleService.getEditorialMetadataByTitleId(id)
                    .then(response => {
                        const itemWithGenres = response.filter(editorial => editorial.genres && editorial.genres.length).map(item => item.genres).flat();

                        if (itemWithGenres) {
                            const genres = uniqBy(itemWithGenres, 'id');

                            title[GENRE_KEY] = genres;
                        }
                        return title;
                    })
                    .catch(e => e);
            });
            return Promise.all(promises)
                .then(titles => {
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

        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles' + 
            prepareSortMatrixParamTitles(sortedParams);
        const params = encodedSerialize({...queryParams, page, size});

        return nexusFetch(url, {params});
    },

    createTitle: (title, syncToVZ, syncToMovida) => {
        const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = legacySystemNames ? {legacySystemNames} : {};
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles';

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(title),
            params: encodedSerialize(params),
            isWithErrorHandling: false,
        });
    },

    createTitleWithoutErrorModal: (title) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles';
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(title),
            isWithErrorHandling: false,
        });
    },

    updateTitle: (title, syncToVZ, syncToMovida) => {
        const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = legacySystemNames ? {legacySystemNames} : {};
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') +`/titles/${title.id}`;

        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(title),
            params: encodedSerialize(params),
        });
    },

    getTitleById: (id) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/titles/${id}`;
        return nexusFetch(url);
    },

    bulkGetTitles: (ids) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/titles?operationType=READ';
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(ids),
        });
    },

    bulkGetTitlesWithGenres: (ids) => {
        const LANGUAGES = ['English', 'en'];
        const LOCALE = ['US'];
        const GENRE_KEY = 'editorialGenres';
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/titles?operationType=READ';

        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(ids),
        }).then(response => {
            const promises = response.map((title) => {
                const {id} = title;
                if (title[GENRE_KEY]) {
                    return title;
                }
                return titleService.getEditorialMetadataByTitleId(id)
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

            return Promise.all(promises)
                .then(titles => titles);
        });
    },

    addTerritoryMetadata: (territoryMetadata) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata';
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
        });
    },

    getTerritoryMetadataById: (id) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/territorymetadata?titleId=${id}`;
        return nexusFetch(url);
    },
    
    updateTerritoryMetadata: (editedTerritoryMetadata) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata';
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedTerritoryMetadata),
        });
    },

    addEditorialMetadata: (editorialMetadata) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/editorialmetadata';
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(editorialMetadata),
        });
    },

    getEditorialMetadataByTitleId: (id) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/editorialmetadata?titleId=${id}&includeDeleted=false`;
        return nexusFetch(url);
    },

    updateEditorialMetadata: (editedEditorialMetadata) => {
        const url = config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/editorialmetadata';
        return nexusFetch(url, {
            method:'put',
            body: JSON.stringify(editedEditorialMetadata),
        });
    },

    mergeTitles: (query) => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/legacyTitleMerge?${query}`;
        return nexusFetch(url, {
            method: 'post',
        });
    },
};
