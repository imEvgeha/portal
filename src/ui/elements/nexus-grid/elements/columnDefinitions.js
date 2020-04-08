import {cloneDeep} from 'lodash';

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

export const defineCheckboxSelectionColumn = ({headerName = '', ...rest} = {}) => {
    const columnDef = defineColumn({
        field: 'action',
        headerName,
        width: 40,
        checkboxSelection: true,
        lockVisible: true,
        ...rest,
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
        width: headerName !== ''? 100 : 40
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

const renderEpisodeAndSeasonNumber = params => {
    const {data = {}} = params || {};
    const {contentType, episodic = {}} = data || {};
    if (contentType === 'EPISODE') {
        return episodic.episodeNumber;
    } else if (contentType === 'SEASON') {
        return episodic.seasonNumber;
    }
};

export const defineEpisodeAndSeasonNumberColumn = ({
    headerName = '-', 
    pinned = false,
    lockPosition = false,
} = {}) => {
    const columnDef =  defineColumn({
        headerName,
        colId: 'episodeAndSeasonNumber',
        field: 'episodeAndSeasonNumber',
        pinned,
        lockPosition,
        valueFormatter: renderEpisodeAndSeasonNumber,
    });

    return columnDef;
};

export const getLinkableColumnDefs = (columnDefs, location) => {
    return cloneDeep(columnDefs)
        .map(e => {
            if (e.cellRenderer) {
                e.cellRendererParams = {
                    link: location
                };
            }
            return e;
        });
};
