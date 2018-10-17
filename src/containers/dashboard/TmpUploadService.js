import Http from "../../util/Http";

const http = Http.create({baseURL: 'http://usla-amm-d001.dev.vubiquity.com:8082'});

export const tmpUploadService = {
    uploadAvail: (file) => {
        const formData = new FormData();
        formData.append("avail", file);
        return http.post('/avails', formData,  {headers: {'Content-Type': 'multipart/form-data'}});
    },

};