import moment from 'moment';
import {DIRECTOR, isCastPersonType} from '../../../../constants/metadata/configAPI';
import {TIMESTAMP_FORMAT} from '../../../nexus-date-and-time-elements/constants';
import {getDateFormatBasedOnLocale, parseSimulcast} from '../../../../util/Common';
import {store} from '../../../../index';

const createValueFormatter = ({dataType, javaVariableName}) => {
    const {locale} = store.getState().localeReducer;

    // Create date placeholder based on locale
    const dateFormat = getDateFormatBasedOnLocale(locale);

    switch (dataType) {
        case 'localdate':
        case 'datetime':
            return (params) => {
                const {data = {}} = params || {};
                const {[javaVariableName]: date = ''} = data || {};
                const isUTC = typeof date === 'string' && date.endsWith('Z');

                return moment(date).isValid()
                    ? `${moment(date).utc(!isUTC).format(dateFormat)} 
                       ${moment(date).utc(!isUTC).format(TIMESTAMP_FORMAT)}`
                    : '';
            };
        case 'date':
            return (params) => {
                const {data = {}} = params || {};
                const {[javaVariableName]: date} = data || {};
                return parseSimulcast(date, dateFormat, false);
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
        case 'territoryType':
            return (params) => {
                const {data = {}} = params || {};
                if (data && Array.isArray(data[javaVariableName])) {
                    return data[javaVariableName].filter(Boolean).map(e => String(e.country)).join(', ');
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

