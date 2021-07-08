import {
    ERROR_ICON,
    ERROR_TITLE,
    SUCCESS_ICON,
    SUCCESS_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {cloneDeep, get, isObjectLike, isEqual} from 'lodash';
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

export const isMgmTitle = titleId => {
    return titleId && (titleId.startsWith('titl_mgm') || titleId.startsWith('titl_MGM'));
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
                episodic = {},
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

export const prepareAwardsField = data => {
    if (get(data, 'awards')) {
        return data.awards.map(award => ({
            id: award,
        }));
    }
};

export const handleEditorialGenresAndCategory = (data, fieldName, key) => {
    const newData = cloneDeep(data);
    return newData.map(record => {
        const field = record[fieldName];
        if (field) {
            const formattedValues = [];
            field.forEach(obj => {
                if(record?.language !== obj?.language && key === 'genre')
                    formattedValues.push(`(${obj[key]})*`);
                else
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
    if (body.isDeleted) {
        body.metadataStatus = 'deleted';
    }
    delete body.isUpdated;
    delete body.isDeleted;
    delete body.isCreated;
    return body;
};

export const updateTerritoryMetadata = async (values, titleId) => {
    const data = values.territorialMetadata || [];
    const {catalogOwner: tenantCode} = values;
    try {
        // eslint-disable-next-line init-declarations
        let response;
        await Promise.all(
            data.map(async tmet => {
                if ((get(tmet, 'isUpdated') || get(tmet, 'isDeleted')) && !get(tmet, 'isCreated')) {
                    const body = formatTerritoryBody(tmet);
                    response = await titleService.updateTerritoryMetadata(body, tenantCode);
                } else if (get(tmet, 'isCreated') && !get(tmet, 'isDeleted')) {
                    const body = formatTerritoryBody(tmet, titleId);
                    response = await titleService.addTerritoryMetadata(body, tenantCode);
                }
            })
        );
        if (response) {
            const isMgm = isMgmTitle(titleId);
            store.dispatch(getTerritoryMetadata({id: titleId, isMgm}));
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

export const formatEditorialBody = (data, titleId, isCreate, genresConfigValues = []) => {
    const body = {};
    Object.keys(data).forEach(key => {
        if (data[key] === undefined || data[key] === '') body[key] = null;
        else if (key === 'genres') {
            body[key] =
                data[key] &&
                data[key].map((genre, i) => {
                    let genreValue = genre;
                    if (isObjectLike(genre) && get(genre, 'value')) {
                        genreValue = get(genre, 'value');
                    }
                    genreValue = genreValue.split('(').join('').split(')')[0]; // extract en genre from i.e. "(Abstract)*"
                    const genreObj = genresConfigValues.find(item => item.name === genreValue);
                    return {
                        id: get(genreObj, 'id'),
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
                        category: categoryValue,
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

export const updateEditorialMetadata = async (values, titleId, genresConfigValues = []) => {
    let response = [];
    const errorToast = {
        title: ERROR_TITLE,
        icon: ERROR_ICON,
        isAutoDismiss: true,
        description: UPDATE_EDITORIAL_METADATA_ERROR,
    };
    const data = values.editorialMetadata || [];
    const {catalogOwner: tenantCode} = values;
    try {
        await Promise.all(
            data.map(async emet => {
                if ((get(emet, 'isUpdated') || get(emet, 'isDeleted')) && !get(emet, 'isCreated')) {
                    const body = formatEditorialBody(emet, titleId, false, genresConfigValues);
                    response = await titleService.updateEditorialMetadata(body, tenantCode);
                } else if (get(emet, 'isCreated') && !get(emet, 'isDeleted')) {
                    const body = formatEditorialBody(emet, titleId, true, genresConfigValues);
                    response = await titleService.addEditorialMetadata(body, tenantCode);
                }
            })
        );
        if (response && response.length > 0) {
            let toast = errorToast;
            if (!get(response[0], 'response.failed') || get(response[0], 'response.failed').length === 0) {
                const isMgm = isMgmTitle(titleId);
                store.dispatch(getEditorialMetadata({id: titleId, isMgm}));
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

export const handleDirtyValues = (initialValues, values) => {
    handleDirtyRatingsValues(values);
    handleDirtyEMETValues(initialValues, values);
    handleDirtyTMETValues(values);
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
    const index = values.ratings && values.ratings.findIndex(elem => elem.ratingSystem === ratingSystem);
    if (index !== null && index >= 0) {
        values.ratings[index] = updatedRatingRecord;
    }
};

const handleDirtyEMETValues = (initialValues, values) => {
    const editorial = get(values, 'editorial');
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
            const updatedEmetRecord = {
                ...values.editorialMetadata[index],
                ...editorial,
                isUpdated: true,
            };
            values.editorialMetadata[index] = updatedEmetRecord;
        }

        values.editorialMetadata.forEach((emet, i) => {
            if (!emet.isDeleted && i !== index && !isEqual(emet, initialValues.editorialMetadata[i])) {
                values.editorialMetadata[i] = {...emet, isUpdated: true};
            }
        });
    }
};

const handleDirtyTMETValues = values => {
    const territorial = get(values, 'territorial');
    if (territorial) {
        const index =
            values.territorialMetadata &&
            values.territorialMetadata.findIndex(elem => elem.locale === territorial.locale);
        if (index !== null && index >= 0) {
            const updatedTmetRecord = {
                ...values.territorialMetadata[index],
                ...territorial,
                isUpdated: true,
            };
            values.territorialMetadata[index] = updatedTmetRecord;
        }
    }
};
