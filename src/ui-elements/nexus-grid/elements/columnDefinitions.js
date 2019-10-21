// TODO:  create ES for column definition
export const defineCheckboxSelectionColumn = (field = 'checkbox') => {
    const columnDef = {
        field,
        headerName: 'Action',
        colId: 'action',
        width: 70,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        suppressMovable: true,
        lockPosition: true,
        sortable: false,
        checkboxSelection: true,
    };
    return columnDef;
};

export const defineActionButtonColumn = (field = 'buttons', cellRendererFramework) => {
    const columnDef = {
        field,
        headerName: 'Actions',
        colId: 'actions',
        width: 100,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        cellRendererFramework,
        suppressMovable: true,
        lockPosition: true,
        sortable: false,
    };
    return columnDef;
};
