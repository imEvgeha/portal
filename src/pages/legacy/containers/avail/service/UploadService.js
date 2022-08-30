import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {isString} from 'lodash';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';

// currently FETCH API doesn't support upload progress calculation
// for upload progress we should switch upload to XHR (XMLHttpRequest) or
// some of the extrenal package e.g. https://www.npmjs.com/package/fetch-progress

export const uploadService = {
    uploadAvail: ({file, externalId, params = {}, ...rest}) => {
        const formData = new FormData();
        if (isString(file)) {
            formData.append('s3Link', file);
        } else {
            formData.append('avail', file);
        }

        if (externalId) {
            params.externalId = externalId;
        }

        const queryParams = new URLSearchParams({...params}).toString();
        const uri = '/avails/upload' + (queryParams && `?${queryParams}`);
        const url = getApiURI('avails', uri);

        return nexusFetch(url, {
            method: 'post',
            body: formData,
            file: {},
        });
    },
};
