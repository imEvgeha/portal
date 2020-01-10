import moment from 'moment';
import {DIRECTOR, isCastPersonType} from '../../../../constants/metadata/configAPI';
import {TIMESTAMP_FORMAT} from '../../../nexus-date-and-time-elements/constants';
import {getDateFormatBasedOnLocale} from '../../../../util/Common';
import {store} from '../../../../index';

const createValueFormatter = ({dataType, javaVariableName}, locale) => {
    const {locale: locale1} = store.getState().localeReducer;
    console.log(locale1)

    // Create date placeholder based on locale
    const dateFormat = getDateFormatBasedOnLocale(locale);

    switch (dataType) {
        case 'localdate':
        case 'datetime':
            return (params) => {
                const {data = {}} = params || {};
                if (data[javaVariableName]) {
                    return `${moment(data[javaVariableName]).format(dateFormat)} ${moment(data[javaVariableName]).format(TIMESTAMP_FORMAT)}`;
                }
            };
        case 'date':
            return (params) => {
                const {data = {}} = params || {};
                if ((data[javaVariableName]) && moment(data[javaVariableName].toString().substr(0, 10)).isValid()) {
                    return moment(data[javaVariableName].toString().substr(0, 10)).format(dateFormat);
                }
            };
        case 'territoryType':
            return (params) => {
                const {data = {}} = params || {};
                if (data && data[javaVariableName]) {
                    return data[javaVariableName].filter(Boolean).map(e => String(e.country)).join(', ');
                }
            };
        case 'string':
            if (javaVariableName && javaVariableName.startsWith('castCrew.')) {
                return (params) => {
                    const {data = {}} = params || {};
                    const key = javaVariableName.split('.')[1];
                    if (data['castCrew']) {
                        if (key === 'director') {
                            return data['castCrew']
                                .filter(({personType}) => personType.toLowerCase() === DIRECTOR.toLowerCase())
                                .map(({displayName}) => displayName)
                                .join(', ');
                        } else if (key === 'cast') {
                            return data['castCrew']
                                .filter(castCrew => isCastPersonType(castCrew, false))
                                .map(({personType, displayName}) => `${personType}: ${displayName}`)
                                .join('; ');
                        }
                    }
                };
            } else if (javaVariableName === 'ratings') {
                return (params) => {
                    const {data = {}} = params || {};
                    if (data[javaVariableName]) {
                        return data[javaVariableName]
                            .map(({ratingSystem, rating}) => `${ratingSystem ? ratingSystem : 'Empty'} ${rating ? rating : 'Empty'}`)
                            .join(', ');
                    }
                };
            } else if (javaVariableName && javaVariableName.startsWith('externalIds')) {
                return (params) => {
                    const {data = {}} = params || {};
                    const {externalIds} = data;
                    const key = javaVariableName.split('.')[1];
                    if (externalIds && externalIds[key]) {
                        return externalIds[key];
                    }
                };
            } else if (javaVariableName === 'system') {
                return (params) => {
                    const {data: {id, legacyIds = {}} = {}} = params || {};
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
                    if (data[javaVariableName]) {
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

