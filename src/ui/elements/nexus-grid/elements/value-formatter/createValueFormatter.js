import {camelCase, startCase} from 'lodash';
import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';

const createValueFormatter = ({dataType, javaVariableName, isEmphasized}) => {
    switch (dataType) {
        case DATETIME_FIELDS.TIMESTAMP:
        case DATETIME_FIELDS.BUSINESS_DATETIME:
        case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
            return params => {
                const {data = {}} = params || {};
                const {[javaVariableName]: date = ''} = data || {};
                return ISODateToView(date, dataType);
            };

        case 'select':
            if (javaVariableName === 'contentType') {
                return params => {
                    const {data = {}} = params || {};

                    if (data && data[javaVariableName]) {
                        return `${data[javaVariableName].slice(0, 1)}${data[javaVariableName].slice(1).toLowerCase()}`;
                    }
                };
            }
            return params => {
                const {data = {}} = params || {};

                if (data && data[javaVariableName]) {
                    // Capitalizes every word and removes non-alphanumeric characters if string is emphasized

                    return isEmphasized ? startCase(camelCase(data[javaVariableName])) : data[javaVariableName];
                }
            };

        case 'priceType':
            return params => {
                const {data = {}} = params || {};
                if (data && Array.isArray(data[javaVariableName])) {
                    return data[javaVariableName]
                        .filter(Boolean)
                        .map(e => String(`${e.priceType || ''} ${e.priceValue || ''} ${e.priceCurrency || ''}`))
                        .join(', ');
                }
            };
        case 'boolean':
            return ({value}) => {
                if (javaVariableName === 'updatedCatalogReceived' || javaVariableName === 'bonusRight') {
                    switch (value) {
                        case true:
                        case 'true':
                            return 'Yes';
                        case false:
                        case 'false':
                            return 'No';
                        default:
                            return value;
                    }
                }
                return value;
            };
        case 'territoryType':
        case 'audioLanguageType':
            return params => {
                const {data = {}} = params || {};
                if (data && Array.isArray(data[javaVariableName])) {
                    return data[javaVariableName]
                        .filter(Boolean)
                        .map(e => String(e.country || `${e.language}/${e.audioType}`))
                        .join(', ');
                }
            };
        case 'territory.selected':
            return params => {
                const {data = {}} = params || {};
                if (data && Array.isArray(data[javaVariableName])) {
                    const items = data[javaVariableName]
                        .filter(item => item.selected)
                        .map(item => item.country)
                        .join(', ');
                    return [items];
                }
            };
        case 'string':
            if (javaVariableName && javaVariableName.startsWith('castCrew')) {
                return params => {
                    const {data = {}} = params || {};
                    if (data && data['castCrew']) {
                        return data['castCrew']
                            .map(({personType, displayName}) => `${personType}: ${displayName}`)
                            .join('; ');
                    }
                };
            } else if (javaVariableName === 'ratings') {
                return params => {
                    const {data = {}} = params || {};
                    if (data && data[javaVariableName]) {
                        return data[javaVariableName]
                            .map(({ratingSystem, rating}) => `${ratingSystem || 'Empty'} ${rating || 'Empty'}`)
                            .join(', ');
                    }
                };
            } else if (javaVariableName && javaVariableName.startsWith('externalIds')) {
                return params => {
                    const {data = {}} = params || {};
                    const {externalIds} = data || {};
                    const [, key] = javaVariableName.split('.');
                    if (externalIds && externalIds[key]) {
                        return externalIds[key];
                    }
                };
            } else if (javaVariableName === 'system') {
                return params => {
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
                    }
                    return `Nexus Title ID: ${id}`;
                };
            } else if (javaVariableName === 'editorialGenres') {
                return params => {
                    const {data = {}} = params || {};
                    if (data && data[javaVariableName]) {
                        return data[javaVariableName].map(({genre}) => genre).join(', ');
                    }
                };
            }
            return;
        case 'yesOrNo':
            return ({value}) => {
                // HACK: ag-grid converts boolean values to string when calling this function to format the filter
                switch (value) {
                    case true:
                    case 'true':
                        return 'Yes';
                    case false:
                    case 'false':
                        return 'No';
                    default:
                        return value;
                }
            };
        case 'dropdown':
            return ({value}) => {
                let result = [];
                if (Array.isArray(value)) {
                    result = value.filter(option => option.selected).map(option => option.country);
                }
                return result;
            };
        default:
            return ({value}) => value;
    }
};

export default createValueFormatter;
