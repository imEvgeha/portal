import {get} from 'lodash';
import moment from 'moment';

export const TitleSystems = {
    NEXUS: 'nexus',
    MOVIDA: 'movida',
    VZ: 'vz',
};

export const DATE_FORMAT = 'YYYY-MM-DD';

export const getValidDate = date => {
    if (date) {
        return moment(date).format(DATE_FORMAT);
    }
    return date;
};

export const getRepositoryName = id => {
    const {NEXUS, MOVIDA, VZ} = TitleSystems;
    if (id && id.startsWith('movtitl_')) {
        return MOVIDA;
    } else if (id && id.startsWith('vztitl_')) {
        return VZ;
    }
    return NEXUS;
};

export const isNexusTitle = titleId => {
    return titleId && titleId.startsWith('titl');
};

export const getSortModel = columnApi => {
    const sortColumn = columnApi.getColumnState().find(c => !!c.sort);
    if (sortColumn) {
        const {colId, sort} = sortColumn || {};
        return [{colId, sort}];
    }
    return null;
};

export const setSorting = (sortApply, columnApi) => {
    const columnState = columnApi.getColumnState();
    let initialSortColumnState;

    get(sortApply, 'colId');

    if (sortApply) {
        if (Array.isArray(sortApply) && sortApply.length > 0) {
            sortApply = sortApply[0];
        }
        initialSortColumnState = columnState.map(c =>
            c.colId === get(sortApply, 'colId') ? {...c, sort: get(sortApply, 'sort')} : c
        );
    } else {
        initialSortColumnState = columnState.map(c => {
            return {...c, sort: null};
        });
    }
    columnApi.applyColumnState({state: initialSortColumnState});
};
