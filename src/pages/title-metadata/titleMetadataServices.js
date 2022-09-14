import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {encodedSerialize, getDomainName, prepareSortMatrixParamTitles} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getApiURI, getAuthConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {get} from 'lodash';
import {store} from '../../index';
import {BASE_PATH} from './titleMetadataRoutes';
import {getSyncQueryParams} from './utils';
import {CONTENT_TYPE} from './constants';

export const getTitleById = payload => {
    const uri = `/titles/${payload?.id}`;
    const url = getApiURI('title', uri, 2);

    return nexusFetch(url);
};

export const getExternalIds = id => {
    const uri = `/getPublishInfo/${id}`;
    const url = getApiURI('movida', uri);

    return nexusFetch(url);
};

export const getTerritoryMetadataById = payload => {
    const uri = `/titles/${payload.id}/territories`;
    const url = getApiURI('title', uri, 2);

    return nexusFetch(url, {});
};

export const updateTitle = (title, syncToVZ, syncToMovida) => {
    const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
    const params = legacySystemNames ? {legacySystemNames} : {};
    const uri = `/titles/${title.id}`;
    const url = getApiURI('title', uri, 2);

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
    const uri = `/syncTitle`;
    const url = getApiURI('movida', uri);

    return nexusFetch(url, {
        method: 'post',
        params: encodedSerialize(params),
    });
};

export const registerTitle = payload => {
    const {id: titleId, externalSystem: externalSystems} = payload;
    const params = {externalSystems, titleId};
    const uri = `/registerTitle`;
    const url = getApiURI('movida', uri);

    return nexusFetch(url, {
        method: 'post',
        params: encodedSerialize(params),
    });
};

export const getEnums = enumItem => {
    const uri = `/configuration/titles/enums`;
    const url = getApiURI('title', uri);
    const params = {item: enumItem};

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

        const uri = `/titles/${filterIsActive ? 'search' : ''}${prepareSortMatrixParamTitles(sortedParams)}`;
        const url = getApiURI('title', uri);

        const params = encodedSerialize({...queryParams, page, size, tenantCode: selectedTenant.id});
        return partialContentTypeSearch && nexusFetch(url, {params});
    },
    addMsvAssociationIds: (id, licensor, licensee, existingMsvAssociations) => {
        const uri = `/titles/${id}/msvIds?licensor=${licensor}&licensee=${licensee}&updateTitle=false`;
        const url = getApiURI('title', uri);

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(existingMsvAssociations),
        });
    },
    getUploadedMetadata: async (dataForUploadedMetadata, tenantCode, page, size, sortedParams) => {
        const uri = `/importLog${prepareSortMatrixParamTitles(sortedParams)}`;
        const url = getApiURI('title', uri);
        const params = tenantCode ? {tenantCode} : {};

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(dataForUploadedMetadata),
            params: encodedSerialize({...params, page, size}),
        });
    },
    getUploadLogMetadataFile: id => {
        const uri = `/importReport/${id}`;
        const url = getApiURI('title', uri);
        return nexusFetch(url, {
            method: 'get',
        });
    },

    addEditorialMetadataV1: (editorialMetadata, tenantCode) => {
        const uri = `/editorialmetadata`;
        const url = getApiURI('title', uri, 2);

        const updatedEditorialMetadata = editorialMetadata.map(item => ({
            ...item,
            body: {
                ...item?.body,
                editorialMetadata: {
                    ...item?.body?.editorialMetadata,
                    type: 'editorialMetadata',
                },
            },
        }));
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(updatedEditorialMetadata),
            params: encodedSerialize(params),
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

        body['castCrew'] = body.castCrew.map(({order, ...rest}) => ({
            order,
            ...rest,
        }));

        const uri = `/titles/${body.parentId}/editorials`;
        const url = getApiURI('title', uri, 2);

        delete body.parentId;

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(body),
        });
    },

    updateEditorialMetadata: (editedEditorialMetadata, tenantCode) => {
        const uri = `/editorialmetadata`;
        const url = getApiURI('title', uri, 2);

        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedEditorialMetadata),
            params: encodedSerialize(params),
        });
    },
    addTerritoryMetadata: (territoryMetadata, titleId) => {
        const uri = `/titles/${titleId}/territories`;
        const url = getApiURI('title', uri, 2);

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
        });
    },
    updateTerritoryMetadata: (editedTerritoryMetadata, titleId, tmetId) => {
        const uri = `/titles/${titleId}/territories/${tmetId}`;
        const url = getApiURI('title', uri, 2);

        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedTerritoryMetadata),
        });
    },
    regenerateAutoDecoratedMetadata: masterEmetId => {
        const uri = `/regenerateEmets/${masterEmetId}`;
        const url = getApiURI('title', uri, 2);

        return nexusFetch(url, {
            method: 'put',
        });
    },

    unmerge: id => {
        const uri = `/titles/unmerge?titleId=${id}`;
        const url = getApiURI('title', uri);

        return nexusFetch(url, {
            method: 'post',
        });
    },
};
