import Http from '../../../util/Http';
import config from 'react-global-configuration';
import store from '../../../stores/index';
import {loadAvailsMapping, loadSelectLists} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';

const http = Http.create({noDefaultErrorHandling: true});

const getAvailsMapping = () => {
    return http.get('/profile/availMapping.json');
    //return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/mapping-data');
};

const getSelectValues = (field) => {
    return http.get(config.get('gateway.configuration') + '/configuration-api/v1' + field + '?page=0&size=10000');
};

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                //console.log(response);
                response.data.mappings.map((rec) => {
                    if(rec.dataType === 'select' || rec.dataType === 'multiselect'){
                        if(rec.options){
                            store.dispatch(loadSelectLists(rec.javaVariableName, rec.options));
                        }else {
                            if(rec.configEndpoint) {
                                getSelectValues(rec.configEndpoint).then((response) => {
                                    store.dispatch(loadSelectLists(rec.javaVariableName, response.data.data));
                                });
                            }else{
                                console.warn('MISSING options or endpoint: for ', rec.javaVariableName);
                            }
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