import Http from '../../util/Http';

const http = Http.create({baseURL: 'http://usla-amm-d001.dev.vubiquity.com:8082/avails-api/v1'});

export const tmpUploadService = {
    uploadAvail: (file) => {
        const formData = new FormData();
        formData.append('avail', file);

        http.defaults.timeout = 30000;

        return http.post('/avails/upload', formData,  {headers: {'Content-Type': 'multipart/form-data'}});
    },
};