import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {isString} from 'lodash';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {keycloak} from "@portal/portal-auth";

// currently FETCH API doesn't support upload progress calculation
// for upload progress we should switch upload to XHR (XMLHttpRequest) or
// some of the extrenal package e.g. https://www.npmjs.com/package/fetch-progress

export const uploadService = {
    uploadAvail: ({file, externalId, params = {}, ...rest}) => {
        const {token} = keycloak || {};
        const formData = new FormData();
        if (isString(file)) {
            formData.append('s3Link', file);
        } else {
            formData.append('avail', file);
        }
        const options = {
            headers: {
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
        };

        if (externalId) {
            params.externalId = externalId;
        }

        const queryParams = new URLSearchParams({...params}).toString();
        const url =
            getConfig('gateway.url') +
            getConfig('gateway.service.avails') +
            '/avails/upload' +
            (queryParams && `?${queryParams}`);
        const abortAfter = getConfig('avails.upload.http.timeout');

        return nexusFetch(
            url,
            {
                method: 'post',
                body: formData,
                ...options,
            },
            abortAfter
        );
    },
};
