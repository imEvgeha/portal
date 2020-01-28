import cloneDeep from 'lodash.clonedeep';

export const defineColumn = ({
    field = '',
    headerName = '',
    width = 100,
    pinned = 'left',
    resizable = false,
    suppressSizeToFit = true,
    suppressMovable = true,
    lockPosition = true,
    sortable = false,
    menuTabs = [],
    ...rest
} = {}) => {
    const columnDef = {
        field,
        headerName,
        width,
        pinned,
        resizable,
        suppressSizeToFit,
        suppressMovable,
        lockPosition,
        sortable,
        menuTabs,
        ...rest,
    };

    return columnDef;
};

export const defineCheckboxSelectionColumn = ({headerName = ''} = {}) => {
    const columnDef = defineColumn({
        field: 'action',
        headerName,
        width: 40,
        checkboxSelection: true,
        lockVisible: true
    });

    return columnDef;
};

export const defineActionButtonColumn = ({field, cellRendererFramework}) => {
        return defineButtonColumn({headerName: 'Actions', cellRendererFramework});
};

export const defineButtonColumn = ({headerName = '', cellRendererFramework, cellEditorFramework, editable = false}) => {
    const columnDef = defineColumn({
        field: 'buttons',
        headerName: headerName,
        colId: headerName.toLowerCase(),
        cellRendererFramework,
        cellEditorFramework,
        editable: editable,
        width: 40
    });

    return columnDef;
};

export const updateColumnDefs = (columnDefs, objectFields) => {
    const clonedColumnDefs = cloneDeep(columnDefs);
    const updateColumnDefs = clonedColumnDefs.map(def => {
        Object.keys(objectFields).forEach(key => def[key] = objectFields[key]);
        return def;
    });

    return updateColumnDefs;;
};

