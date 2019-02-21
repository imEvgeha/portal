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
}

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                response.data.mappings.map((rec) => {
                    if(rec.javaVariableName === 'genres' || rec.javaVariableName === 'licensor') {
                        rec.dataType = 'select';
                    }

                    if(rec.dataType === 'select'){
                        let endpoint = rec.javaVariableName;
                        if(rec.javaVariableName === 'licensor'){
                            endpoint = 'licensors';
                        }
                        getSelectValues(endpoint).then((response) => {
                            store.dispatch(loadSelectLists(rec.javaVariableName, response.data.data));
                        });
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