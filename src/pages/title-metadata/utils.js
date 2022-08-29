import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {getDomainName} from '@vubiquity-nexus/portal-utils/lib/Common';
import {cloneDeep, get, isArray, isEqual, isObjectLike} from 'lodash';
import {store} from '../../index';
import TitleService from './services/TitleService';
import TitleTerittorialService from './services/TitleTerittorialService';
import {getTerritoryMetadata} from './titleMetadataActions';
import {
    MOVIDA,
    NEXUS,
    PROPAGATE_SEASON_PERSONS_SUCCESS,
    UPDATE_TERRITORY_METADATA_ERROR,
    UPDATE_TERRITORY_METADATA_SUCCESS,
    VZ,
} from './constants';

const titleServiceSingleton = TitleService.getInstance();
const titleTerritorialService = TitleTerittorialService.getInstance();

export const onViewTitleClick = (titleId, realm) => {
    const url = `${getDomainName()}/${realm}/metadata/detail/${titleId}`;
    window.open(url, '_blank');
};

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
        const response = await titleServiceSingleton.advancedSearchTitles(
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

export const formatTerritoryBody = data => {
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
                    response = await titleTerritorialService.update(body, titleId, tmetId);
                } else if (get(tmet, 'isCreated') && !get(tmet, 'isDeleted')) {
                    const body = formatTerritoryBody(tmet);
                    // POST is on V2
                    response = await titleTerritorialService.create(body, titleId);
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
        } else if (key === 'categories') {
            body[key] =
                data[key] &&
                data[key].map((categories, index) => {
                    let categoryValue = categories;
                    if (isObjectLike(categories) && get(categories, 'value')) {
                        categoryValue = get(categories, 'value');
                    }
                    return {
                        name: categoryValue,
                        order: index,
                    };
                });
        } else if (key === 'tenantData') {
            body[key] = data?.tenantData;
            return body[key];
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
              decorateEditorialMetadata: hasGeneratedChildren,
              ...body,
          }
        : {
              itemIndex: null,
              body,
          };
};

export const propagateSeasonsPersonsToEpisodes = (data, id) => {
    return titleServiceSingleton
        .propagateSeasonsPersonsToEpisodes({
            ...data,
            seasonId: id,
        })
        .then(response => {
            let toast = {
                severity: 'success',
                detail: PROPAGATE_SEASON_PERSONS_SUCCESS,
            };
            if (response.error) {
                toast = {
                    severity: 'error',
                    detail: response.error,
                };
            }
            store.dispatch(addToast(...toast));
        });
};

export const handleDirtyValues = (initialValues, values) => {
    const cleanValues = cleanObject(values);
    const updatedInitialValues = {
        ...initialValues,
        rating: values?.ratings?.[0]?.rating,
        ratingSystem: values?.ratings?.[0]?.ratingSystem,
        advisoriesCode: values?.ratings?.[0]?.advisoriesCode,
        advisoriesFreeText: values?.ratings?.[0]?.advisoriesFreeText,
    };
    const unnecessaryValues = [
        'vzExternalIds',
        'movidaExternalIds',
        'editorial',
        'movidaUkExternalIds',
        'territorial',
        'editorialMetadata',
        'territorialMetadata',
        'boxOfficeOpen',
    ];

    const isTitleChanged = [...Object.keys(cleanValues), 'ratings']?.some(item => {
        const initialItem = updatedInitialValues?.[item] === undefined ? null : updatedInitialValues?.[item];
        const cleanItem = cleanValues?.[item];
        if (unnecessaryValues.includes(item)) {
            return false;
        }
        if (isArray(initialItem) && isArray(cleanItem)) {
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
            values.editorialMetadata?.findIndex(elem => {
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
            editorial.tenantData = handleDirtySasktelValues(initialValues, values);

            const cleanEditorial = cleanObject(editorial);
            const isUpdated = Object.keys(cleanEditorial)?.some(item => {
                if (item === 'tenantData') {
                    return false;
                }
                return !isEqual(initialValues.editorialMetadata[index]?.[item], cleanEditorial?.[item]);
            });

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

const handleDirtySasktelValues = (initialValues, values) => {
    let mergedArray = [];
    const newTenantDataValues = [];
    const sasktelInventoryId = values?.editorial?.sasktelInventoryId || [];
    const sasktelLineupId = values?.editorial?.sasktelLineupId || [];
    const masterEmet = values.editorialMetadata.find(e =>
        e?.tenantData?.complexProperties?.find(e => e?.simpleProperties.find(e => e.name === 'hasGeneratedChildren'))
    );

    if (masterEmet) {
        return masterEmet?.tenantData;
    }

    if (Array.isArray(sasktelInventoryId) && Array.isArray(sasktelLineupId)) {
        mergedArray = sasktelInventoryId.concat(sasktelLineupId.filter(item => sasktelInventoryId.indexOf(item) < 0));
    }
    if (typeof sasktelInventoryId === 'string') {
        newTenantDataValues.push({
            name: 'sasktelInventoryId',
            value: sasktelInventoryId,
        });
    }
    if (typeof sasktelLineupId === 'string') {
        newTenantDataValues.push({
            name: 'sasktelLineupId',
            value: sasktelLineupId,
        });
    }
    if (Array.isArray(sasktelInventoryId) && !Array.isArray(sasktelLineupId)) {
        mergedArray = newTenantDataValues.concat(
            sasktelInventoryId.filter(item => newTenantDataValues.indexOf(item) < 0)
        );
    }
    if (Array.isArray(sasktelLineupId) && !Array.isArray(sasktelInventoryId)) {
        mergedArray = newTenantDataValues.concat(sasktelLineupId.filter(item => newTenantDataValues.indexOf(item) < 0));
    }
    const finalArray = mergedArray?.length ? mergedArray : newTenantDataValues;
    const filteredValues = finalArray.filter(e => {
        return e.value;
    });

    const editorialMetadata = {
        simpleProperties: finalArray,
    };
    return filteredValues?.length ? editorialMetadata : null;
};

const handleDirtyTMETValues = (initialValues, values) => {
    const territorial = get(values, 'territorial');
    const territorialMetadata = get(values, 'territorialMetadata');

    if (territorialMetadata?.length) {
        values.territorialMetadata = territorialMetadata.map((elem, i) => {
            const cleanTerritorial = cleanObject(elem);
            const isUpdated = Object.keys(cleanTerritorial)?.some(
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
            values.territorialMetadata?.findIndex(elem => elem.locale === territorial.locale);
        if (index !== null && index >= 0) {
            const updatedTmetRecord = {
                ...values.territorialMetadata[index],
                ...territorial,
            };

            delete updatedTmetRecord.isUpdated;
            const cleanTerritorial = cleanObject(updatedTmetRecord);
            updatedTmetRecord.isUpdated = Object.keys(cleanTerritorial)?.some(
                item => !isEqual(initialValues.territorialMetadata[index]?.[item], cleanTerritorial?.[item])
            );
            values.territorialMetadata[index] = updatedTmetRecord;
        }
    }
};
