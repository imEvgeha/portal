import {cloneDeep} from 'lodash';
import {titleService} from './titleMetadataServices';
import {NEXUS, VZ, MOVIDA, FIELDS_TO_REMOVE} from './constants';

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

export const handleEditorialGenres = data => {
    const newData = cloneDeep(data);
    return newData.map(record => {
        const {genres} = record;
        if (genres) {
            const formattedGenres = [];
            genres.forEach(genre => {
                formattedGenres.push(genre.genre);
            });
            record.genres = formattedGenres;
        }
        return record;
    });
};

export const prepareValuesForTitleUpdate = values => {
    const newExternalIds = {};
    Object.keys(values).forEach(key => {
        if (key.includes('externalIds.')) {
            const [external, prop] = key.split('.');
            newExternalIds[prop] = values[key] || null;
            delete values[key];
        } else if (FIELDS_TO_REMOVE.includes(key)) {
            delete values[key];
        }
    });
    values.externalIds = newExternalIds;
    return values;
};
