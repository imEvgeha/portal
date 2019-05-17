import Http from '../../../util/Http';
import config from 'react-global-configuration';
import store from '../../../stores/index';
import {loadAvailsMapping, loadSelectLists} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';
import ISO6391 from 'iso-639-1';

const http = Http.create({noDefaultErrorHandling: true});

const getAvailsMapping = () => {
    return http.get('/availMapping.json');
};

const getSelectValues = (field) => {
    return http.get(config.get('gateway.configuration') + '/configuration-api/v1' + field + '?page=0&size=10000');
};

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                let collection = {};
                response.data.mappings.map((rec) => {

                    //sanity check
                    let field = rec.javaVariableName.split('.').pop();
                    if(collection[field]){
                        console.error('COLLISION BETWEEN FIELD\'s LAST PART DETECTED : ' + field + ' in ' + collection[field] + ' and ' + rec.javaVariableName);
                    }
                    collection[field] = rec.javaVariableName;
                    //end sanity check

                    if(rec.dataType === 'select' || rec.dataType === 'multiselect'){
                        if(rec.options){
                            store.dispatch(loadSelectLists(rec.javaVariableName, rec.options.map((option) => {return {id:option, type:rec.javaVariableName, value:option};})));
                        }else {
                            if(rec.configEndpoint) {
                                getSelectValues(rec.configEndpoint).then((response) => {
                                    if(rec.configEndpoint === '/production-studios'){
                                        let options = response.data.data;
                                        options.forEach((option) => option.value = option.name);
                                        store.dispatch(loadSelectLists(rec.javaVariableName, options));
                                    }else {
                                        store.dispatch(loadSelectLists(rec.javaVariableName, response.data.data));
                                    }
                                });
                            }else{
                                console.warn('MISSING options or endpoint: for ', rec.javaVariableName);
                            }
                        }
                    }
                    if(rec.dataType === 'language' || rec.dataType === 'multilanguage'){
                        store.dispatch(loadSelectLists(rec.javaVariableName, ISO6391.getAllCodes().map(code => {return {value:code, label:ISO6391.getName(code)};})));
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