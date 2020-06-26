import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

const baseUrl = `${config.get('gateway.url')}${config.get('gateway.service.avails')}`;

export const getAffectedRights = params => {
    const url = `${baseUrl}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};

export const setCoreTitleId = ({rightIds, coreTitleId}) => {
    const url = `${baseUrl}/rights/coreTitleId?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    return nexusFetch(url, {method: 'PATCH'});
};
