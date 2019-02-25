import Http from '../../../util/Http';
import config from 'react-global-configuration';
import store from '../../../stores/index';
import {loadAvailsMapping, loadSelectLists} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';

const http = Http.create({noDefaultErrorHandling: true});

const getAvailsMapping = () => {    
    return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/mapping-data');
};

const getSelectValues = (field) => {
    return http.get(config.get('gateway.configuration') + '/configuration-api/v1/' + field + '?page=0&size=10000');
};

const selectFields = {
    'genres': {
    },
    'licensor': {
       endpoint: 'licensors'
    },
    'studio': {
        endpoint: 'studios'
    },
    'territory': {
        endpoint: 'territories'
    },
    'format': {
        endpoint: 'formats'
    },
    'rating': {
        endpoint: 'ratings'
    },
    'releaseType': {
        endpoint: 'license-rights-desc'
    },
    'availType': {
        endpoint: 'content-type'
    },
    'foreignLanguage': {
        endpoint: ''
    }
};

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                response.data.mappings.map((rec) => {
                    if(selectFields[rec.javaVariableName]){
                        rec.dataType = 'select';
                    }

                    if(rec.dataType === 'select'){
                        let endpoint = selectFields[rec.javaVariableName].endpoint != null ? selectFields[rec.javaVariableName].endpoint : rec.javaVariableName;
                        if(endpoint) {
                            getSelectValues(endpoint).then((response) => {
                                store.dispatch(loadSelectLists(rec.javaVariableName, response.data.data));
                            });
                        }
                    }
                });
                store.dispatch(loadAvailsMapping({mappings: response.data.mappings.filter((mapping) => (mapping.displayName))}));
            }).catch((error) => {         
                errorModal.open('Error', () => {}, { description: 'System is not configured correctly!', closable: false });
                console.error('Unable to load AvailsMapping');
                console.error(error);
            });
        } 
    },
};