import {get} from 'lodash';

export const prepareRowData = data => {
    const {fs, definition = {}} = data || {};
    const sources = fs ? get(definition, `${fs.toLowerCase()}Sources`, []) : [];
    const preparedSources = sources.map(el => {
        const {externalSources, ...rest} = el || {};
        const flatenData = {...externalSources, ...rest, fs};
        return flatenData;
    });

    return preparedSources;
};
