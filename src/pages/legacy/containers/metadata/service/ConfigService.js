import {store} from '../../../../../index';
import {loadConfigData} from '../../../stores/actions/metadata';
import {
    ACTOR,
    ANIMATED_CHARACTER,
    CAST,
    DIRECTOR,
    DISPLAY_ARTIST,
    FEATURE_ARTIST,
    PRODUCER,
    RECORDING_ARTIST,
    VOICE_TALENT,
    WRITER,
} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {getConfigApiValues} from '../../../common/CommonConfigService';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';

export const configFields = {
    LOCALE: 'countries',
    LANGUAGE: 'languages',
    RATING_SYSTEM: 'rating-systems',
    RATINGS: 'ratings',
    ADVISORY_CODE: 'advisories',
    REGIONS: 'regions',
    GENRE: 'genres',
    CATEGORY: 'categories',
    LICENSORS: 'licensors',
    LICENSEES: 'licensees',
};

const isTextEnglish = testString => {
    const englishChars = /^[A-Za-z0-9 ]*$/;
    return englishChars.test(testString);
};

export const searchPerson = (inputValue, size, castOrCrew, isMultiCastType = false) => {
    let displayNamePath = '?';
    if (inputValue) {
        if (isTextEnglish(inputValue)) {
            displayNamePath += `displayName=${inputValue}&`;
        } else {
            displayNamePath += `localization.displayName=${inputValue}&`;
        }
    }
    const sortPath = ';' + 'displayName' + '=ASC';
    let personTypePath;
    if (isMultiCastType) {
        personTypePath = `personTypes=${ACTOR.toLowerCase()},
            ${ANIMATED_CHARACTER.toLowerCase()},
            ${AWARD.toLowerCase()},
            ${RECORDING_ARTIST.toLowerCase()},
            ${VOICE_TALENT.toLowerCase()},
            ${FEATURE_ARTIST.toLowerCase()},
            ${DISPLAY_ARTIST.toLowerCase()}
        &`;
    } else {
        personTypePath =
            castOrCrew === CAST
                ? `personTypes=${ACTOR.toLowerCase()}&`
                : `personTypes=${DIRECTOR.toLowerCase()},${WRITER.toLowerCase()},${PRODUCER.toLowerCase()}&`;
    }
    // TODO: Lazy scrolling should be implemented as a feature to make use of 'page=X' parameter, so that PORT-728 is avoided
    const path = `/persons${sortPath}${displayNamePath}${personTypePath}page=0&size=${size}`;
    const url = getConfig('gateway.configuration') + getConfig('gateway.service.configuration') + path;
    return nexusFetch(url, {isWithErrorHandling: false});
};

const getAllConfigValuesByField = (field, sortBy) => {
    let startPage = 0;
    const size = 10000;
    let total = 0;
    let result = [];

    getConfigApiValues(field, startPage, size, sortBy)
        .then(res => {
            total = res.total;
            result = res.data;
            store.dispatch(loadConfigData(field, result));
        })
        .then(() => {
            startPage++;
            for (startPage; total > size * startPage; startPage++) {
                getConfigApiValues(field, startPage, size, sortBy)
                    .then(res => {
                        result = [...result, ...res.data];
                        store.dispatch(loadConfigData(field, result));
                    })
                    .catch(err => {
                        console.error('Can not fetch data from config api', err);
                    });
            }
        })
        .catch(err => {
            console.error('Can not fetch data from config api', err);
        });
};
