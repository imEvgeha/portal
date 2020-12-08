export const fetchPosters = url => {
    const headers = new Headers();
    headers.append('Authorization', `Basic ${btoa('admin:admin')}`);
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        mode: 'no-cors',
        headers,
    }).then(response => response.body);
};
