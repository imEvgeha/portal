import {cloneDeep} from 'lodash';

const DEFAULT_WIDTH = 100;
const NO_HEADER_WIDTH = 40;

export const defineColumn = ({
    field = '',
    headerName = '',
    width = DEFAULT_WIDTH,
    pinned = 'left',
    resizable = false,
    suppressSizeToFit = true,
    suppressMovable = true,
    lockPosition = true,
    sortable = false,
    menuTabs = [],
    ...rest
} = {}) => {
    return {
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
};

export const defineCheckboxSelectionColumn = ({headerName = '', ...rest} = {}) => {
    return defineColumn({
        field: 'action',
        headerName,
        width: 40,
        checkboxSelection: true,
        pinned: 'left',
        lockPinned: true,
        lockPosition: true,
        lockVisible: true,
        filter: false,
        ...rest,
    });
};

export const defineActionButtonColumn = ({cellRendererFramework}) => {
    return defineButtonColumn({
        headerName: 'Actions',
        pinned: 'left',
        lockPosition: true,
        lockVisible: true,
        lockPinned: true,
        cellRendererFramework,
    });
};

export const defineButtonColumn = ({
    headerName = '',
    cellRendererFramework,
    cellEditorFramework,
    editable = false,
    ...rest
}) => {
    return defineColumn({
        field: 'buttons',
        headerName,
        colId: headerName.toLowerCase(),
        cellRendererFramework,
        cellEditorFramework,
        editable,
        width: headerName !== '' ? DEFAULT_WIDTH : NO_HEADER_WIDTH,
        ...rest,
        lockPosition: false,
        pinned: 'left',
        lockPinned: true,
    });
};

export const updateColumnDefs = (columnDefs, objectFields) => {
    const clonedColumnDefs = cloneDeep(columnDefs);
    return clonedColumnDefs.map(def => {
        Object.keys(objectFields).forEach(key => {
            def[key] = objectFields[key];
        });
        return def;
    });
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
            return clonedColumnDefs.filter(({field}) => ![FIELD.EPISODE, FIELD.SEASON].includes(field));
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

export const defineEpisodeAndSeasonNumberColumn = ({headerName = '-', pinned = false, lockPosition = false} = {}) => {
    return defineColumn({
        headerName,
        colId: 'episodeAndSeasonNumber',
        field: 'episodeAndSeasonNumber',
        pinned,
        lockPosition,
        valueFormatter: renderEpisodeAndSeasonNumber,
    });
};

export const getLinkableColumnDefs = (columnDefs, location) => {
    return cloneDeep(columnDefs).map(e => {
        if (e.cellRenderer) {
            e.cellRendererParams = {
                link: location,
            };
        }
        return e;
    });
};
