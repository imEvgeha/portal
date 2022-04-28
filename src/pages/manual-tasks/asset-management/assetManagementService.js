import {keycloak} from "@portal/portal-auth";
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';

export const fetchPosters = url => {
    const headers = new Headers();
    const {token} = keycloak;
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    return fetch(url, {
        method: 'GET',
        headers,
    }).then(response => response.json().then(resp => resp));
};

export const fetchPoster = poster => {
    const headers = new Headers();
    headers.append('Authorization', `token ${localStorage.getItem('token')}`);
    return fetch(poster, {method: 'GET', headers}).then(res => res.blob());
};

export const loginAssets = () => {
    const headers = new Headers();
    const url = `${getConfig('gateway.kongUrl')}${getConfig(
        'gateway.service.kongVidispine'
    )}/token?seconds=1800&autoRefresh=true`;

    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Basic ${btoa('admin:admin')}`);
    return fetch(url, {
        method: 'GET',
        headers,
    }).then(async response => {
        const {token} = await response.json();
        localStorage.setItem('token', token);
    });
};
