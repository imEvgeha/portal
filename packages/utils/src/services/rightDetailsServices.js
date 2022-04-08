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
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/constants';
import {getConfig} from "../config";
import {nexusFetch} from '../http-client';

const createMultiCastPersonTypePath = () => {
    const value =
        `${ACTOR},${ANIMATED_CHARACTER},${RECORDING_ARTIST},${VOICE_TALENT},${FEATURE_ARTIST},${DISPLAY_ARTIST},&`.toLowerCase();
    return `personTypes=${value}`;
};

const createCastPersonTypePath = () => {
    return `personTypes=${ACTOR.toLowerCase()}&`;
};

const createCrewPersonTypePath = () => {
    const value = `${DIRECTOR},${WRITER},${PRODUCER}&`.toLowerCase();
    return `personTypes=${value}`;
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
    const sortPath = ';displayName=ASC';
    let personTypePath = null;

    if (isMultiCastType) {
        personTypePath = createMultiCastPersonTypePath();
    } else {
        personTypePath = castOrCrew === CAST ? createCastPersonTypePath() : createCrewPersonTypePath();
    }

    const path = `/persons${sortPath}${displayNamePath}${personTypePath}page=0&size=${size}`;
    const url = getConfig('gateway.configuration') + getConfig('gateway.service.configuration') + path;
    return nexusFetch(url, {isWithErrorHandling: false});
};

export const searchPersonById = personId => {
    const path = `/persons/${personId}`;
    const url = getConfig('gateway.configuration') + getConfig('gateway.service.configuration') + path;
    return nexusFetch(url, {isWithErrorHandling: false});
};
