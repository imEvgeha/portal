import {createSelector} from 'reselect';

export const getColumnDefs = (state) => {
    const {rightMatching} = state;
    return rightMatching && rightMatching.columnDefs;
};

// move this to availMapping selector
export const getAvailsMapping = (state) => {
    const {root} = state;
    return root && root.availsMapping;
};

export const createRightMatchingColumnDefsSelector = (cellRenderer) => createSelector(
    getColumnDefs,
    columnDefs => {
        // add new column defintion
        const columnDef = {
            field: 'buttons',
            headerName: 'Actions',
            colId: 'actions',
            width: 100,
            pinned: 'left',
            suppressResize: true,
            suppressSizeToFit: true,
            suppressMovable: true,
            lockPosition: true,
            cellRendererFramework: cellRenderer,
            sorting: false,
        };
        if (columnDefs.length) {
            const updatedColumnDefs = [columnDef, ...columnDefs];
            return updatedColumnDefs;
        }
        return columnDefs;
    }
);

export const createAvailsMappingSelector = () => createSelector(
    getAvailsMapping,
    availsMapping => {
        return availsMapping && availsMapping.mapping;
    }
);

