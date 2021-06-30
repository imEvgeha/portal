import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusPersonsList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/NexusPersonsList';
import {
    CAST_CONFIG,
    CREW_CONFIG,
    CREW_LIST,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/constants';
import classnames from 'classnames';
import './CastCrew.scss';

const CastCrew = ({persons, isEdit, onChange, searchPerson, isVerticalLayout, castCrewConfig, language}) => {
    const [cast, setCast] = useState(
        persons.filter(person => !CREW_LIST.includes(person.personType)).sort((a, b) => a.creditsOrder - b.creditsOrder)
    );

    const [crew, setCrew] = useState(
        persons.filter(person => CREW_LIST.includes(person.personType)).sort((a, b) => a.creditsOrder - b.creditsOrder)
    );

    useEffect(() => {
        resetPersons();
    }, [persons]);

    const resetPersons = () => {
        setCast(
            persons
                .filter(person => !CREW_LIST.includes(person.personType))
                .sort((a, b) => a.creditsOrder - b.creditsOrder)
        );
        setCrew(
            persons
                .filter(person => CREW_LIST.includes(person.personType))
                .sort((a, b) => a.creditsOrder - b.creditsOrder)
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

    const updateCastCrewConfig = () => {
        if (castCrewConfig && castCrewConfig.uiSchema) {
            const updatedCastCrewConfig = castCrewConfig;
            updatedCastCrewConfig.uiSchema = castCrewConfig.uiSchema.map(c =>
                c.id === 'personTypes' ? {...c, required: true} : c
            );
            return updatedCastCrewConfig;
        }
    };

    console.log('persons, language ', persons, language)

    return (
        <div
            className={classnames('nexus-c-cast-crew', {
                'nexus-c-cast-crew--vertical': isVerticalLayout,
            })}
        >
            <div
                className={classnames('nexus-c-cast-crew__card', {
                    'nexus-c-cast-crew__card--vertical': isVerticalLayout,
                })}
            >
                <NexusPersonsList
                    searchPerson={searchPerson}
                    castCrewConfig={updateCastCrewConfig()}
                    personsList={cast}
                    uiConfig={CAST_CONFIG}
                    hasCharacter={isEdit}
                    isEdit={isEdit}
                    updateCastCrew={updateCastCrew}
                    emetLanguage={language}
                />
            </div>
            <div
                className={classnames('nexus-c-cast-crew__card', {
                    'nexus-c-cast-crew__card--vertical-bottom': isVerticalLayout,
                })}
            >
                <NexusPersonsList
                    searchPerson={searchPerson}
                    castCrewConfig={updateCastCrewConfig()}
                    personsList={crew}
                    uiConfig={CREW_CONFIG}
                    hasCharacter={false}
                    isEdit={isEdit}
                    updateCastCrew={updateCastCrew}
                    emetLanguage={language}
                />
            </div>
        </div>
    );
};

CastCrew.propTypes = {
    isEdit: PropTypes.bool,
    persons: PropTypes.array,
    onChange: PropTypes.func,
    isVerticalLayout: PropTypes.bool,
    searchPerson: PropTypes.func,
    castCrewConfig: PropTypes.object,
    language: PropTypes.string,
};

CastCrew.defaultProps = {
    isEdit: false,
    persons: [],
    onChange: () => null,
    isVerticalLayout: false,
    searchPerson: undefined,
    castCrewConfig: {},
    language: "en",
};

export default CastCrew;
