import {getConfig} from "../config";
import {nexusFetch} from "../http-client";

// currently FETCH API doesn't support upload progress calculation
// for upload progress we should switch upload to XHR (XMLHttpRequest) or
// some of the extrenal package e.g. https://www.npmjs.com/package/fetch-progress

export const uploadService = {
    uploadMetadata: ({file, externalId, params = {}}) => {
        const formData = new FormData();
        formData.append('file', file);
        if (externalId) {
            params.externalId = externalId;
        }
        // do not remove options cuz we need it for request
        const queryParams = new URLSearchParams({...params}).toString();
        const url = `${getConfig('gateway.titleUrl') + getConfig('gateway.service.title')}/editorialmetadata/upload${
            queryParams && `?${queryParams}`
        }`;
        const abortAfter = getConfig('title.upload.http.timeout');
        return nexusFetch(
            url,
            {
                method: 'post',
                body: formData,
                file,
            },
            abortAfter
        );
    },
};
