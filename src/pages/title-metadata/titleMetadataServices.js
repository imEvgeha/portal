import {WARNING_ICON, SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {prepareSortMatrixParamTitles, encodedSerialize} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get} from 'lodash';
import config from 'react-global-configuration';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {getSyncQueryParams} from './utils';
import {CONTENT_TYPE} from './constants';

export const getTitleById = payload => {
    const {id, isMgm} = payload;
    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${id}`;
    const params = isMgm ? {tenantCode: 'mgm'} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
    });
};

export const getExternalIds = id => {
    const url = `${config.get('gateway.publisher')}${config.get('gateway.service.publisher')}/getPublishInfo/${id}`;
    return nexusFetch(url);
};

export const getTerritoryMetadataById = payload => {
    const {id, isMgm} = payload;
    const api = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/territorymetadata`;
    const url = `${api}?includeDeleted=false&titleId=${id}`;
    const params = isMgm ? {tenantCode: 'mgm'} : {};
    return nexusFetch(url, {
        params: encodedSerialize(params),
    });
};

export const getEditorialMetadataByTitleId = payload => {
    const {id, isMgm} = payload;
    const url = `${config.get('gateway.titleUrl')}${config.get(
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
    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${title.id}`;

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
                title: 'Regenerating Editorial Metadata Failed',
                icon: WARNING_ICON,
                isAutoDismiss: true,
                description: message,
            };
            store.dispatch(addToast(errorToast));
            return false;
        }
        const successToast = {
            title: 'Success',
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            description: 'Editorial Metadata Successfully Regenerated!',
        };
        store.dispatch(addToast(successToast));
        return true;
    } catch (err) {}
};

export const syncTitle = payload => {
    const {id: titleId, externalSystem} = payload;
    const params = {externalSystem, titleId};
    const url = `${config.get('gateway.publisher')}${config.get('gateway.service.publisher')}/syncTitle`;

    return nexusFetch(url, {
        method: 'post',
        params: encodedSerialize(params),
    });
};

export const registerTitle = payload => {
    const {id: titleId, externalSystem: externalSystems} = payload;
    const params = {externalSystems, titleId};
    const url = `${config.get('gateway.publisher')}${config.get('gateway.service.publisher')}/registerTitle`;

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
            : '';

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
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${
            filterIsActive ? 'search' : ''
        }${prepareSortMatrixParamTitles(sortedParams)}`;

        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },
    addMsvAssociationIds: (id, licensor, licensee) => {
        const url = `${config.get('gateway.titleUrl')}${config.get(
            'gateway.service.title'
        )}/titles/${id}/msvIds?licensor=${licensor}&licensee=${licensee}`;
        return nexusFetch(url, {
            method: 'post',
        });
    },
    addEditorialMetadata: (editorialMetadata, tenantCode) => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.titleV2')}/editorialmetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(editorialMetadata),
            params: encodedSerialize(params),
        });
    },
    updateEditorialMetadata: (editedEditorialMetadata, tenantCode) => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.titleV2')}/editorialmetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedEditorialMetadata),
            params: encodedSerialize(params),
        });
    },
    addTerritoryMetadata: (territoryMetadata, tenantCode) => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/territorymetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
            params: encodedSerialize(params),
        });
    },
    updateTerritoryMetadata: (editedTerritoryMetadata, tenantCode) => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/territorymetadata`;
        const params = tenantCode ? {tenantCode} : {};
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedTerritoryMetadata),
            params: encodedSerialize(params),
        });
    },
    regenerateAutoDecoratedMetadata: masterEmetId => {
        const url = `${
            config.get('gateway.titleUrl') + config.get('gateway.service.titleV2')
        }/regenerateEmets/${masterEmetId}`;
        return nexusFetch(url, {
            method: 'put',
        });
    },
};
