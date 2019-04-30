import store from '../../../stores/index';
import {loadConfigData} from '../../../stores/actions/metadata';
import Http from '../../../util/Http';
import config from 'react-global-configuration';

export const configFields = {
    LOCALE: 'countries',
    LANGUAGE: 'languages',
    PRODUCTION_STUDIO: 'production-studios',
    CAST_AND_CREW: 'persons',
    RATING_SYSTEM: 'rating-systems',
    RATINGS: 'ratings',
    ADVISORY_CODE: 'advisories'
};

const http = Http.create({noDefaultErrorHandling: true});

const getConfigValues = (field, page, size, sortBy) => {
    let sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    let path = '/configuration-api/v1/' + field + sortPath + '?page=' + page + '&size='+ size;
    return http.get(config.get('gateway.configuration') + path);
};

const getAllConfigValuesByField = (field, sortBy) => {
    let startPage = 0;
    let size = 10000;
    let total = 0;
    let result = [];

    getConfigValues(field, startPage, size, sortBy)
        .then((res) => {
            total = res.data.total;
            result = res.data.data;
            store.dispatch(loadConfigData(field, result));
        })
        .then(() => {
            startPage++;
            for (startPage; total > size * (startPage); startPage++) {
                getConfigValues(field, startPage, size, sortBy)
                    .then((res) => {
                        result = [...result, ...res.data.data];
                        store.dispatch(loadConfigData(field, result));
                    })
                    .catch((err) => {
                        console.error('Can not fetch data from config api', err);
                    });
            }
        })
        .catch((err) => {
            console.error('Can not fetch data from config api', err);
        });
};

export const configService = {
    initConfigMapping: () => {
        Object.values(configFields).forEach(configField => {
            if(configField === configFields.LANGUAGE) {
                getAllConfigValuesByField(configField, 'languageName');
            } else if(configField === configFields.LOCALE) {
                getAllConfigValuesByField(configField, 'countryName');
            } else if(configField === configFields.PRODUCTION_STUDIO) {
                    getAllConfigValuesByField(configField, 'name');
            } else {
                getAllConfigValuesByField(configField);
            }
        });
    },
};


