import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {encodedSerialize, getDomainName, prepareSortMatrixParamTitles} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get} from 'lodash';
import {getConfig} from '../../config';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {BASE_PATH} from './titleMetadataRoutes';
import {getSyncQueryParams} from './utils';
import {CONTENT_TYPE} from './constants';

export const getTitleById = payload => {
    const {id, isMgm} = payload;
    const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/titles/${id}`;
    const params = isMgm ? {tenantCode: 'mgm'} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
        isWithErrorHandling: false,
    });
};

export const getEpisodesCount = id => {
    const url = `${getConfig('gateway.titleUrl')}${getConfig(
        'gateway.service.title'
    )}/titles/search?parentId=${id}&contentType=EPISODE`;
    return nexusFetch(url);
};

export const getExternalIds = id => {
    const url = `${getConfig('gateway.publisher')}${getConfig('gateway.service.publisher')}/getPublishInfo/${id}`;
    return nexusFetch(url);
};

export const getTerritoryMetadataById = payload => {
    const {id, isMgm} = payload;
    const api = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/territorymetadata`;
    const url = `${api}?includeDeleted=false&titleId=${id}`;
    const params = isMgm ? {tenantCode: 'mgm'} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
    });
};

export const getEditorialMetadataByTitleId = payload => {
    const {id, isMgm} = payload;
    const url = `${getConfig('gateway.titleUrl')}${getConfig(
        'gateway.service.title'
    )}/editorialmetadata?titleId=${id}&includeDeleted=false`;
    const params = isMgm ? {tenantCode: 'mgm'} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
    });
};

export const updateTitle = (title, syncToVZ, syncToMovida) => {
    const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
    const {catalogOwner: tenantCode} = title;
    const params = legacySystemNames ? {legacySystemNames, tenantCode} : {tenantCode};
    const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/titles/${title.id}`;

    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(title),
        params: encodedSerialize(params),
    });
};

export const generateMsvIds = (id, licensor, licensee) => {
    return titleService
        .addMsvAssociationIds(id, licensor, licensee)
        .then(response => response)
        .catch(err => {
            // add toast
        });
};

export const regenerateAutoDecoratedMetadata = async masterEmet => {
    try {
        const response = await titleService.regenerateAutoDecoratedMetadata(masterEmet.id);
        const failed = get(response, ['data', '0', 'response', 'failed'], []);

        // If some EMets failed to regenerate/update, toast the error messages
        if (failed.length) {
            const message = failed.map(e => e.description).join(' ');
            const errorToast = {
                summary: 'Regenerating Editorial Metadata Failed',
                severity: 'warn',
                sticky: true,
                detail: message,
            };
            store.dispatch(addToast(errorToast));
            return false;
        }
        const successToast = {
            summary: 'Success',
            severity: 'success',
            detail: 'Editorial Metadata Successfully Regenerated!',
        };
        store.dispatch(addToast(successToast));
        return true;
    } catch (err) {}
};

export const unmergeTitle = async id => {
    try {
        const response = await titleService.unmerge(id);
        const internalErrorCode = 500;
        const authorizationErrorCode = 401;
        const unmergeFailed =
            response.statusCodeValue === internalErrorCode || response.statusCodeValue === authorizationErrorCode;
        if (unmergeFailed) {
            const errorToast = {
                summary: 'Unmerge not available',
                severity: 'error',
                sticky: true,
                detail: response.body.description,
            };
            store.dispatch(addToast(errorToast));
            return false;
        }

        window.sessionStorage.setItem('unmerge', '1');
        window.location.href = `${getDomainName()}${BASE_PATH}`;

        return true;
    } catch (err) {}
};

export const syncTitle = payload => {
    const {id: titleId, externalSystem} = payload;
    const params = {externalSystem, titleId};
    const url = `${getConfig('gateway.publisher')}${getConfig('gateway.service.publisher')}/syncTitle`;

    return nexusFetch(url, {
        method: 'post',
        params: encodedSerialize(params),
    });
};

export const registerTitle = payload => {
    const {id: titleId, externalSystem: externalSystems} = payload;
    const params = {externalSystems, titleId};
    const url = `${getConfig('gateway.publisher')}${getConfig('gateway.service.publisher')}/registerTitle`;

    return nexusFetch(url, {
        method: 'post',
        params: encodedSerialize(params),
    });
};

export const titleService = {
    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        const filterIsActive =
            !!Object.keys(searchCriteria).length &&
            !(Object.keys(searchCriteria).length === 1 && get(searchCriteria, 'tenantCode'));
        const partialContentTypeSearch = searchCriteria.contentType
            ? CONTENT_TYPE.find(el => el.toLowerCase().includes(searchCriteria.contentType.toLowerCase()))
            : 'init';

        // api only supports searching by single contentType value, and it has to be exact match otherwise it throws error
        if (!partialContentTypeSearch) {
            delete searchCriteria.contentType;
        }

        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                if (key === 'contentType') {
                    queryParams[key] = partialContentTypeSearch;
                } else if (key === 'title') {
                    const title = searchCriteria[key];
                    if (title.startsWith('"') && title.endsWith('"')) {
                        queryParams[key] = title.slice(1, title.length - 1);
                        queryParams['exactMatch'] = true;
                    } else {
                        queryParams[key] = title;
                    }
                } else {
                    queryParams[key] = searchCriteria[key];
                }
            }
        }
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/titles/${
            filterIsActive ? 'search' : ''
        }${prepareSortMatrixParamTitles(sortedParams)}`;

        const params = encodedSerialize({...queryParams, page, size});
        return partialContentTypeSearch && nexusFetch(url, {params});
    },
    addMsvAssociationIds: (id, licensor, licensee) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig(
            'gateway.service.title'
        )}/titles/${id}/msvIds?licensor=${licensor}&licensee=${licensee}&updateTitle=false`;
        return nexusFetch(url, {
            method: 'post',
        });
    },
    getUploadedMetadata: async (dataForUploadedMetadata, tenantCode, page, size, sortedParams) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig(
            'gateway.service.title'
        )}/importLog${prepareSortMatrixParamTitles(sortedParams)}`;
        const params = tenantCode ? {tenantCode} : {};

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(dataForUploadedMetadata),
            params: encodedSerialize({...params, page, size}),
        });
    },
    getUploadLogMetadataFile: id => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/importReport/${id}`;
        return nexusFetch(url, {
            method: 'get',
        });
    },
    addEditorialMetadata: (editorialMetadata, tenantCode) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.titleV2')}/editorialmetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(editorialMetadata),
            params: encodedSerialize(params),
        });
    },
    updateEditorialMetadata: (editedEditorialMetadata, tenantCode) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.titleV2')}/editorialmetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedEditorialMetadata),
            params: encodedSerialize(params),
        });
    },
    addTerritoryMetadata: (territoryMetadata, tenantCode) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/territorymetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
            params: encodedSerialize(params),
        });
    },
    updateTerritoryMetadata: (editedTerritoryMetadata, tenantCode) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/territorymetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedTerritoryMetadata),
            params: encodedSerialize(params),
        });
    },
    propagateSeasonsPersonsToEpisodes: seasonPersons => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/seasonsPersonsToEpisodes`;
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(seasonPersons),
        });
    },
    regenerateAutoDecoratedMetadata: masterEmetId => {
        const url = `${
            getConfig('gateway.titleUrl') + getConfig('gateway.service.titleV2')
        }/regenerateEmets/${masterEmetId}`;
        return nexusFetch(url, {
            method: 'put',
        });
    },

    unmerge: id => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig(
            'gateway.service.title'
        )}/titles/unmerge?titleId=${id}`;
        return nexusFetch(url, {
            method: 'post',
        });
    },
};
