import Http from '../../../util/Http';
import config from 'react-global-configuration';

const http = Http.create();

export const uploadService = {
    uploadAvail: (file, externalId, setUploadedPercentage, params = {}) => {
        const formData = new FormData();
        formData.append('avail', file);
        const options = {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
        };
        if(setUploadedPercentage) {
            options.onUploadProgress = (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentCompleted = Math.round((loaded * 100) / total);
                setUploadedPercentage(percentCompleted);
            };
        }
        http.defaults.timeout = config.get('avails.upload.http.timeout');
        if(externalId){
            params.externalId = externalId;
        }
        const queryParams = new URLSearchParams({...params}).toString();
        return http.post(config.get('gateway.url') +
            config.get('gateway.service.avails') + '/avails/upload' +
            (queryParams && `?${queryParams}`),
            formData,  options
        );
    },

};