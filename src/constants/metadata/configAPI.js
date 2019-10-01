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

export const getFilteredCastList = (originalConfigCastList, isConfig, isMultiCastType = false) => {
    let configCastList = [];
    if(isMultiCastType) {
        let param = isConfig ? 'personTypes' : 'personType';
        originalConfigCastList && originalConfigCastList
            .filter((f) => {
                return f[param] && isCastEditorialPersonType(f, param, isConfig);
            })
            .forEach((e) => {
                if(isConfig) {
                    e[param].forEach((p) => {
                        createNewEditorialCast(e, p, configCastList);
                    });
                } else {
                    createNewEditorialCast(e, e[param], configCastList);
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
        return item[param].filter(t => {
            return ((t.toLowerCase() === ANIMATED_CHARACTER.toLowerCase()
                || t.toLowerCase() === ACTOR.toLowerCase()
                || t.toLowerCase() === RECORDING_ARTIST.toLowerCase()
                || t.toLowerCase() === AWARD.toLowerCase()
                || t.toLowerCase() === VOICE_TALENT.toLowerCase()));
        }).length > 0;
    } else {
        return item[param].toLowerCase() === ANIMATED_CHARACTER.toLowerCase()
            || item[param].toLowerCase() === ACTOR.toLowerCase()
            || item[param].toLowerCase() === RECORDING_ARTIST.toLowerCase()
            || item[param].toLowerCase() === AWARD.toLowerCase()
            || item[param].toLowerCase() === VOICE_TALENT.toLowerCase();
    }
};

const isCrewPersonType = (item, param, isConfig) => {
    if(isConfig) {
        return item[param].filter(t => {
            return ((t.toLowerCase() === DIRECTOR.toLowerCase()
                || t.toLowerCase() === WRITER.toLowerCase()
                || t.toLowerCase() === PRODUCER.toLowerCase()));
        }).length > 0;
    } else {
        return item[param].toLowerCase() === DIRECTOR.toLowerCase()
            || item[param].toLowerCase() === WRITER.toLowerCase()
            || item[param].toLowerCase() === PRODUCER.toLowerCase();
    }
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
        .forEach((e) => {
            if(isConfig) {
                e[param].forEach((p) => {
                    createNewCrew(e, p, configCrewList);
                });
            } else {
                createNewCrew(e, e[param], configCrewList);
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