export const CAST = 'CAST';
export const CREW = 'CREW';

export const ACTOR = 'Actor';
export const DIRECTOR = 'Director';
export const WRITER = 'Writer';
export const PRODUCER = 'Producer';

export const PERSONS_PER_REQUEST = 20;

export const getFilteredCastList = (originalConfigCastList, isConfig) => {
    let configCastList = [];
    originalConfigCastList && originalConfigCastList.filter((f) => isCastPersonType(f, isConfig))
        .forEach((e) => {
            let newCastCrew = Object.assign({}, e);
            newCastCrew.personType = ACTOR;
            delete newCastCrew['personTypes'];
            configCastList.push(newCastCrew);
        });
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
            default: return 'Unknown';
        }
    }
};