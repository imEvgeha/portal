import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {encodedSerialize, getDomainName, prepareSortMatrixParamTitles} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getApiURI, getAuthConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {get} from 'lodash';
import {store} from '../../index';
import {BASE_PATH} from './titleMetadataRoutes';
import {CONTENT_TYPE} from './constants';

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
    propagateSeasonsPersonsToEpisodes: seasonPersons => {
        const uri = `/seasonsPersonsToEpisodes`;
        const url = getApiURI('title', uri);

        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(seasonPersons),
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
