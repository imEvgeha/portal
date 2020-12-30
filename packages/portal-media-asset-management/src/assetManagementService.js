export const fetchPosters = url => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Basic ${btoa('admin:admin')}`);
    return fetch(url, {
        method: 'GET',
        headers,
    })
        .then(response => response.json());
};
