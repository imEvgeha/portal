import Http from '../../util/Http';
import config from 'react-global-configuration';
import store from '../../stores';
import {loadAvailsMapping} from '../../actions';

const http = Http.create();

const getAvailsMapping = () => {
    return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/mapping-data');
};

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                store.dispatch(loadAvailsMapping(response.data));
            }). catch((error) => {
                console.error('Unable to load AvailsMapping');
                console.error(error);
            });
        }
    },
};