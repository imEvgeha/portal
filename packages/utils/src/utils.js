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
