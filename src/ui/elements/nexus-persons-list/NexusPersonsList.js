/* eslint-disable */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep} from 'lodash';
import UserPicker from '@atlaskit/user-picker';
import classnames from 'classnames';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import {getFilteredCastList, getFilteredCrewList} from '../../../pages/legacy/constants/metadata/configAPI';
import {searchPerson} from '../../../pages/avails/right-details/rightDetailsServices';
import NexusCharacterNameModal from './elements/NexusCharacterNameModal';
import NexusPerson from '../nexus-person/NexusPerson';
import NexusPersonRO from '../nexus-person-ro/NexusPersonRO';
import {CAST, CAST_CONFIG, PERSONS_PER_REQUEST} from './constants';
import './NexusPersonsList.scss';

const NexusPersonsList = ({personsList, uiConfig, hasCharacter, isEdit, updateCastCrew}) => {
    const [persons, setPersons] = useState(personsList || []);
    const [searchText, setSearchText] = useState('');
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPersonIndex, setSelectedPersonIndex] = useState(null);
    const [modalInputValue, setModalInputValue] = useState('');

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
                    person.id === entry.id &&
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
        setLastIsEntryValid(isValid);
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

    const onCharacterSubmit = () => {
        const updatedPersons = cloneDeep(persons);
        const isCast = uiConfig.type === CAST;
        updatedPersons[selectedPersonIndex].characterName = modalInputValue;
        setPersons(updatedPersons);
        setSelectedPersonIndex(null);
        setModalInputValue('');
        updateCastCrew(updatedPersons, isCast);
        closeModal();
    };

    const closeModal = () => {
        setModalData({});
        setIsModalOpen(false);
        setSelectedPersonIndex(null);
        setModalInputValue('');
    };

    const openModal = id => {
        setSelectedPersonIndex(id);
        const selectedPerson = persons && persons[id];
        setModalInputValue(selectedPerson.characterName);
        setModalData({
            characterName: selectedPerson.characterName,
            displayName: selectedPerson.displayName,
        });
        setIsModalOpen(true);
    };

    const onModalInputChanged = event => {
        const {value} = event.target;
        setModalInputValue(value);
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
                <div className={`nexus-c-persons-list__add`}>
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
                                      onEditCharacter={index => openModal(index)}
                                  />
                              );
                          })
                  )
                : persons &&
                  persons.map((person, i) => {
                      return <NexusPersonRO key={uid(person.id, i)} person={person} />;
                  })}
            <NexusCharacterNameModal
                onSubmit={onCharacterSubmit}
                displayName={modalData.displayName}
                characterName={modalData.characterName}
                value={modalInputValue}
                onChange={onModalInputChanged}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
            />
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
