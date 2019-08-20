import store from '../../../stores/index';
import {loadConfigData} from '../../../stores/actions/metadata';
import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {ACTOR, CAST, DIRECTOR, PRODUCER, WRITER, ANIMATED_CHARACTER, AWARD, RECORDING_ARTIST, VOICE_TALENT} from '../../../constants/metadata/configAPI';

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

const getConfigValues = (field, page, size, sortBy) => {
    let sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    let path = '/' + field + sortPath + '?page=' + page + '&size='+ size;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + path);
};

export const searchPerson = (inputValue, size, castOrCrew, isMultiCastType = false) => {
    let displayNameMatchPath = '?';
    if(inputValue) {
        displayNameMatchPath += `displayNameMatch=${inputValue}&`;
    }
    let sortPath = ';'+ 'displayName' +'=ASC';
    let personTypePath;
    if(isMultiCastType) {
        personTypePath = `personTypes=${ACTOR.toLowerCase()},${ANIMATED_CHARACTER.toLowerCase()},${AWARD.toLowerCase()},${RECORDING_ARTIST.toLowerCase()},${VOICE_TALENT.toLowerCase()}&`;
    } else {
        personTypePath = castOrCrew === CAST ? `personTypes=${ACTOR.toLowerCase()}&` : `personTypes=${DIRECTOR.toLowerCase()},${WRITER.toLowerCase()},${PRODUCER.toLowerCase()}&`;
    }
    let path = `/persons${sortPath}${displayNameMatchPath}${personTypePath}page=0&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + path);
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
            } else {
                getAllConfigValuesByField(configField);
            }
        });
    },
};


