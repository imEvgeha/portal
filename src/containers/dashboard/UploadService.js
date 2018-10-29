import Http from '../../util/Http';
import config from 'react-global-configuration';
import {BASE_URL} from '../../index';

const http = Http.create();

export const uploadService = {
    uploadAvail: (file) => {
        const formData = new FormData();
        formData.append('avail', file);
        http.defaults.timeout = config.get('avails.upload.http.timeout');
        return http.post(BASE_URL + '/avails/upload', formData,  {headers: {'Content-Type': 'multipart/form-data'}});
    },

};