export const getSortedData = (data, prop, isAsc) => {
    return data.sort((a, b) => (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1));
};