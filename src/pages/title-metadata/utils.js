import {
    ERROR_ICON,
    ERROR_TITLE,
    SUCCESS_ICON,
    SUCCESS_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {cloneDeep, get} from 'lodash';
import {store} from '../../index';
import {getEditorialMetadata, getTerritoryMetadata} from './titleMetadataActions';
import {titleService} from './titleMetadataServices';
import {
    NEXUS,
    VZ,
    MOVIDA,
    UPDATE_EDITORIAL_METADATA_ERROR,
    UPDATE_EDITORIAL_METADATA_SUCCESS,
    UPDATE_TERRITORY_METADATA_SUCCESS,
    UPDATE_TERRITORY_METADATA_ERROR,
} from './constants';

export const isNexusTitle = titleId => {
    return titleId && titleId.startsWith('titl');
};

export const getSyncQueryParams = (syncToVZ, syncToMovida) => {
    if (syncToVZ && syncToMovida) {
        return `${VZ},${MOVIDA}`;
    } else if (syncToVZ) {
        return VZ;
    } else if (syncToMovida) {
        return MOVIDA;
    }
    return null;
};

export const fetchTitleMetadata = async (searchCriteria, offset, limit, sortedParams) => {
    try {
        const response = await titleService.advancedSearch(searchCriteria, offset, limit, sortedParams);
        const {data = [], page, size, total} = response || {};
        const tableData = data.reduce((acc, obj) => {
            const {
                id,
                title = '',
                contentType = '',
                releaseYear = '',
                contentSubType = '',
                duration = '',
                countryOfOrigin = '',
                animated = '',
                eventType = '',
                originalLanguage = '',
                usBoxOffice = '',
                category = '',
                externalIds = {},
            } = obj || {};
            const repository = id.includes('vztitl_') ? VZ : id.includes('movtitl_') ? MOVIDA : NEXUS;
            const {
                assetName = '',
                eidrTitleId = '',
                tmsId = '',
                eidrEditId = '',
                xfinityMovieId = '',
                maId = '',
                isan = '',
                alid = '',
                cid = '',
                isrc = '',
            } = externalIds || {};
            return [
                ...acc,
                {
                    id,
                    title,
                    repository,
                    contentType,
                    releaseYear,
                    contentSubType,
                    duration,
                    countryOfOrigin,
                    animated,
                    eventType,
                    originalLanguage,
                    usBoxOffice,
                    category,
                    assetName,
                    eidrTitleId,
                    tmsId,
                    eidrEditId,
                    xfinityMovieId,
                    maId,
                    isan,
                    alid,
                    cid,
                    isrc,
                },
            ];
        }, []);
        return new Promise(res => {
            res({
                page,
                size,
                total,
                data: tableData,
            });
        });
    } catch (error) {
        return new Promise(res => {
            res({
                page: 0,
                size: 0,
                total: 0,
                data: [],
            });
        });
    }
};

export const handleTitleCategory = data => {
    if (get(data, 'category')) {
        let newData = cloneDeep(data.category);
        newData = newData.map(record => {
            const {name} = record;
            return name;
        });
        return {
            ...data,
            category: newData,
        };
    }
    return data;
};

export const prepareCategoryField = data => {
    if (get(data, 'category')) {
        const updatedCategory = [];
        data.category.forEach((category, index) => {
            updatedCategory.push({
                name: category,
                order: index,
            });
        });
        data.category = updatedCategory;
    }
};

export const handleEditorialGenresAndCategory = (data, fieldName, key) => {
    const newData = cloneDeep(data);
    return newData.map(record => {
        const field = record[fieldName];
        if (field) {
            const formattedValues = [];
            field.forEach(obj => {
                formattedValues.push(obj[key]);
            });
            record[fieldName] = formattedValues;
        }
        return record;
    });
};

const formatTerritoryBody = (data, titleId) => {
    const body = {};
    Object.keys(data).forEach(key => {
        if (data[key] === undefined) body[key] = null;
        else body[key] = data[key];
    });
    body.territoryType = 'country';
    if (titleId) body.parentId = titleId;
    delete body.isUpdated;
    delete body.isDeleted;
    delete body.isCreated;
    return body;
};

export const updateTerritoryMetadata = async (values, titleId) => {
    const data = values.territorialMetadata || [];
    try {
        let response;
        await Promise.all(
            data.map(async tmet => {
                if ((get(tmet, 'isUpdated') || get(tmet, 'isDeleted')) && !get(tmet, 'isCreated')) {
                    const body = formatTerritoryBody(tmet);
                    response = await titleService.updateTerritoryMetadata(body);
                } else if (get(tmet, 'isCreated') && !get(tmet, 'isDeleted')) {
                    const body = formatTerritoryBody(tmet, titleId);
                    response = await titleService.addTerritoryMetadata(body);
                }
            })
        );
        if (response) {
            store.dispatch(getTerritoryMetadata({id: titleId}));
            const successToast = {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: UPDATE_TERRITORY_METADATA_SUCCESS,
            };
            store.dispatch(addToast(successToast));
        }
    } catch (error) {
        const errorToast = {
            title: ERROR_TITLE,
            icon: ERROR_ICON,
            isAutoDismiss: true,
            description: UPDATE_TERRITORY_METADATA_ERROR,
        };
        store.dispatch(addToast(errorToast));
    }
};

export const formatEditorialBody = (data, titleId, isCreate) => {
    const body = {};
    Object.keys(data).forEach(key => {
        if (data[key] === undefined || data[key] === '') body[key] = null;
        else if (key === 'genres') {
            body[key] = data[key].map(genre => {
                return {
                    genre,
                    order: null,
                };
            });
        } else body[key] = data[key];
    });
    delete body.isUpdated;
    delete body.isDeleted;
    delete body.isCreated;
    if (titleId) body.parentId = titleId;
    const hasGeneratedChildren = get(body, 'hasGeneratedChildren', false);
    return isCreate
        ? [
              {
                  itemIndex: '1',
                  body: {
                      decorateEditorialMetadata: hasGeneratedChildren,
                      editorialMetadata: body,
                  },
              },
          ]
        : [
              {
                  itemIndex: null,
                  body,
              },
          ];
};

export const updateEditorialMetadata = async (values, titleId) => {
    let response = [];
    const errorToast = {
        title: ERROR_TITLE,
        icon: ERROR_ICON,
        isAutoDismiss: true,
        description: UPDATE_EDITORIAL_METADATA_ERROR,
    };
    const data = values.editorialMetadata || [];
    try {
        await Promise.all(
            data.map(async emet => {
                if ((get(emet, 'isUpdated') || get(emet, 'isDeleted')) && !get(emet, 'isCreated')) {
                    const body = formatEditorialBody(emet, titleId);
                    response = await titleService.updateEditorialMetadata(body);
                } else if (get(emet, 'isCreated') && !get(emet, 'isDeleted')) {
                    const body = formatEditorialBody(emet, titleId, true);
                    response = await titleService.addEditorialMetadata(body);
                }
            })
        );
        if (response && response.length > 0) {
            let toast = errorToast;
            if (get(response[0], 'response.failed') && get(response[0], 'response.failed').length === 0) {
                store.dispatch(getEditorialMetadata({id: titleId}));
                toast = {
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                    description: UPDATE_EDITORIAL_METADATA_SUCCESS,
                };
            }
            store.dispatch(addToast(toast));
        }
    } catch (error) {
        store.dispatch(addToast(errorToast));
    }
};
