import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {encodedSerialize, getDomainName, prepareSortMatrixParamTitles} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getAuthConfig, getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {get} from 'lodash';
import {store} from '../../index';
import {BASE_PATH} from './titleMetadataRoutes';
import {getSyncQueryParams} from './utils';
import {CONTENT_TYPE} from './constants';

export const getTitleById = payload => {
    const {id, tenantCode} = payload;
    const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/titles/${id}`;
    const params = tenantCode ? {tenantCode} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
        isWithErrorHandling: false,
    });
};

export const getEpisodesCount = (id, selectedTenant) => {
    const tenantCode = selectedTenant.id;
    const url = `${getConfig('gateway.titleUrl')}${getConfig(
        'gateway.service.title'
    )}/titles/search?parentId=${id}&contentType=EPISODE`;
    const params = tenantCode ? {tenantCode} : {};
    return nexusFetch(url, {params: encodedSerialize(params)});
};

export const getExternalIds = id => {
    const url = `${getConfig('gateway.publisher')}${getConfig('gateway.service.publisher')}/getPublishInfo/${id}`;
    return nexusFetch(url);
};

export const getTerritoryMetadataById = payload => {
    const {id, tenantCode} = payload;
    const api = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/territorymetadata`;
    const url = `${api}?includeDeleted=false&titleId=${id}`;
    const params = tenantCode ? {tenantCode} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
    });
};

export const getEditorialMetadataByTitleId = payload => {
    const {id, tenantCode} = payload;
    const url = `${getConfig('gateway.titleUrl')}${getConfig(
        'gateway.service.title'
    )}/editorialmetadata?titleId=${id}&includeDeleted=false`;
    const params = tenantCode ? {tenantCode} : {};
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

export const generateMsvIds = (id, licensor, licensee, existingMsvAssociations) => {
    return titleService
        .addMsvAssociationIds(id, licensor, licensee, existingMsvAssociations)
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
                severity: 'warn',
                sticky: true,
                detail: `Regenerating Editorial Metadata Failed. Detail: ${message}`,
            };
            store.dispatch(addToast(errorToast));
            return false;
        }
        const successToast = {
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
                severity: 'error',
                detail: `Unmerge not available. Detail: ${response.body.description}`,
            };
            store.dispatch(addToast(errorToast));
            return false;
        }

        window.sessionStorage.setItem('unmerge', '1');
        window.location.href = `${getDomainName()}/${getAuthConfig().realm}${BASE_PATH}`;

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

export const getExternalIDType = () => {
    const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/configuration/titles/enums`;
    const params = {item: 'external-id-type'};

    return nexusFetch(url, {
        method: 'get',
        params: encodedSerialize(params),
    });
};

export const titleService = {
    advancedSearch: (searchCriteria, page, size, sortedParams, body, selectedTenant) => {
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

        const params = encodedSerialize({...queryParams, page, size, tenantCode: selectedTenant.id});
        return partialContentTypeSearch && nexusFetch(url, {params});
    },
    addMsvAssociationIds: (id, licensor, licensee, existingMsvAssociations) => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig(
            'gateway.service.title'
        )}/titles/${id}/msvIds?licensor=${licensor}&licensee=${licensee}&updateTitle=false`;
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(existingMsvAssociations),
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

    addEditorialMetadata: editorialMetadata => {
        const body = Object.assign({}, editorialMetadata?.body.editorialMetadata);

        // change the body to the new create API requirements
        body['synopsis']['shortSynopsis'] = body['synopsis']['shortDescription'];
        body['synopsis']['mediumSynopsis'] = body['synopsis']['description'];
        body['synopsis']['longSynopsis'] = body['synopsis']['longDescription'];
        body['categories'] = body['category'];
        delete body['synopsis']['longDescription'];
        delete body['synopsis']['description'];
        delete body['synopsis']['shortDescription'];
        delete body['category'];

        body['castCrew'] = body.castCrew.map(({creditsOrder: order, ...rest}) => ({
            order,
            ...rest,
        }));

        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.titleV2')}/titles/${
            body.parentId
        }/editorials`;

        delete body.parentId;

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(body),
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
    addTerritoryMetadata: territoryMetadata => {
        const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.titleV2')}/titles/${
            territoryMetadata.parentId
        }/territories`;

        delete territoryMetadata.parentId;
        delete territoryMetadata.territoryType;

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
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
