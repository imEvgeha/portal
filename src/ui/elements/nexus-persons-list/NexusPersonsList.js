import React, {useState} from 'react';
import {uid} from 'react-uid';
import {
    ListGroup,
    Card,
    CardHeader,
    CardBody
} from 'reactstrap';
import PropTypes from 'prop-types';

import UserPicker from '@atlaskit/user-picker';
import { Label } from '@atlaskit/field-base';

import {DragDropContext, Droppable} from 'react-beautiful-dnd';

import {
    CAST,
    getFilteredCastList,
    getFilteredCrewList,
    PERSONS_PER_REQUEST
} from '../../../constants/metadata/configAPI';
import {searchPerson} from '../../../containers/metadata/service/ConfigService';

import {
    DroppableContent
} from '../../../containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';

import NexusPerson from './elements/NexusPerson';
import NexusPersonRO from './elements/NexusPersonRO';

import './NexusPersonsList.scss';
import NexusCharacterNameModal from './elements/NexusCharacterNameModal';
import {CAST_CONFIG} from './constants';


const NexusPersonsList = ({
    personsList,
    uiConfig,
    hasCharacter,
    showPersonType,
    onChange,
    isEdit
}) => {
    const [persons, setPersons] = useState(personsList || []);
    const [isLastEntryValid, setLastIsEntryValid] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const notify = () => {
        if (typeof onChange === 'function') {
            onChange(persons);
        }
    };

    const loadOptions = () => {
        const {type} = uiConfig;
        if (searchText.length < 2) return [];
        if (type === CAST) {
            return searchPerson(searchText, PERSONS_PER_REQUEST, type)
                .then(res => getFilteredCastList(res.data.data, true).map(e => {return {id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase()  , original: JSON.stringify(e)};})
                );
        } else {
            return searchPerson(searchText, PERSONS_PER_REQUEST, type)
                .then(res => getFilteredCrewList(res.data.data, true).map(e => {return {id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase(), original: JSON.stringify(e)};})
                );
        }
    };

    const isPersonValid = (entry) => {
        return persons === null || persons.findIndex(person =>
            person.id === entry.id && person.personType.toString().toLowerCase() === entry.personType.toString().toLowerCase()) < 0;
    };

    const validateAndAddPerson = (personJSON) => {
        const person = JSON.parse(personJSON.original);
        const isValid = isPersonValid(person);
        if (isValid) {
            addPerson(person);
            setSearchText('');
        }
        setLastIsEntryValid(isValid);
    };

    const addPerson = person => {
        setPersons([...[person], ...persons]);
        notify();
    };

    const removePerson = person => {
        setPersons(persons.filter(entry => {
            return entry.id !== person.id;
        }));
        notify();
    };

    const onCharacterSubmit = (newCharacterName) => {
        modalData.selectedPerson.characterName = newCharacterName;
        setPersons(persons);
        notify();
    };

    const closeModal = () => {
        setModalData({});
        setIsModalOpen(false);
    };

    const openModal = (id) => {
        const selectedPerson = persons && persons[id];
        setModalData({ selectedPerson: selectedPerson, characterName: selectedPerson.characterName, displayName: selectedPerson.displayName});
        setIsModalOpen(true);
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        setPersons(reorder(
            persons,
            result.source.index,
            result.destination.index
        ));
        notify();
    };

    const makeDraggableContainer = (content) => {
        return(
            <DragDropContext
                onDragEnd={onDragEnd}
            >
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <DroppableContent
                                isDragging={snapshot.isDraggingOver}
                            >
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
            <Card className='nexus-c-persons-list'>
                <CardHeader className='clearfix'>
                    <h4 className='float-left'>{uiConfig.title}</h4>
                </CardHeader>
                <CardBody>
                    <ListGroup className='nexus-c-persons-list__group'>
                        <Label
                            label={isEdit && uiConfig.newLabel}
                            isFirstChild
                            htmlFor={uiConfig.htmlFor}
                        >
                            {isEdit &&
                            (
                                <div className={`nexus-c-persons-list__add ${isLastEntryValid ? '' : 'invalid'}`}>
                                    <UserPicker
                                        id={uiConfig.htmlFor}
                                        width="100%"
                                        loadOptions={loadOptions}
                                        value={searchText}
                                        onInputChange={setSearchText}
                                        onSelection={validateAndAddPerson}
                                        placeholder={uiConfig.newLabel}
                                    />
                                </div>
                            )}
                            {isEdit && !isLastEntryValid &&
                            (
                                <span className='nexus-c-persons-list__add-error'>
                                    Person already exists!
                                </span>
                            )}
                            <Label
                                label={isEdit && uiConfig.listLabel}
                                isFirstChild
                            >
                                {isEdit ?
                                    makeDraggableContainer(
                                        persons && persons.map((person, i) => {
                                            return (
                                                <NexusPerson
                                                    key={uid(person.id, i)}
                                                    person={person}
                                                    index={i}
                                                    hasCharacter={hasCharacter}
                                                    showPersonType={showPersonType}
                                                    onRemove={() => removePerson(person)}
                                                    onEditCharacter={(index) => openModal(index)}
                                                />
                                            );
                                        })
                                    )
                                    :
                                    persons && persons.map((person, i) => {
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
            {isEdit &&
            (
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
};

NexusPersonsList.defaultProps = {
    personsList: [],
    uiConfig: CAST_CONFIG,
    hasCharacter: false,
    showPersonType: true,
    isEdit: false
};

export default NexusPersonsList;