import {get} from 'lodash';
import moment from 'moment';
import {css} from 'styled-components';

export const sizes = {
    large: 1200,
    desktop: 992,
    tablet: 768,
};

export const media = Object.keys(sizes).reduce((accumulator, label) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const emSize = sizes[label] / 16;
    accumulator[label] = (...args) =>
        css`
            @media (min-width: ${emSize}em) {
                ${css(...args)};
            }
        `;
    return accumulator;
}, {});

export const hexToRgba = (hex, alpha = '0.2') => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
        : null;
};

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
