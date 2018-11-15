import Http from '../../util/Http';
import config from 'react-global-configuration';
import store from '../../stores';
import {loadAvailsMapping} from '../../actions';
import {errorModal} from '../../components/share/ErrorModal';

const http = Http.create({noDefaultErrorHandling : true});

const getAvailsMapping = () => {
    return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/mapping-data');
};

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                store.dispatch(loadAvailsMapping({mappings: response.data.mappings.filter((mapping) => (mapping.displayName))}));
            }). catch((error) => {
                errorModal.open('Error', () => {}, {description: 'System is not configured correctly!'});
                console.error('Unable to load AvailsMapping');
                console.error(error);
            });
        } 
    },
};