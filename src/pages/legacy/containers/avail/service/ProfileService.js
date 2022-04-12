import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {store} from '../../../../../index';
import {loadAvailsMapping, loadSelectLists} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {storeConfigValues} from './endpointConfigActions';
import {isEmpty} from 'lodash';

const getAvailsMapping = () => {
    return nexusFetch('/availMapping.json', {isWithErrorHandling: false});
};

const getSelectValues = (field, alternateSelector, isInitAvailsMappingFlow = false, javaVariableName) => {
    const url = `${getConfig('gateway.configuration')}${getConfig(
        'gateway.service.configuration'
    )}${field}?page=0&size=10000`;

    const key = field.replace('/', '');
    const availsStoredEndpoints = store.getState().avails?.rightDetailsOptions?.selectValues?.[alternateSelector];

    if (
        (isEmpty(availsStoredEndpoints) && isEmpty(store.getState().endpointConfigValues?.[key])) ||
        isInitAvailsMappingFlow
    ) {
        return nexusFetch(url, {isWithErrorHandling: false})
            .then(response => {
                if (isInitAvailsMappingFlow) {
                    store.dispatch(loadSelectLists(alternateSelector, response.data));
                } else {
                    store.dispatch(storeConfigValues({[key]: response.data}));
                }
            })
            .catch(err => {
                store.dispatch(
                    addToast({
                        detail: `${err.type}, you failed to get the field ${key}.`,
                        severity: 'error',
                    })
                );
            });
    } else {
        return !isEmpty(availsStoredEndpoints) ? availsStoredEndpoints : store.getState().endpointConfigValues?.[key];
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
                                    if (!fields.includes(rec.alternateSelector)) {
                                        fields.push(rec.alternateSelector);
                                        getSelectValues(
                                            rec.configEndpoint,
                                            rec.alternateSelector,
                                            true,
                                            rec.javaVariableName
                                        );
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
