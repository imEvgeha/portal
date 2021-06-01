/* eslint-disable */
import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import UserPicker from '@atlaskit/user-picker';
import classnames from 'classnames';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import NexusPerson from '../nexus-person/NexusPerson';
import NexusPersonRO from '../nexus-person-ro/NexusPersonRO';
import CharacterModal from './components/CharacterModal';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import CreateEditConfigForm from '../../../../../src/pages/legacy/containers/config/CreateEditConfigForm';
import {CAST, CAST_CONFIG, ADD_CHARACTER_NAME, EDIT_CHARACTER_NAME} from './constants';
import {loadOptions} from './utils';
import './NexusPersonsList.scss';
import {configService} from '../../../../../src/pages/legacy/containers/config/service/ConfigService';
import {get} from 'lodash';

const NexusPersonsList = ({
    personsList,
    uiConfig,
    hasCharacter,
    isEdit,
    updateCastCrew,
    searchPerson,
    castCrewConfig,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    const [persons, setPersons] = useState(personsList || []);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const updatedPersons = [...personsList];
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
        setPersons(updatedPersons);
    }, [personsList]);

    const searchInputChanged = val => {
        setSearchText(val);
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
        if (isObject(personJSON) && personJSON.id === 'create') {
            setOpenPersonModal(true);
        } else {
            const person = JSON.parse(personJSON.original);
            const isValid = isPersonValid(person);
            if (isValid) {
                addPerson(person);
                setSearchText('');
            } else {
                openModal(
                    <Button appearance="primary" onClick={closeModal}>
                        OK
                    </Button>,
                    {
                        title: (
                            <div className="nexus-c-nexus-persons-list__error-modal-title">Person already exists!</div>
                        ),
                        width: 'small',
                    }
                );
            }
        }
    };

    const addPerson = person => {
        const updatedPersons = [...[person], ...persons];
        const isCast = uiConfig.type === CAST;
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
        setPersons(updatedPersons);
        updateCastCrew(updatedPersons, isCast);
    };

    const removePerson = person => {
        const updatedPersons = persons.filter(entry => {
            return entry.id !== person.id;
        });
        const isCast = uiConfig.type === CAST;
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
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
        const message = data.characterName ? EDIT_CHARACTER_NAME : ADD_CHARACTER_NAME;
        openModal(characterModalContent(data, id), {
            title: <div>{message}</div>,
            width: 'medium',
        });
    };

    const characterModalContent = (data, id) => {
        return (
            <CharacterModal personId={id} closeModal={closeCharacterModal} onModalSubmit={onModalSubmit} data={data} />
        );
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

    const reorder = (list, startIndex, endIndex) => {
        const updatedPersons = [...list];
        const [removed] = updatedPersons.splice(startIndex, 1);
        updatedPersons.splice(endIndex, 0, removed);
        return updatedPersons;
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const updatedPersons = reorder(persons, result.source.index, result.destination.index);
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
        setPersons(updatedPersons);
        const isCast = uiConfig.type === CAST;
        updateCastCrew(updatedPersons, isCast);
    };

    const makeDraggableContainer = content => {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={classnames('nexus-c-nexus-persons-list__droppable-content', {
                                'nexus-c-nexus-persons-list__droppable-content--dragging': snapshot.isDraggingOver,
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

    const renderPersons = () => {
        return persons.map((person, i) => {
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
        });
    };

    const renderPersonsRO = () => {
        return persons.map((person, i) => {
            return <NexusPersonRO key={uid(person.id, i)} person={person} />;
        });
    };

    const editRecord = val => {
        const newVal = {...currentRecord, ...val};
        if (newVal.id) {
            configService
                .update(castCrewConfig && castCrewConfig.urls && castCrewConfig.urls['CRUD'], newVal.id, newVal)
                .then(response => {
                    const data = this.state.data.slice(0);
                    const index = data.findIndex(item => item.id === newVal.id);
                    data[index] = response;
                    setCurrentRecord(null);
                    setOpenPersonModal(false);
                    // this.setState({data, openEditPersonModal: false});
                });
        } else {
            configService
                .create(castCrewConfig && castCrewConfig.urls && castCrewConfig.urls['CRUD'], newVal)
                .then(response => {
                    setOpenPersonModal(false);
                    let person = response;
                    if (response['personTypes'] && Array.isArray(response['personTypes'])) {
                        person = {...person, personType: get(response['personTypes'], '[0]', null)};
                    }
                    delete person['personTypes'];
                    addPerson(person);
                    setSearchText('');
                });
        }
    };

    return (
        <>
            <div className="nexus-c-nexus-persons-list__heading">{uiConfig.title}</div>
            {isEdit ? (
                <>
                    {castCrewConfig && openPersonModal && (
                        <CreateEditConfigForm
                            onRemoveItem={() => {}}
                            schema={castCrewConfig && castCrewConfig.uiSchema}
                            label={castCrewConfig && castCrewConfig.displayName}
                            displayName={castCrewConfig && castCrewConfig.displayName}
                            value={currentRecord}
                            onSubmit={editRecord}
                            onCancel={() => setOpenPersonModal(false)}
                        />
                    )}
                    <div className="nexus-c-nexus-persons-list__add">
                        <UserPicker
                            fieldId={uiConfig.htmlFor}
                            width="100%"
                            loadOptions={() => loadOptions(uiConfig, searchText, searchPerson)}
                            value={searchText}
                            onInputChange={searchInputChanged}
                            onSelection={validateAndAddPerson}
                            placeholder={uiConfig.newLabel}
                        />
                    </div>
                    {makeDraggableContainer(persons && renderPersons())}
                </>
            ) : (
                <>{persons && renderPersonsRO()}</>
            )}
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
    searchPerson: PropTypes.func,
    castCrewConfig: PropTypes.object,
};

NexusPersonsList.defaultProps = {
    personsList: [],
    uiConfig: CAST_CONFIG,
    hasCharacter: false,
    isEdit: false,
    updateCastCrew: () => null,
    searchPerson: () => null,
    castCrewConfig: {},
};

export default NexusPersonsList;
