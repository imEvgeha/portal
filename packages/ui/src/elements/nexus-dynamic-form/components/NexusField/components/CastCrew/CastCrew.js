import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusPersonsList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/NexusPersonsList';
import {
    CAST_CONFIG,
    CREW_CONFIG,
    CREW_LIST,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/constants';
import './CastCrew.scss';

const CastCrew = ({persons, isEdit, onChange, searchPerson}) => {
    const [cast, setCast] = useState(
        persons
            .filter(person => !CREW_LIST.includes(person.personType))
            .map((e, index) => {
                return {...e, id: index};
            })
    );

    const [crew, setCrew] = useState(
        persons
            .filter(person => CREW_LIST.includes(person.personType))
            .map((e, index) => {
                return {...e, id: index};
            })
    );

    useEffect(() => {
        resetPersons();
    }, [persons]);

    const resetPersons = () => {
        setCast(
            persons
                .filter(person => !CREW_LIST.includes(person.personType))
                .map((e, index) => {
                    return {...e, id: index};
                })
        );
        setCrew(
            persons
                .filter(person => CREW_LIST.includes(person.personType))
                .map((e, index) => {
                    return {...e, id: index};
                })
        );
    };

    const updateCastCrew = (value, isCast) => {
        if (isCast) {
            setCast(value);
            onChange([...value, ...crew]);
        } else {
            setCrew(value);
            onChange([...value, ...cast]);
        }
    };

    return (
        <div className="nexus-c-cast-crew">
            <div className="nexus-c-cast-crew__card">
                <NexusPersonsList
                    searchPerson={searchPerson}
                    personsList={cast}
                    uiConfig={CAST_CONFIG}
                    hasCharacter={isEdit}
                    isEdit={isEdit}
                    updateCastCrew={updateCastCrew}
                />
            </div>
            <div className="nexus-c-cast-crew__card">
                <NexusPersonsList
                    searchPerson={searchPerson}
                    personsList={crew}
                    uiConfig={CREW_CONFIG}
                    hasCharacter={false}
                    isEdit={isEdit}
                    updateCastCrew={updateCastCrew}
                />
            </div>
        </div>
    );
};

CastCrew.propTypes = {
    isEdit: PropTypes.bool,
    persons: PropTypes.array,
    onChange: PropTypes.func,
    searchPerson: PropTypes.func,
};

CastCrew.defaultProps = {
    isEdit: false,
    persons: [],
    onChange: () => null,
    searchPerson: undefined,
};

export default CastCrew;
