import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {getDomainName, prepareSortMatrixParamTitles} from '../../../util/Common';
import TitleSystems from '../../../constants/metadata/systems';
import constants from '../../../avails/title-matching/components/create-title-form/CreateTitleFormConstants';
import uniqBy from 'lodash.uniqby';

const http = Http.create();

// Building a URL where user can check the newly created title
// (Opens in new tab)
const onViewTitleClick = (response) => {
    const url = `${getDomainName()}/metadata/detail/${response.data.id}`;
    window.open(url, '_blank');
};

let getSyncQueryParams = (syncToVZ, syncToMovida) => {
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

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = key === 'contentType' ? searchCriteria[key].toUpperCase() : searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles/search' + prepareSortMatrixParamTitles(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    freeTextSearchWithGenres: (searchCriteria, page, pageSize, sortedParams) => {
        const GENRE_KEY = 'editorialGenres';

        return titleService.freeTextSearch(searchCriteria, page, pageSize, sortedParams).then(response => {
            const {data, page, size, total} = (response && response.data) || {};
            const promises = data.map((title) => {
                const {id} = title;
                if (title[GENRE_KEY]) {
                    return title;
                }
                return titleService.getEditorialMetadataByTitleId(id)
                    .then(({data}) => {
                        const itemWithGenres = data.filter(editorial => editorial.genres && editorial.genres.length).map(item => item.genres).flat();

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
                        data: {
                            data: titles,
                            page,
                            size,
                            total,
                        }
                    };
                });
        });
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles' + prepareSortMatrixParamTitles(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    createTitle: (title, syncToVZ, syncToMovida) => {
        const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = legacySystemNames ? {legacySystemNames} : {};

        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles', title, { params });
    },

    createTitleWithoutErrorModal: (title) => {
        const httpNoErrorModal = Http.create({
            defaultErrorHandling: false,
            successToast: {
                description: constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE,
                actions: [{ content: 'View title', onClick: onViewTitleClick }]
            }
        });
        return httpNoErrorModal.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles', title);
    },

    updateTitle: (title, syncToVZ, syncToMovida) => {
        const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = legacySystemNames ? {legacySystemNames} : {};

        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') +`/titles/${title.id}`, title, {params});
    },

    getTitleById: (id) => {
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/titles/${id}`);
    },

    bulkGetTitles: (ids) => {
        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/titles?operationType=READ', ids);
    },

    bulkGetTitlesWithGenres: (ids) => {
        const LANGUAGES = ['English', 'en'];
        const LOCALE = ['US'];
        const GENRE_KEY = 'editorialGenres';

        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/titles?operationType=READ', ids).then(response => {
            const {data = []} = response || {};
            const promises = data.map((title) => {
                const {id} = title;
                if (title[GENRE_KEY]) {
                    return title;
                }
                return titleService.getEditorialMetadataByTitleId(id)
                    .then(({data}) => {
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
                .then(titles => {
                    return {
                        data: titles,
                        status: 200,
                    };
                });
        });
    },

    addTerritoryMetadata: (territoryMetadata) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata', territoryMetadata);
    },

    getTerritoryMetadataById: (id) => {
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/territorymetadata?titleId=${id}`);
    },
    
    updateTerritoryMetadata: (editedTerritoryMetadata) => {
        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata', editedTerritoryMetadata);
    },

    addEditorialMetadata: (editorialMetadata) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/editorialmetadata', editorialMetadata);
    },

    getEditorialMetadataByTitleId: (id) => {
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/editorialmetadata?titleId=${id}`);
    },

    updateEditorialMetadata: (editedEditorialMetadata) => {
        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/editorialmetadata', editedEditorialMetadata);
    },

    mergeTitles: (query) => {
        return http.post(`${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/legacyTitleMerge?${query}`);
    },
};
