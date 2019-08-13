import store from '../../../stores/index';
import {loadConfigData} from '../../../stores/actions/metadata';
import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {ACTOR, CAST, DIRECTOR, PRODUCER, WRITER} from '../../../constants/metadata/configAPI';
import {getConfigApiValues} from '../../../common/CommonConfigService';

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

const getAllConfigValuesByField = (field, sortBy) => {
    let startPage = 0;
    let size = 10000;
    let total = 0;
    let result = [];

    getConfigApiValues(field, startPage, size, sortBy)
        .then((res) => {
            total = res.data.total;
            result = res.data.data;
            store.dispatch(loadConfigData(field, result));
        })
        .then(() => {
            startPage++;
            for (startPage; total > size * (startPage); startPage++) {
                getConfigApiValues(field, startPage, size, sortBy)
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


