import {nexusFetch} from '../../../../../util/http-client';
import config from 'react-global-configuration';
import {store} from '../../../../../index';
import { loadAvailsMapping, loadSelectLists } from '../../../stores/actions/index';
import { errorModal } from '../../../components/modal/ErrorModal';
import { getSortedData } from '../../../../../util/Common';

const PRODUCTION_STUDIOS = '/production-studios';
const AUDIO_TYPES = '/audio-types';
const LANGUAGES = '/languages';
const COUNTRIES = '/countries';
const REGION = '/regions';
const GENRES = '/genres';
const SORT_TYPE = 'label';

const getAvailsMapping = () => {
    return nexusFetch('/availMapping.json', {isWithErrorHandling: false});
};

const getSelectValues = (field) => {
    const url = config.get('gateway.configuration') + '/configuration-api/v1' + field + '?page=0&size=10000';
    return nexusFetch(url, {isWithErrorHandling: false});
};

export const profileService = {
    getAvailsMapping, 
    getSelectValues,
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then((response) => {
                response.mappings.map((rec) => {
                    if (rec.searchDataType === 'multiselect') {
                        if (rec.options) {
                            store.dispatch(loadSelectLists(rec.javaVariableName, rec.options.map((option) => { return { id: option, type: rec.javaVariableName, value: option }; })));
                        } else {
                            if (rec.configEndpoint) {
                                getSelectValues(rec.configEndpoint).then((response) => {
                                    let options = response.data;
                                    switch (rec.configEndpoint) {
                                        case GENRES:
                                            options = options.map(code => ({value: code.name, label: code.name}));
                                            options = getSortedData(options, SORT_TYPE, true);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                            break;
                                        case REGION:
                                            options = options.map(code => ({value: code.regionCode, label: code.regionName}));
                                            options = getSortedData(options, SORT_TYPE, true);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                            break;
                                        case PRODUCTION_STUDIOS:
                                            options.forEach((option) => option.value = option.name);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                            break;
                                        case LANGUAGES:
                                            options = options.map(code => ({value: code.languageCode, label: code.languageName}));
                                            options = getSortedData(options, SORT_TYPE, true);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                            break;
                                        case COUNTRIES:
                                            options = options.map(code => ({value: code.countryCode, label: code.countryName}));
                                            options = getSortedData(options, SORT_TYPE, true);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                            break;
                                        case AUDIO_TYPES:
                                            options = options.map(code => ({value: code.value, label: code.value}));
                                            options = getSortedData(options, SORT_TYPE, true);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                            break;
                                        default:
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                    }
                                });
                            } else {
                                console.warn('MISSING options or endpoint: for ', rec.javaVariableName);
                            }
                        }
                    }
                });
                store.dispatch(loadAvailsMapping({ mappings: response.mappings.filter((mapping) => (mapping.displayName)) }));
            }).catch((error) => {
                errorModal.open('Error', () => { }, { description: 'System is not configured correctly!', closable: false });
                console.error('Unable to load AvailsMapping');
                console.error(error);
            });
        }
    },
};
