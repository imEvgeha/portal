import {titleService} from './titleMetadataServices';
import {NEXUS, VZ, MOVIDA} from './constants';

export const fetchTitleMetadata = async (searchCriteria, offset, limit, sortedParams) => {
    try {
        const response = await titleService.advancedSearch(searchCriteria, offset, limit, sortedParams);
        console.log(response);
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
            } = obj || {};
            const repository = id.includes('vztitl_') ? VZ : id.includes('movtitl_') ? MOVIDA : NEXUS;
            return [
                ...acc,
                {
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
