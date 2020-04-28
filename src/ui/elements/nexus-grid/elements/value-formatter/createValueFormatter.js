import {DATETIME_FIELDS, ISODateToView} from '../../../../../util/DateTimeUtils';

const createValueFormatter = ({dataType, javaVariableName}) => {
    switch (dataType) {
        case DATETIME_FIELDS.TIMESTAMP:
        case DATETIME_FIELDS.BUSINESS_DATETIME:
        case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
            return (params) => {
                const {data = {}} = params || {};
                const {[javaVariableName]: date = ''} = data || {};
                return ISODateToView(date, dataType);
            };
        case 'select':
            if (javaVariableName === 'contentType') {
                return (params) => {
                    const {data = {}} = params || {};
                    if (data && data[javaVariableName]) {
                        return `${data[javaVariableName].slice(0, 1)}${data[javaVariableName].slice(1).toLowerCase()}`;
                    }
                };
            }
            break;
        case 'territoryType':
        case 'audioLanguageType':
            return (params) => {
                const {data = {}} = params || {};
                if (data && Array.isArray(data[javaVariableName])) {
                    return data[javaVariableName]
                        .filter(Boolean)
                        .map(e => String(e.country || `${e.language}/${e.audioType}`)).join(', ');
                }
            };
        case 'string':
            if (javaVariableName && javaVariableName.startsWith('castCrew')) {
                return (params) => {
                    const {data = {}} = params || {};
                    if (data && data['castCrew']) {
                        return data['castCrew']
                            .map(({personType, displayName}) => `${personType}: ${displayName}`)
                            .join('; ');
                    }
                };
            } else if (javaVariableName === 'ratings') {
                return (params) => {
                    const {data = {}} = params || {};
                    if (data && data[javaVariableName]) {
                        return data[javaVariableName]
                            .map(({ratingSystem, rating}) => `${ratingSystem ? ratingSystem : 'Empty'} ${rating ? rating : 'Empty'}`)
                            .join(', ');
                    }
                };
            } else if (javaVariableName && javaVariableName.startsWith('externalIds')) {
                return (params) => {
                    const {data = {}} = params || {};
                    const {externalIds} = data || {};
                    const key = javaVariableName.split('.')[1];
                    if (externalIds && externalIds[key]) {
                        return externalIds[key];
                    }
                };
            } else if (javaVariableName === 'system') {
                return (params) => {
                    const {data = {}} = params || {};
                    const {id, legacyIds = {}} = data || {};
                    const {movida, vz} = legacyIds || {};
                    const {movidaTitleId} = movida || {};
                    const {vzTitleId} = vz || {};
                    if (movidaTitleId && vzTitleId) {
                        return `Movida Title ID: ${movidaTitleId}, VZ Title ID: ${vzTitleId}`;
                    } else if (movidaTitleId) {
                        return `Movida Title ID: ${movidaTitleId}`;
                    } else if (vzTitleId) {
                        return `VZ Title ID: ${vzTitleId}`;
                    } else
                        return `Nexus Title ID: ${id}`;
                };
            } else if (javaVariableName === 'editorialGenres') {
                return (params) => {
                    const {data = {}} = params || {};
                    if (data && data[javaVariableName]) {
                        return data[javaVariableName]
                            .map(({genre}) => genre)
                            .join(', ');
                    }
                };
            } 
            return;
        default:
            return null;
    }
};

export default createValueFormatter;

