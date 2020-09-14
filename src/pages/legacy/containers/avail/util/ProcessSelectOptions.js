import {AUDIO_TYPES, COUNTRIES, GENRES, LANGUAGES, PRODUCTION_STUDIOS, RATINGS, REGION, SORT_TYPE} from '../constants';
import {getSortedData} from '../../../../../util/Common';

export const processOptions = (value, configEndpoint) => {
    let options;
    switch (configEndpoint) {
        case PRODUCTION_STUDIOS:
            options = value.map(code => {
                return {value: code.name, label: code.name};
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        case LANGUAGES:
            options = value.map(code => {
                return {value: code.languageCode, label: code.languageName};
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        case REGION:
            options = value.map(code => {
                return {value: code.regionCode, label: code.regionName};
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        case GENRES:
            options = value.map(code => {
                return {value: code.name, label: code.name};
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        case COUNTRIES:
            options = value.map(code => {
                return {value: code.countryCode, label: code.countryName};
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        case RATINGS:
            options = value.map(code => {
                return {
                    value: code.value,
                    label: code.ratingSystem + ' - ' + code.value,
                    'rating.ratingSystem': code.ratingSystem,
                };
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        case AUDIO_TYPES:
            options = value.map(code => {
                return {value: code.value, label: code.value};
            });
            options = getSortedData(options, SORT_TYPE, true);
            break;
        default:
            options = value.map(item => {
                return {...item, value: item.name || item.value, label: item.name || item.value};
            });
            options = getSortedData(options, SORT_TYPE, true);
    }
    return options;
};

export const createAliasValue = (options = []) => {
    return options
        .filter(rec => rec.value)
        .map(rec => {
            return {
                ...rec,
                label: rec.label || rec.value,
                aliasValue: rec.aliasId
                    ? options.filter(pair => rec.aliasId === pair.id).length === 1
                        ? options.filter(pair => rec.aliasId === pair.id)[0].value
                        : null
                    : null,
            };
        });
};
