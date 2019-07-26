import store from '../../../stores/index';
import {loadConfigData} from '../../../stores/actions/metadata';
import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {ACTOR, CAST, DIRECTOR, PRODUCER, WRITER} from '../../../constants/metadata/configAPI';

export const configFields = {
    LOCALE: 'countries',
    LANGUAGE: 'languages',
    RATING_SYSTEM: 'rating-systems',
    RATINGS: 'ratings',
    ADVISORY_CODE: 'advisories',
    REGIONS: 'regions',
    GENRE: 'genres'
};

const http = Http.create({noDefaultErrorHandling: true});

export const getConfigApiValues = (urlBase, field, page, size, sortBy) => {
    let sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    let path = field + sortPath + '?page=' + page + '&size='+ size;
    return http.get(config.get('gateway.configuration') + urlBase + path);
};

export const searchPerson = (inputValue, size, castOrCrew) => {
    let displayNameMatchPath = '?';
    if(inputValue) {
        displayNameMatchPath += `displayNameMatch=${inputValue}&`;
    }
    let sortPath = ';'+ 'displayName' +'=ASC';
    let personTypePath = castOrCrew === CAST ? `personTypes=${ACTOR.toLowerCase()}&` : `personTypes=${DIRECTOR.toLowerCase()},${WRITER.toLowerCase()},${PRODUCER.toLowerCase()}&`;
    let path = `/persons${sortPath}${displayNameMatchPath}${personTypePath}page=0&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + path);
};

export const deleteConfigItemById = (urlBase, field, id) => {
    let path = field + '/' + id;
    return http.delete(config.get('gateway.configuration') + urlBase + path);
};

export const searchItem = (urlBase, urlApi, field, inputValue, page, size) => {
    let searchBy = '?';
    if(inputValue) {
        searchBy += `${field}=${inputValue}&`;
    }
    // let sortPath = `;${field}=ASC`;
    let sortPath = '';
    let path = `/${urlApi}${sortPath}${searchBy}page=${page}&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + path);
};

const getAllConfigValuesByField = (field, sortBy) => {
    let startPage = 0;
    let size = 10000;
    let total = 0;
    let result = [];

    getConfigApiValues(config.get('gateway.service.configuration') + '/', field, startPage, size, sortBy)
        .then((res) => {
            total = res.data.total;
            result = res.data.data;
            store.dispatch(loadConfigData(field, result));
        })
        .then(() => {
            startPage++;
            for (startPage; total > size * (startPage); startPage++) {
                getConfigApiValues(config.get('gateway.service.configuration') + '/', field, startPage, size, sortBy)
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
            } else {
                getAllConfigValuesByField(configField);
            }
        });
    },
};


