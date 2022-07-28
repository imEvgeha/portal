import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {cloneDeep, get, isEqual, isObjectLike} from 'lodash';
import {store} from '../../index';
import {getEditorialMetadata, getTerritoryMetadata} from './titleMetadataActions';
import {titleService} from './titleMetadataServices';
import {
    MOVIDA,
    NEXUS,
    PROPAGATE_SEASON_PERSONS_SUCCESS,
    UPDATE_EDITORIAL_METADATA_ERROR,
    UPDATE_EDITORIAL_METADATA_SUCCESS,
    UPDATE_TERRITORY_METADATA_ERROR,
    UPDATE_TERRITORY_METADATA_SUCCESS,
    VZ,
} from './constants';

export const isNexusTitle = titleId => {
    return titleId && titleId.startsWith('titl');
};

export const isStateEditable = state => {
    return state !== 'deleted';
};

export const getSyncQueryParams = (syncToVZ, syncToMovida) => {
    if (syncToVZ && syncToMovida) {
        return `${VZ?.value},${MOVIDA?.value}`;
    } else if (syncToVZ) {
        return VZ;
    } else if (syncToMovida) {
        return MOVIDA;
    }
    return null;
};

export const fetchTitleMetadata = async (searchCriteria, offset, limit, sortedParams, body, selectedTenant) => {
    try {
        const response = await titleService.advancedSearch(
            searchCriteria,
            offset,
            limit,
            sortedParams,
            body,
            selectedTenant
        );
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
                categories = '',
                externalIds = {},
                episodic = {},
            } = obj || {};
            const repository = id.includes('vztitl_') ? VZ?.value : id.includes('movtitl_') ? MOVIDA?.value : NEXUS;
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
            const {seasonNumber = '', episodeNumber = '', seriesTitleName = ''} = episodic || {};
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
                    categories,
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
                    seasonNumber,
                    episodeNumber,
                    seriesTitleName,
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
    if (get(data, 'categories')) {
        let newData = cloneDeep(data.categories);
        newData = newData.map(record => {
            const {name} = record;
            return name;
        });
        return {
            ...data,
            categories: newData,
        };
    }
    return data;
};

export const prepareCategoryField = data => {
    if (get(data, 'categories')) {
        const updatedCategory = [];
        data.categories.forEach((category, index) => {
            updatedCategory.push({
                name: category,
                order: index,
            });
        });
        data.categories = updatedCategory;
    }
};

export const handleEditorialGenresAndCategory = (data, fieldName, key) => {
    return (
        data &&
        data.map(record => {
            const field = record[fieldName];
            if (field) {
                const formattedValues = [];
                field.forEach(obj => {
                    if (key === 'genre' && obj[key]) {
                        if (record?.language !== obj?.language) {
                            formattedValues.push({label: `(${obj[key]})*`, value: obj.id});
                        } else formattedValues.push({label: obj[key], value: obj.id});
                    } else obj[key] && formattedValues.push(obj[key]);
                });
                record[fieldName] = formattedValues.length ? formattedValues : field;
            }
            return record;
        })
    );
};

const formatTerritoryBody = data => {
    const body = {};
    Object.keys(data).forEach(key => {
        if (data[key] === undefined) body[key] = null;
        else if (key === 'metadataStatus') {
            body[key] = get(data[key], 'value') ? get(data[key], 'value') : data[key];
        } else body[key] = data[key];
    });
    if (body.isDeleted) {
        body.metadataStatus = 'deleted';
    }
    delete body.isUpdated;
    delete body.isDeleted;
    delete body.isCreated;
    return body;
};

/**
 * Used for POST/PUT TMETs
 * @param values
 * @param titleId
 * @param selectedTenant
 * @returns {Promise<void>}
 */
export const updateTerritoryMetadata = async (values, titleId, selectedTenant) => {
    const data = values.territorialMetadata || [];
    try {
        // eslint-disable-next-line init-declarations
        let response;
        await Promise.all(
            data.map(async tmet => {
                if ((get(tmet, 'isUpdated') || get(tmet, 'isDeleted')) && !get(tmet, 'isCreated')) {
                    const body = formatTerritoryBody(tmet);
                    const {id: tmetId} = body;
                    delete body.id;
                    response = await titleService.updateTerritoryMetadata(body, titleId, tmetId);
                } else if (get(tmet, 'isCreated') && !get(tmet, 'isDeleted')) {
                    const body = formatTerritoryBody(tmet);
                    // POST is on V2
                    response = await titleService.addTerritoryMetadata(body, titleId);
                }
            })
        );
        if (response) {
            store.dispatch(getTerritoryMetadata({id: titleId, selectedTenant}));
            const successToast = {
                severity: 'success',
                detail: UPDATE_TERRITORY_METADATA_SUCCESS,
            };
            store.dispatch(addToast(successToast));
        }
    } catch (error) {
        const errorToast = {
            severity: 'error',
            detail: UPDATE_TERRITORY_METADATA_ERROR,
        };
        store.dispatch(addToast(errorToast));
    }
};

export const formatEditorialBody = (data, titleId, isCreate) => {
    const body = {};
    Object.keys(data).forEach(key => {
        if (data[key] === undefined || data[key] === '') body[key] = null;
        else if (key === 'genres') {
            body[key] =
                data[key] &&
                data[key].map((genre, i) => {
                    return {
                        id: get(genre, 'value'), // id is configured in value for genre
                        order: i,
                    };
                });
        } else if (key === 'category') {
            body[key] =
                data[key] &&
                data[key].map((category, index) => {
                    let categoryValue = category;
                    if (isObjectLike(category) && get(category, 'value')) {
                        categoryValue = get(category, 'value');
                    }
                    return {
                        name: categoryValue,
                        order: index,
                    };
                });
        } else if (key === 'title' || key === 'synopsis') {
            const obj = data[key];
            if (obj) {
                let areAllEmpty = true;
                Object.keys(obj).forEach(keyProp => {
                    if (obj[keyProp] !== null && obj[keyProp] !== '') {
                        areAllEmpty = false;
                    } else {
                        obj[keyProp] = null;
                    }
                });
                if (areAllEmpty) {
                    body[key] = null;
                } else {
                    body[key] = obj;
                }
            } else {
                body[key] = null;
            }
        } else if (key === 'metadataStatus') {
            body[key] = get(data[key], 'value') ? get(data[key], 'value') : data[key];
        } else body[key] = data[key];
    });
    if (body.isDeleted) {
        body.metadataStatus = 'deleted';
    }
    delete body.isUpdated;
    delete body.isDeleted;
    delete body.isCreated;
    if (titleId) body.parentId = titleId;

    const hasGeneratedChildren = get(body, 'hasGeneratedChildren', false);
    return isCreate
        ? {
              itemIndex: '1',
              body: {
                  decorateEditorialMetadata: hasGeneratedChildren,
                  editorialMetadata: body,
              },
          }
        : {
              itemIndex: null,
              body,
          };
};

export const updateEditorialMetadata = async (values, titleId, selectedTenant) => {
    let response = [];
    const errorToast = {
        severity: 'error',
        detail: UPDATE_EDITORIAL_METADATA_ERROR,
    };
    const data = values.editorialMetadata || [];
    const {tenantCode} = values;
    const updatedEmets = [];
    const newEmets = [];
    data.forEach(emet => {
        if ((get(emet, 'isUpdated') || get(emet, 'isDeleted')) && !get(emet, 'isCreated')) {
            updatedEmets.push(formatEditorialBody(emet, titleId, false));
        } else if (get(emet, 'isCreated') && !get(emet, 'isDeleted')) {
            newEmets.push(formatEditorialBody(emet, titleId, true));
        }
    });

    try {
        if (updatedEmets.length > 0) response = await titleService.updateEditorialMetadata(updatedEmets, tenantCode);
        if (newEmets.length > 0) response = await titleService.addEditorialMetadataV1(newEmets, tenantCode);

        // Temporarily block new version
        // if (newEmets.length > 0) {
        //     response = newEmets.map(async emet => titleService.addEditorialMetadata(emet));
        //     await Promise.all(response);
        // }
        if (response && response.length > 0) {
            let toast = errorToast;
            if (!get(response[0], 'response.failed') || get(response[0], 'response.failed').length === 0) {
                store.dispatch(getEditorialMetadata({id: titleId, selectedTenant}));
                toast = {
                    severity: 'success',
                    detail: UPDATE_EDITORIAL_METADATA_SUCCESS,
                };
            }
            store.dispatch(addToast(toast));
        }
    } catch (error) {
        store.dispatch(addToast(errorToast));
    }
};

export const propagateSeasonsPersonsToEpisodes = async (data, id) => {
    const response = await titleService.propagateSeasonsPersonsToEpisodes({
        ...data,
        seasonId: id,
    });

    if (response.error) {
        store.dispatch(
            addToast({
                severity: 'error',
                detail: response.error,
            })
        );
    } else {
        store.dispatch(
            addToast({
                severity: 'success',
                detail: PROPAGATE_SEASON_PERSONS_SUCCESS,
            })
        );
    }
};

export const handleDirtyValues = (initialValues, values) => {
    const cleanValues = cleanObject(values);
    const unnecessaryValues = [
        'vzExternalIds',
        'movidaExternalIds',
        'editorial',
        'movidaUkExternalIds',
        'territorial',
        'editorialMetadata',
    ];
    const isTitleChanged = Object.keys(cleanValues).some(item => {
        const initialItem = initialValues?.[item] === undefined ? null : initialValues?.[item];
        const cleanItem = cleanValues?.[item];
        if (unnecessaryValues.includes(item)) {
            return false;
        }

        if (Array.isArray(initialItem) && Array.isArray(cleanItem)) {
            return !isEqual(initialItem.length, cleanItem.length);
        }

        return !isEqual(initialItem, cleanItem);
    });

    handleDirtyRatingsValues(values);
    handleDirtyEMETValues(initialValues, values);
    handleDirtyTMETValues(initialValues, values);
    values.isUpdated = isTitleChanged;
};

const handleDirtyRatingsValues = values => {
    const rating = get(values, 'rating');
    const ratingSystem = get(values, 'ratingSystem');
    const advisoriesCode = get(values, 'advisoriesCode', null);
    const advisoriesFreeText = get(values, 'advisoriesFreeText', null);
    const updatedRatingRecord = {
        rating,
        ratingSystem,
        advisoriesCode,
        advisoriesFreeText,
    };
    const index = values?.ratings?.findIndex(elem => elem.ratingSystem === ratingSystem);
    if (index !== null && index >= 0) {
        values.ratings[index] = updatedRatingRecord;
    }
};

// remove undefined and null values from object
const cleanObject = obj => {
    return JSON.parse(
        JSON.stringify(obj, (key, value) => {
            return value;
        })
    );
};

const handleDirtyEMETValues = (initialValues, values) => {
    const editorial = values.editorial;
    if (editorial) {
        const index =
            values.editorialMetadata &&
            values.editorialMetadata.findIndex(elem => {
                if (elem.locale === editorial.locale && elem.language === editorial.language) {
                    const isFormatOk =
                        (elem.format && editorial.format && elem.format === editorial.format) ||
                        (!elem.format && !editorial.format);
                    const isServiceOk =
                        (elem.service && editorial.service && elem.service === editorial.service) ||
                        (!elem.service && !editorial.service);
                    return isFormatOk && isServiceOk;
                }
                return false;
            });

        if (index !== null && index >= 0) {
            const cleanEditorial = cleanObject(editorial);
            const isUpdated = Object.keys(cleanEditorial).some(
                item => !isEqual(initialValues.editorialMetadata[index]?.[item], cleanEditorial?.[item])
            );
            values.editorialMetadata[index] = {
                ...values.editorialMetadata[index],
                ...editorial,
                isUpdated,
            };
        }

        values.editorialMetadata.forEach((emet, i) => {
            if (!emet.isDeleted && i !== index && !isEqual(emet, initialValues.editorialMetadata[i])) {
                values.editorialMetadata[i] = {...emet, isUpdated: true};
            }
            if (emet.isDeleted) {
                values.editorialMetadata[i] = {...emet, metadataStatus: 'deleted', isUpdated: true};
            }
        });
    }
};

const handleDirtyTMETValues = (initialValues, values) => {
    const territorial = get(values, 'territorial');
    const territorialMetadata = get(values, 'territorialMetadata');

    if (territorialMetadata.length) {
        values.territorialMetadata = territorialMetadata.map((elem, i) => {
            const cleanTerritorial = cleanObject(elem);
            const isUpdated = Object.keys(cleanTerritorial).some(
                item => !isEqual(initialValues.territorialMetadata[i]?.[item], cleanTerritorial?.[item])
            );
            return {
                ...elem,
                isUpdated,
            };
        });
    }
    if (territorial) {
        const index =
            values.territorialMetadata &&
            values.territorialMetadata.findIndex(elem => elem.locale === territorial.locale);
        if (index !== null && index >= 0) {
            const updatedTmetRecord = {
                ...values.territorialMetadata[index],
                ...territorial,
            };

            delete updatedTmetRecord.isUpdated;
            const cleanTerritorial = cleanObject(updatedTmetRecord);
            updatedTmetRecord.isUpdated = Object.keys(cleanTerritorial).some(
                item => !isEqual(initialValues.territorialMetadata[index]?.[item], cleanTerritorial?.[item])
            );
            values.territorialMetadata[index] = updatedTmetRecord;
        }
    }
};
