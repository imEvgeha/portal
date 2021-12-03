import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import config from 'react-global-configuration';
import {nexusFetch} from '../../../util/http-client';

// currently FETCH API doesn't support upload progress calculation
// for upload progress we should switch upload to XHR (XMLHttpRequest) or
// some of the extrenal package e.g. https://www.npmjs.com/package/fetch-progress

export const uploadService = {
    uploadMetadata: ({file, externalId, params = {}}) => {
        const {token} = keycloak || {};
        const formData = new FormData();
        formData.append('file', file);
        if (externalId) {
            params.externalId = externalId;
        }
        // do not remove options cuz we need it for request
        const options = {
            headers: {
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
        };
        const queryParams = new URLSearchParams({...params}).toString();
        const url = `${config.get('gateway.titleUrl') + config.get('gateway.service.title')}/editorialmetadata/upload${
            queryParams && `?${queryParams}`
        }`;
        const abortAfter = config.get('title.upload.http.timeout');
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
