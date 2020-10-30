import config from 'react-global-configuration';
import {nexusFetch} from '../../../util/http-client/index';
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
} from './constants';

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

export const searchPerson = (inputValue, size, castOrCrew, isMultiCastType = false) => {
    const displayNamePath = inputValue ? `?displayName=${inputValue}&` : '?';
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
