import Http from '../../../util/Http';
import config from 'react-global-configuration';

const http = Http.create();

export const uploadService = {
    uploadAvail: (file, externalId, setUploadedPercentage) => {
        const formData = new FormData();
        formData.append('avail', file);
        const options = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              let percentCompleted = Math.round((loaded * 100) / total);
              setUploadedPercentage(percentCompleted);
            },
        };
        http.defaults.timeout = config.get('avails.upload.http.timeout');
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') + '/avails/upload' + (externalId ? '?externalId=' + externalId : ''), formData,  options);
    },

};