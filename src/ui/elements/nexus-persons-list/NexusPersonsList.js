/* eslint-disable */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Label} from '@atlaskit/field-base';
import UserPicker from '@atlaskit/user-picker';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import {ListGroup, Card, CardHeader, CardBody} from 'reactstrap';
import {
    CAST,
    getFilteredCastList,
    getFilteredCrewList,
    PERSONS_PER_REQUEST,
} from '../../../pages/legacy/constants/metadata/configAPI';
import {DroppableContent} from '../../../pages/legacy/containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';
import {searchPerson} from '../../../pages/legacy/containers/metadata/service/ConfigService';
import NexusCharacterNameModal from './elements/NexusCharacterNameModal';
import NexusPerson from './elements/NexusPerson';
import NexusPersonRO from './elements/NexusPersonRO';
import {CAST_CONFIG} from './constants';
import './NexusPersonsList.scss';

const NexusPersonsList = ({personsList, uiConfig, hasCharacter, showPersonType, isEdit, updateCastCrew}) => {
    const [persons, setPersons] = useState(personsList || []);
    const [isLastEntryValid, setLastIsEntryValid] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const onCharacterSubmit = newCharacterName => {
        modalData.selectedPerson.characterName = newCharacterName;
        setPersons(persons);
        closeModal();
    };

    const closeModal = () => {
        setModalData({});
        setIsModalOpen(false);
    };

    const openModal = id => {
        const selectedPerson = persons && persons[id];
        setModalData({
            selectedPerson: selectedPerson,
            characterName: selectedPerson.characterName,
            displayName: selectedPerson.displayName,
        });
        setIsModalOpen(true);
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
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <DroppableContent isDragging={snapshot.isDraggingOver}>
                                {content}
                                {provided.placeholder}
                            </DroppableContent>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };

    return (
        <>
            <Card className="nexus-c-persons-list">
                <CardHeader className="clearfix">
                    <h4 className="float-left">{uiConfig.title}</h4>
                </CardHeader>
                <CardBody>
                    <ListGroup className="nexus-c-persons-list__group">
                        <Label label={isEdit && uiConfig.newLabel} isFirstChild htmlFor={uiConfig.htmlFor}>
                            {isEdit && (
                                <div className={`nexus-c-persons-list__add ${isLastEntryValid ? '' : 'invalid'}`}>
                                    <UserPicker
                                        id={uiConfig.htmlFor}
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
                                <span className="nexus-c-persons-list__add-error">Person already exists!</span>
                            )}
                            <Label label={isEdit && uiConfig.listLabel} isFirstChild>
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
                                                          showPersonType={showPersonType}
                                                          onRemove={() => removePerson(person)}
                                                          onEditCharacter={index => openModal(index)}
                                                      />
                                                  );
                                              })
                                      )
                                    : persons &&
                                      persons.map((person, i) => {
                                          return (
                                              <NexusPersonRO
                                                  key={uid(person.id, i)}
                                                  person={person}
                                                  showPersonType={showPersonType}
                                              />
                                          );
                                      })}
                            </Label>
                        </Label>
                    </ListGroup>
                </CardBody>
            </Card>
            {isEdit && (
                <NexusCharacterNameModal
                    onSubmit={onCharacterSubmit}
                    hint={modalData.displayName}
                    defaultVal={modalData.characterName}
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                />
            )}
        </>
    );
};

NexusPersonsList.propTypes = {
    onChange: PropTypes.func,
    personsList: PropTypes.array,
    uiConfig: PropTypes.object,
    hasCharacter: PropTypes.bool,
    showPersonType: PropTypes.bool,
    isEdit: PropTypes.bool,
    updateCastCrew: PropTypes.func,
};

NexusPersonsList.defaultProps = {
    personsList: [],
    uiConfig: CAST_CONFIG,
    hasCharacter: false,
    showPersonType: true,
    isEdit: false,
    updateCastCrew: () => null,
};

export default NexusPersonsList;
