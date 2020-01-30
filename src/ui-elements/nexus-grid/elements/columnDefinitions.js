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
        width: 70,
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
        editable: editable
    });

    return columnDef;
};

export const updateColumnDefs = (columnDefs, objectFields) => {
    const clonedColumnDefs = cloneDeep(columnDefs);
    const updatedColumnDefs = clonedColumnDefs.map(def => {
        Object.keys(objectFields).forEach(key => def[key] = objectFields[key]);
        return def;
    });

    return updatedColumnDefs;;
};

export const getColumnDefsWithCleanContentType = (columnDefs, data) => {
    const CONTENT_TYPE = {
        EPISODE: 'episode',
        SEASON: 'season',
    };
    const FIELD = {
        EPISODE: 'episodic.episodeNumber',
        SEASON: 'episodic.seasonNumber',
    };
    const clonedColumnDefs = cloneDeep(columnDefs);
    const {contentType} = data || {};
    const preparedContentType = contentType && contentType.toLowerCase();
    switch (preparedContentType) {
        case CONTENT_TYPE.EPISODE:
            return clonedColumnDefs.filter(({field}) => field !== FIELD.SEASON);
        case CONTENT_TYPE.SEASON:
            return clonedColumnDefs.filter(({field}) => field !== FIELD.EPISODE);
        default:
            return clonedColumnDefs.filter(({field}) => !([FIELD.EPISODE, FIELD.SEASON].includes(field)));
    }
};
