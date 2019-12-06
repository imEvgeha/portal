export const CAST = 'CAST';
export const CREW = 'CREW';

export const ACTOR = 'Actor';
export const DIRECTOR = 'Director';
export const WRITER = 'Writer';
export const PRODUCER = 'Producer';
export const ANIMATED_CHARACTER = 'Animated Character';
export const AWARD = 'Award';
export const RECORDING_ARTIST = 'Recording Artist';
export const VOICE_TALENT = 'Voice Talent';

export const PERSONS_PER_REQUEST = 1000;

const allowedCoreCrewTypes = [DIRECTOR.toLowerCase(), WRITER.toLowerCase(), PRODUCER.toLowerCase()];
const allowedEditorialCastTypes = [ANIMATED_CHARACTER.toLowerCase(), ACTOR.toLowerCase(), RECORDING_ARTIST.toLowerCase(), AWARD.toLowerCase(), VOICE_TALENT.toLowerCase()];

export const getFilteredCastList = (originalConfigCastList, isConfig, isMultiCastType = false) => {
    let configCastList = [];
    if(isMultiCastType) {
        let param = isConfig ? 'personTypes' : 'personType';
        originalConfigCastList && originalConfigCastList
            .filter((f) => {
                return f[param] && isCastEditorialPersonType(f, param, isConfig);
            })
            .forEach((cast) => {
                if(isConfig) {
                    cast[param].forEach((personType) => {
                        if(isCastTypeEditorial(personType)) {
                            createNewEditorialCast(cast, personType, configCastList);
                        }
                    });
                } else {
                    if(isCastTypeEditorial()) {
                        createNewEditorialCast(cast, cast[param], configCastList);
                    }
                }
            });
    } else {
        originalConfigCastList && originalConfigCastList.filter((f) => isCastPersonType(f, isConfig))
        .forEach((e) => {
            let newCastCrew = Object.assign({}, e);
            newCastCrew.personType = ACTOR;
            delete newCastCrew['personTypes'];
            configCastList.push(newCastCrew);
        });
    }
    return configCastList;
};


const isCastPersonType =(item, isConfig) => {
    let param = isConfig ? 'personTypes' : 'personType';
    if(isConfig) {
        return item[param] && item[param].filter(t => t.toLowerCase() === ACTOR.toLowerCase()).length > 0;
    } else {
        return item[param] && item[param].toLowerCase() === ACTOR.toLowerCase();
    }
};

const isCastEditorialPersonType = (item, param, isConfig) => {
    if(isConfig) {
        return item[param].some(t => isCastTypeEditorial(t));
    } else {
        return isCastTypeEditorial(item[param]);
    }
};

const isCastTypeEditorial = (personType) => {
    return allowedEditorialCastTypes.includes(personType.toLowerCase());
};

const isCrewPersonType = (item, param, isConfig) => {
    if(isConfig) {
        return item[param].some(t => isCrewType(t));
    } else {
        return isCrewType(item[param]);
    }
};

const isCrewType = (personType) => {
    return allowedCoreCrewTypes.includes(personType.toLowerCase());
};

const createNewCrew = (item, type, configCrewList) => {
    if(type.toLowerCase() !== ACTOR.toLowerCase() ) {
        let newCastCrew = Object.assign({}, item);
        newCastCrew['personType'] = type;
        delete newCastCrew['personTypes'];
        configCrewList.push(newCastCrew);
    }
};

const createNewEditorialCast = (item, type, configCrewList) => {
    if(type.toLowerCase() !== PRODUCER.toLowerCase() && type.toLowerCase() !== DIRECTOR.toLowerCase() && type.toLowerCase() !== WRITER.toLowerCase()) {
        let newCastCrew = Object.assign({}, item);
        newCastCrew['personType'] = type;
        delete newCastCrew['personTypes'];
        configCrewList.push(newCastCrew);
    }
};

export const getFilteredCrewList = (originalConfigCrewList, isConfig) => {
    let configCrewList = [];
    let param = isConfig ? 'personTypes' : 'personType';
    originalConfigCrewList && originalConfigCrewList
        .filter((f) => {
            return f[param] && isCrewPersonType(f, param, isConfig);
        })
        .forEach((crew) => {
            if(isConfig) {
                crew[param].forEach((paramValue) => {
                    if(isCrewType(paramValue)) {
                        createNewCrew(crew, paramValue, configCrewList);
                    }
                });
            } else {
                if(isCrewType(crew[param])) {
                    createNewCrew(crew, crew[param], configCrewList);
                }
            }
        });

    return configCrewList;
};

export const getFormatTypeName = (personType) => {
    if(personType) {
        switch (personType) {
            case DIRECTOR: return 'Directed by:';
            case PRODUCER: return 'Produced by:';
            case WRITER: return 'Written by:';
            case ACTOR: return 'Actor:';
            case ANIMATED_CHARACTER: return 'Animated Character:';
            case RECORDING_ARTIST: return 'Recording Artist:';
            case AWARD: return 'Award:';
            case VOICE_TALENT: return 'Voice Talent:';
            default: return 'Unknown';
        }
    }
};