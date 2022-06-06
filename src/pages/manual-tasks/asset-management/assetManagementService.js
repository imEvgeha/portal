import {keycloak} from '@portal/portal-auth';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';

export const fetchPosters = url => {
    const {token} = keycloak;
    const options = {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    return fetch(url, {
        method: 'GET',
        ...options,
    }).then(response => response.json().then(resp => resp));
};

export const fetchPoster = poster => {
    const options = {
        headers: {
            Authorization: `token ${localStorage.getItem('token')}`,
        },
    };
    return fetch(poster, {method: 'GET', ...options}).then(res => res.blob());
};

export const loginAssets = () => {
    const url = `${getConfig('gateway.kongUrl')}${getConfig(
        'gateway.service.kongVidispine'
    )}/token?seconds=1800&autoRefresh=true`;

    const options = {
        headers: {
            Accept: 'application/json',
            Authorization: `Basic ${btoa('admin:admin')}`,
        },
    };

    return fetch(url, {
        method: 'GET',
        ...options,
    }).then(async response => {
        const {token} = await response.json();
        localStorage.setItem('token', token);
    });
};
