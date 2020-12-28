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
const allowedEditorialCastTypes = [
    ANIMATED_CHARACTER.toLowerCase(),
    ACTOR.toLowerCase(),
    RECORDING_ARTIST.toLowerCase(),
    AWARD.toLowerCase(),
    VOICE_TALENT.toLowerCase(),
];

export const getFilteredCastList = (originalConfigCastList, isConfig, isMultiCastType = false) => {
    const configCastList = [];
    if (isMultiCastType) {
        const param = isConfig ? 'personTypes' : 'personType';
        originalConfigCastList &&
            originalConfigCastList
                .filter(f => {
                    return f[param] && isCastEditorialPersonType(f, param, isConfig);
                })
                .forEach(cast => {
                    if (isConfig) {
                        cast[param].forEach(personType => {
                            if (isCastTypeEditorial(personType)) {
                                createNewEditorialCast(cast, personType, configCastList);
                            }
                        });
                    } else if (isCastTypeEditorial(cast[param])) {
                        createNewEditorialCast(cast, cast[param], configCastList);
                    }
                });
    } else {
        originalConfigCastList &&
            originalConfigCastList
                .filter(f => isCastPersonType(f, isConfig))
                .forEach(e => {
                    const newCastCrew = Object.assign({}, e);
                    newCastCrew.personType = e.personType;
                    delete newCastCrew['personTypes'];
                    configCastList.push(newCastCrew);
                });
    }
    return configCastList;
};

export const isCastPersonType = (item, isConfig) => {
    const param = isConfig ? 'personTypes' : 'personType';
    if (isConfig) {
        return item[param] && item[param].filter(t => t.toLowerCase() === ACTOR.toLowerCase()).length > 0;
    }
    return (
        item[param] &&
        (item[param].toLowerCase() === ACTOR.toLowerCase() ||
            item[param].toLowerCase() === ANIMATED_CHARACTER.toLowerCase() ||
            item[param].toLowerCase() === VOICE_TALENT.toLowerCase())
    );
};

const isCastEditorialPersonType = (item, param, isConfig) => {
    if (isConfig) {
        return item[param].some(t => isCastTypeEditorial(t));
    }
    return isCastTypeEditorial(item[param]);
};

const isCastTypeEditorial = personType => {
    return allowedEditorialCastTypes.includes(personType.toLowerCase());
};

const isCrewPersonType = (item, param, isConfig) => {
    if (isConfig) {
        return item[param].some(t => isCrewType(t));
    }
    return isCrewType(item[param]);
};

const isCrewType = personType => {
    return allowedCoreCrewTypes.includes(personType.toLowerCase());
};

const createNewCrew = (item, type, configCrewList) => {
    if (type.toLowerCase() !== ACTOR.toLowerCase()) {
        const newCastCrew = Object.assign({}, item);
        newCastCrew['personType'] = type;
        delete newCastCrew['personTypes'];
        configCrewList.push(newCastCrew);
    }
};

const createNewEditorialCast = (item, type, configCrewList) => {
    if (
        type.toLowerCase() !== PRODUCER.toLowerCase() &&
        type.toLowerCase() !== DIRECTOR.toLowerCase() &&
        type.toLowerCase() !== WRITER.toLowerCase()
    ) {
        const newCastCrew = Object.assign({}, item);
        newCastCrew['personType'] = type;
        delete newCastCrew['personTypes'];
        configCrewList.push(newCastCrew);
    }
};

export const getFilteredCrewList = (originalConfigCrewList, isConfig) => {
    const configCrewList = [];
    const param = isConfig ? 'personTypes' : 'personType';
    originalConfigCrewList &&
        originalConfigCrewList
            .filter(f => {
                return f[param] && isCrewPersonType(f, param, isConfig);
            })
            .forEach(crew => {
                if (isConfig) {
                    crew[param].forEach(paramValue => {
                        if (isCrewType(paramValue)) {
                            createNewCrew(crew, paramValue, configCrewList);
                        }
                    });
                } else if (isCrewType(crew[param])) {
                    createNewCrew(crew, crew[param], configCrewList);
                }
            });

    return configCrewList;
};

export const getFormatTypeName = personType => {
    if (personType) {
        switch (personType.toLowerCase()) {
            case DIRECTOR.toLowerCase():
                return 'Directed by:';
            case PRODUCER.toLowerCase():
                return 'Produced by:';
            case WRITER.toLowerCase():
                return 'Written by:';
            case ACTOR.toLowerCase():
                return 'Actor:';
            case ANIMATED_CHARACTER.toLowerCase():
                return 'Animated Character:';
            case RECORDING_ARTIST.toLowerCase():
                return 'Recording Artist:';
            case AWARD.toLowerCase():
                return 'Award:';
            case VOICE_TALENT.toLowerCase():
                return 'Voice Talent:';
            default:
                return 'Unknown';
        }
    }
};
