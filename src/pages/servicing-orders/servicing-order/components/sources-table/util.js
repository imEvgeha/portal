import {get} from 'lodash';

export const prepareRowData = data => {
    const {fs, definition = {}} = data || {};

    if (!fs) {
        return [];
    }

    const preparedSources = {};

    const servicesKey = `${fs.toLowerCase()}Services`;
    const sourcesKey = `${fs.toLowerCase()}Sources`;

    const services = get(definition, servicesKey, []);

    services.forEach(service => {
        const sources = get(service, sourcesKey, {});

        sources.map(s => {
            const {barcode} = s;

            if (barcode) {
                const source = get(preparedSources, barcode, {});
                preparedSources[barcode] = source;
                source.fs = fs;
                source.barcode = barcode;
                const preparedServices = get(source, servicesKey, []);
                source[servicesKey] = preparedServices;
                preparedServices.push(service);
            }
        });
    });

    return Object.entries(preparedSources).map(([key, value]) => value);
};
