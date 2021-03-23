export const getSortModel = columnApi => {
    const sortColumn = columnApi.getColumnState().find(c => !!c.sort);
    const {colId, sort} = sortColumn || {};
    return [{colId, sort}];
};
