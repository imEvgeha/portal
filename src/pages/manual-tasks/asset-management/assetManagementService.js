export const fetchPosters = url => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `token ${localStorage.getItem('token')}`);
    return fetch(url, {
        method: 'GET',
        headers,
    }).then(response => response.json());
};

export const loginAssets = () => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Basic ${btoa('admin:admin')}`);
    return fetch('http://vidispine-stg.misc.odg.ondemand.co.uk/API/token?seconds=1800&autoRefresh=true', {
        method: 'GET',
        headers,
    }).then(async response => {
        const {token} = await response.json();
        localStorage.setItem('token', token);
    });
};
