import {
    ACTOR,
    CAST,
    DIRECTOR,
    PRODUCER,
    WRITER,
    ANIMATED_CHARACTER,
    AWARD,
    RECORDING_ARTIST,
    VOICE_TALENT,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/constants';
import config from 'react-global-configuration';
import {nexusFetch} from '../../../util/http-client/index';

const createMultiCastPersonTypePath = () => {
    const value = `${ACTOR},${ANIMATED_CHARACTER},${AWARD},${RECORDING_ARTIST},${VOICE_TALENT}&`.toLowerCase();
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
    const englishChars = /^[A-Za-z0-9]*$/;
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
    const url = config.get('gateway.configuration') + config.get('gateway.service.configuration') + path;
    return nexusFetch(url, {isWithErrorHandling: false});
};
