import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {isString} from 'lodash';

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
            config.get('gateway.url') +
            config.get('gateway.service.avails') +
            '/avails/upload' +
            (queryParams && `?${queryParams}`);
        const abortAfter = config.get('avails.upload.http.timeout');

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
