/* eslint-disable */
import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import UserPicker from '@atlaskit/user-picker';
import Button from '@atlaskit/button';
import {Field, FormFooter} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import {default as AKForm} from '@atlaskit/form/Form';
import classnames from 'classnames';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import {getFilteredCastList, getFilteredCrewList} from '../../../pages/legacy/constants/metadata/configAPI';
import {searchPerson} from '../../../pages/avails/right-details/rightDetailsServices';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import NexusPerson from '../nexus-person/NexusPerson';
import NexusPersonRO from '../nexus-person-ro/NexusPersonRO';
import {CAST, CAST_CONFIG, PERSONS_PER_REQUEST} from './constants';
import './NexusPersonsList.scss';

const NexusPersonsList = ({personsList, uiConfig, hasCharacter, isEdit, updateCastCrew}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const [persons, setPersons] = useState(personsList || []);
    const [searchText, setSearchText] = useState('');
    const [isLastEntryValid, setIsLastEntryValid] = useState(true);

    useEffect(() => {
        const updatedPersons = [...personsList];
        setPersons(updatedPersons);
    }, [personsList]);

    const searchInputChanged = val => {
        setSearchText(val);
    };

    const loadOptions = () => {
        const {type} = uiConfig;
        if (searchText.length < 2) return [];
        if (type === CAST) {
            return searchPerson(searchText, PERSONS_PER_REQUEST, type, true).then(res =>
                getFilteredCastList(res.data, true, true).map(e => {
                    return {
                        id: e.id,
                        name: e.displayName,
                        byline: e.personType.toString().toUpperCase(),
                        original: JSON.stringify(e),
                    };
                })
            );
        } else {
            return searchPerson(searchText, PERSONS_PER_REQUEST, type).then(res =>
                getFilteredCrewList(res.data, true).map(e => {
                    return {
                        id: e.id,
                        name: e.displayName,
                        byline: e.personType.toString().toUpperCase(),
                        original: JSON.stringify(e),
                    };
                })
            );
        }
    };

    const isPersonValid = entry => {
        return (
            persons === null ||
            persons.findIndex(
                person =>
                    person.displayName.toString().toLowerCase() === entry.displayName.toString().toLowerCase() &&
                    person.personType.toString().toLowerCase() === entry.personType.toString().toLowerCase()
            ) < 0
        );
    };

    const validateAndAddPerson = personJSON => {
        const person = JSON.parse(personJSON.original);
        const isValid = isPersonValid(person);
        if (isValid) {
            addPerson(person);
            setSearchText('');
        }
        setIsLastEntryValid(isValid);
    };

    const addPerson = person => {
        const updatedPersons = [...[person], ...persons];
        const isCast = uiConfig.type === CAST;
        setPersons(updatedPersons);
        updateCastCrew(updatedPersons, isCast);
    };

    const removePerson = person => {
        const updatedPersons = persons.filter(entry => {
            return entry.id !== person.id;
        });
        const isCast = uiConfig.type === CAST;
        setPersons(updatedPersons);
        updateCastCrew(updatedPersons, isCast);
    };

    const closeCharacterModal = () => {
        closeModal();
    };

    const openCharacterModal = id => {
        const selectedPerson = persons && persons[id];
        const data = {
            personName: selectedPerson.displayName,
            characterName: selectedPerson.characterName,
        };
        const message = data.characterName ? 'Edit Character' : 'Add New Character';
        openModal(modalContent(data, id), {
            title: <div className="nexus-c-array__modal-title">{message}</div>,
            width: 'medium',
        });
    };

    const onModalSubmit = (values, id) => {
        const updatedPersons = [...persons];
        const [person] = updatedPersons.filter(entry => {
            return entry.id === id;
        });
        if (person) {
            person.characterName = values.characterName;
            const isCast = uiConfig.type === CAST;
            setPersons(updatedPersons);
            updateCastCrew(updatedPersons, isCast);
        }
        closeCharacterModal();
    };

    const modalContent = ({personName, characterName}, id) => {
        return (
            <div>
                <AKForm onSubmit={values => onModalSubmit(values, id)}>
                    {({formProps, dirty, submitting, reset, getValues, setFieldValue}) => (
                        <form {...formProps}>
                            <Field name="personName" defaultValue={personName} label="Person Name" isDisabled>
                                {({fieldProps}) => <TextField {...fieldProps} />}
                            </Field>
                            <Field name="characterName" defaultValue={characterName} label="Character Name" isRequired>
                                {({fieldProps}) => <TextField {...fieldProps} />}
                            </Field>
                            <FormFooter>
                                <Button type="submit" appearance="primary">
                                    Submit
                                </Button>
                                <Button
                                    className="cancel-button"
                                    appearance="danger"
                                    onClick={() => {
                                        reset();
                                        closeModal();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </FormFooter>
                        </form>
                    )}
                </AKForm>
            </div>
        );
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        setPersons(reorder(persons, result.source.index, result.destination.index));
    };

    const makeDraggableContainer = content => {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={classnames('nexus-c-droppable-content', {
                                'nexus-c-droppable-content--dragging': snapshot.isDraggingOver,
                            })}
                        >
                            {content}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };

    return (
        <>
            <div className="nexus-c-persons-list__heading">{uiConfig.title}</div>
            {isEdit && (
                <div
                    className={classnames('nexus-c-persons-list__add', {
                        'nexus-c-persons-list__add--invalid': !isLastEntryValid,
                    })}
                >
                    <UserPicker
                        fieldId={uiConfig.htmlFor}
                        width="100%"
                        loadOptions={loadOptions}
                        value={searchText}
                        onInputChange={searchInputChanged}
                        onSelection={validateAndAddPerson}
                        placeholder={uiConfig.newLabel}
                    />
                </div>
            )}
            {isEdit && !isLastEntryValid && (
                <span className="nexus-c-persons-list__add--error">Person already exists!</span>
            )}
            {isEdit
                ? makeDraggableContainer(
                      persons &&
                          persons.map((person, i) => {
                              return (
                                  <NexusPerson
                                      key={uid(person.id, i)}
                                      person={person}
                                      index={i}
                                      hasCharacter={hasCharacter}
                                      onRemove={() => removePerson(person)}
                                      onEditCharacter={index => openCharacterModal(index)}
                                  />
                              );
                          })
                  )
                : persons &&
                  persons.map((person, i) => {
                      return <NexusPersonRO key={uid(person.id, i)} person={person} />;
                  })}
        </>
    );
};

NexusPersonsList.propTypes = {
    onChange: PropTypes.func,
    personsList: PropTypes.array,
    uiConfig: PropTypes.object,
    hasCharacter: PropTypes.bool,
    isEdit: PropTypes.bool,
    updateCastCrew: PropTypes.func,
};

NexusPersonsList.defaultProps = {
    personsList: [],
    uiConfig: CAST_CONFIG,
    hasCharacter: false,
    isEdit: false,
    updateCastCrew: () => null,
};

export default NexusPersonsList;
