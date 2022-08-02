import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {searchPersonById} from '@vubiquity-nexus/portal-utils/lib/services/rightDetailsServices';
import classnames from 'classnames';
import {isEmpty} from 'lodash';
import './CastCrew.scss';
import NexusPersonsList from '../../../../../nexus-persons-list/NexusPersonsList';
import {CAST_CONFIG, CREW_CONFIG, CREW_LIST} from '../../../../../nexus-persons-list/constants';

const CastCrew = ({
    sectionId,
    persons,
    isEdit,
    onChange,
    getValues,
    searchPerson,
    isVerticalLayout,
    castCrewConfig,
    language,
    setFieldValue,
    setUpdate,
    isEditable,
    path,
    forMetadata,
    ...props
}) => {
    const [personsWithLocalization, setPersonsWithLocalization] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);

    useEffect(() => {
        setPersonsWithLocalization(persons || []);
        setCast(persons.filter(person => !CREW_LIST.includes(person.personType)).sort((a, b) => a.order - b.order));
        setCrew(persons.filter(person => CREW_LIST.includes(person.personType)).sort((a, b) => a.order - b.order));
    }, [persons]);

    useEffect(() => {
        resetPersons();
        async function fetchLocalizationPersons() {
            const allLocalizationsPersons = persons.map(async person => {
                // for avails there is no language
                if (person.hasOwnProperty('language')) {
                    try {
                        const localizationPerson = await searchPersonById(person.id);
                        return {...person, localization: localizationPerson.localization};
                    } catch (err) {
                        return;
                    }
                } else return person;
            });
            setPersonsWithLocalization(await Promise.all(allLocalizationsPersons));
        }
        !isEmpty(persons) && fetchLocalizationPersons();
    }, [persons]);

    useEffect(() => {
        resetPersons();
    }, [personsWithLocalization]);

    const resetPersons = () => {
        setCast(
            personsWithLocalization
                .filter(person => !CREW_LIST.includes(person.personType))
                .sort((a, b) => a.order - b.order)
        );
        setCrew(
            personsWithLocalization
                .filter(person => CREW_LIST.includes(person.personType))
                .sort((a, b) => a.order - b.order)
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

    return (
        <div
            id={sectionId}
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
                    isEditable={isEditable}
                    searchPerson={searchPerson}
                    castCrewConfig={updateCastCrewConfig()}
                    personsList={cast}
                    uiConfig={CAST_CONFIG}
                    hasCharacter={isEdit}
                    getValues={getValues}
                    setFieldValue={setFieldValue}
                    isEdit={isEdit}
                    updateCastCrew={updateCastCrew}
                    emetLanguage={language}
                    isVerticalLayout={isVerticalLayout}
                    setUpdate={setUpdate}
                    path={path}
                    forMetadata={forMetadata}
                    {...props}
                />
            </div>
            <div
                className={classnames('nexus-c-cast-crew__card', {
                    'nexus-c-cast-crew__card--vertical-bottom': isVerticalLayout,
                })}
            >
                <NexusPersonsList
                    isEditable={isEditable}
                    searchPerson={searchPerson}
                    castCrewConfig={updateCastCrewConfig()}
                    personsList={crew}
                    uiConfig={CREW_CONFIG}
                    getValues={getValues}
                    setFieldValue={setFieldValue}
                    hasCharacter={false}
                    isEdit={isEdit}
                    updateCastCrew={updateCastCrew}
                    emetLanguage={language}
                    isVerticalLayout={isVerticalLayout}
                    setUpdate={setUpdate}
                    path={path}
                    forMetadata={forMetadata}
                    {...props}
                />
            </div>
        </div>
    );
};

CastCrew.propTypes = {
    sectionId: PropTypes.string,
    isEdit: PropTypes.bool,
    persons: PropTypes.array,
    onChange: PropTypes.func,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    isVerticalLayout: PropTypes.bool,
    searchPerson: PropTypes.func,
    castCrewConfig: PropTypes.object,
    language: PropTypes.string,
    setUpdate: PropTypes.func,
    isEditable: PropTypes.bool,
    path: PropTypes.any,
    forMetadata: PropTypes.bool,
};

CastCrew.defaultProps = {
    sectionId: '',
    isEdit: false,
    persons: [],
    onChange: () => null,
    getValues: () => null,
    setFieldValue: () => null,
    setUpdate: () => null,
    isVerticalLayout: false,
    searchPerson: undefined,
    castCrewConfig: {},
    language: 'en',
    isEditable: true,
    path: null,
    forMetadata: false,
};

export default CastCrew;
