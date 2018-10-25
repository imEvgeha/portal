import Http from '../../util/Http';
import {BASE_PATH, GATEWAY_URL, AVAILS_UPLOAD_HTTP_TIMEOUT} from '../../constants/config';

const http = Http.create({baseURL: GATEWAY_URL + BASE_PATH});

export const uploadService = {

    uploadAvail: (file) => {
        const formData = new FormData();
        formData.append('avail', file);
        http.defaults.timeout = AVAILS_UPLOAD_HTTP_TIMEOUT;
        return http.post('/avails/upload', formData,  {headers: {'Content-Type': 'multipart/form-data'}});
    },

};