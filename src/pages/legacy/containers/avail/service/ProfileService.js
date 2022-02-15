import {nexusFetch} from '../../../../../util/http-client';
import config from 'react-global-configuration';
import {store} from '../../../../../index';
import {loadAvailsMapping, loadSelectLists} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';
import {processOptions} from '../util/ProcessSelectOptions';
import {storeConfigValues} from './endpointConfigActions';
import {isEmpty} from 'lodash';

const getAvailsMapping = () => {
    return nexusFetch('/availMapping.json', {isWithErrorHandling: false});
};

const getSelectValues = field => {
    // store.dispatch(storeConfigValues());

    const url = `${config.get('gateway.configuration')}${config.get(
        'gateway.service.configuration'
    )}${field}?page=0&size=10000`;

    const key = field.replace('/', '');

    if (!isEmpty(store.getState().endpointConfigValues?.[key])) {
        return nexusFetch(url, {isWithErrorHandling: false}).then(response => {
            store.dispatch(storeConfigValues({[key]: response.data}));
        });
    } else {
        return store.getState().endpointConfigValues?.[key];
    }
};

export const profileService = {
    getAvailsMapping,
    getSelectValues,
    initAvailsMapping: forceReload => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping()
                .then(response => {
                    const fields = [];
                    response.mappings.map(rec => {
                        if (rec.searchDataType === 'multiselect') {
                            if (rec.options) {
                                store.dispatch(
                                    loadSelectLists(
                                        rec.javaVariableName,
                                        rec.options.map(option => {
                                            return {id: option, type: rec.javaVariableName, value: option};
                                        })
                                    )
                                );
                            } else {
                                if (rec.configEndpoint) {
                                    if (!fields.includes(rec.configEndpoint)) {
                                        fields.push(rec.configEndpoint);
                                        getSelectValues(rec.configEndpoint).then(response => {
                                            const options = processOptions(response.data, rec.configEndpoint);
                                            store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                        });
                                    }
                                } else {
                                    console.warn('MISSING options or endpoint: for ', rec.javaVariableName);
                                }
                            }
                        }
                    });
                    store.dispatch(
                        loadAvailsMapping({mappings: response.mappings.filter(mapping => mapping.displayName)})
                    );
                })
                .catch(error => {
                    errorModal.open('Error', () => {}, {
                        description: 'System is not configured correctly!',
                        closable: false,
                    });
                    console.error('Unable to load AvailsMapping');
                    console.error(error);
                });
        }
    },
};
