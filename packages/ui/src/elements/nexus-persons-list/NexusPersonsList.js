/* eslint-disable */
import React, {useState, useEffect, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@atlaskit/button';
import UserPicker from '@atlaskit/user-picker';
import classnames from 'classnames';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';

import PropagateForm from '../../../../../src/pages/title-metadata/components/title-metadata-details/components/PropagateForm';
import {PROPAGATE_TITLE} from '../nexus-dynamic-form/constants';
import NexusPerson from '../nexus-person/NexusPerson';
import NexusPersonRO from '../nexus-person-ro/NexusPersonRO';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getDir} from '../nexus-dynamic-form/utils';
import {removeSeasonPerson} from '../../../../../src/pages/title-metadata/titleMetadataActions';
import {propagateRemovePersonsSelector} from '../../../../../src/pages/title-metadata/titleMetadataSelectors';
import CreateEditConfigForm from '../../../../../src/pages/legacy/containers/config/CreateEditConfigForm';
import {CAST, CAST_CONFIG, SEASON} from './constants';
import {loadOptions} from './utils';
import './NexusPersonsList.scss';
import {configService} from '../../../../../src/pages/legacy/containers/config/service/ConfigService';

const NexusPersonsList = ({
    personsList,
    uiConfig,
    getValues,
    setFieldValue,
    hasCharacter,
    isEdit,
    updateCastCrew,
    searchPerson,
    castCrewConfig,
    emetLanguage,
    setUpdate,
    isVerticalLayout,
    ...props
}) => {
    const dispatch = useDispatch();
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    const [persons, setPersons] = useState(personsList || []);
    const [searchText, setSearchText] = useState('');
    const propagateRemovePersons = useSelector(propagateRemovePersonsSelector);
    const {title, contentType, editorial, editorialMetadata} = getValues();

    useEffect(() => {
        const updatedPersons = [...personsList];
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
        setPersons(updatedPersons);
    }, [personsList]);

    const searchInputChanged = val => {
        setSearchText(val);
        const input = document.getElementById(uiConfig.htmlFor);
        input.setAttribute('dir', getDir(val));
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
        let updatedPersons = [...persons];

        if (person['personTypes'] && Array.isArray(person['personTypes'])) {
            let personWithType = {...person};
            delete personWithType['personTypes'];

            person['personTypes'].map(personType => {
                updatedPersons.push({...personWithType, personType: personType});
            });
        } else {
            updatedPersons.push(person);
        }

        const isCast = uiConfig.type === CAST;
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
        setPersons(updatedPersons);
        updateCastCrew(updatedPersons, isCast);
    };

    const removePerson = person => {
        const updatedPersons = persons.filter(entry => {
            return entry.id !== person.id || entry.personType !== person.personType;
        });

        const isCast = uiConfig.type === CAST;
        updatedPersons.forEach((person, index) => {
            person.creditsOrder = index;
        });
        setPersons(updatedPersons);
        updateCastCrew(updatedPersons, isCast);

        if (!isVerticalLayout && contentType === SEASON) {
            let isDuplicate = false;
            propagateRemovePersons.forEach(entry => {
                if (entry.id === person.id && entry.personType === person.personType) {
                    isDuplicate = true;
                }
            });

            const {id, personType, creditsOrder} = person;
            const payload = isDuplicate
                ? propagateRemovePersons
                : [...propagateRemovePersons, {id, personType, creditsOrder}];

            dispatch(removeSeasonPerson(payload));
        }

        const updateEditorialMetadata = editorialMetadata.map(emet => {
            const updatedCastCrew =
                emet?.castCrew &&
                emet.castCrew.filter(entry => {
                    return entry.id !== person.id || entry.personType !== person.personType;
                });

            const updatedEmet = {
                ...emet,
                castCrew: updatedCastCrew,
            };

            if (updatedEmet.language === editorial.language && updatedEmet.locale === editorial.locale) {
                setFieldValue('editorial', updatedEmet);

                if (isVerticalLayout) {
                    return updatedEmet
                }
            }

            if (!isVerticalLayout) {
                return updatedEmet; 
            } else {
                return emet
            }
        });

        setFieldValue('editorialMetadata', updateEditorialMetadata);

        closeModal();
        setUpdate(prev => !prev);
    };

    const closePropagateModal = () => {
        closeModal();
        setUpdate(prev => !prev);
    };

    const openRemoveModal = person => {
        const removeMessage = () => {
            if (isVerticalLayout) {
                return `Remove ${person.displayName} from this Emet`;
            } else {
                if (contentType === SEASON) {
                    return `Remove ${person.displayName} from this Season, it's Episodes and all related Emets?`;
                } else {
                    return `Remove ${person.displayName} from ${title}?`;
                }
            }
        };

        openModal(
            <>
                <p>{removeMessage()}</p>
                <div className="nexus-c-nexus-persons-list__remove-modal-actions">
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button onClick={() => removePerson(person)}>{'Remove'}</Button>
                </div>
            </>,
            {
                title: 'Remove',
                width: 'small',
            }
        );
    };

    const openPropagateModal = useCallback(person => {
        openModal(
            <PropagateForm
                person={person}
                getValues={getValues}
                setFieldValue={setFieldValue}
                onClose={closePropagateModal}
            />,
            {
                title: PROPAGATE_TITLE,
                width: 'small',
            }
        );
    }, []);

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

    const onEditPerson = async person => {
        const endpoint = castCrewConfig && castCrewConfig.urls && castCrewConfig.urls['CRUD'];
        const personData = await configService.get(endpoint, person.id);
        setCurrentRecord(personData);
        setOpenPersonModal(true);
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
            const customKey = person.id ? uid(person.id, i) : `${person.displayName}-${i}`;
            return (
                <NexusPerson
                    key={customKey}
                    person={person}
                    customKey={customKey}
                    index={i}
                    hasCharacter={hasCharacter}
                    onRemove={() => openRemoveModal(person)}
                    onPropagate={() => openPropagateModal(person)}
                    onEditPerson={() => onEditPerson(person)}
                    emetLanguage={emetLanguage}
                    {...props}
                />
            );
        });
    };

    const renderPersonsRO = () => {
        return persons.map((person, i) => {
            return <NexusPersonRO key={uid(person.id, i)} person={person} emetLanguage={emetLanguage} />;
        });
    };

    const editRecord = val => {
        const newVal = {...currentRecord, ...val};
        const endpoint = castCrewConfig && castCrewConfig.urls && castCrewConfig.urls['CRUD'];
        if (newVal.id) {
            configService.update(endpoint, newVal.id, newVal).then(response => {
                const updatedList = persons.map(person => {
                    if (person.id === newVal.id) {
                        return {
                            displayName: response.displayName,
                            creditsOrder: person.creditsOrder,
                            personType: person.personType,
                            id: response.id,
                            firstName: response.firstName,
                            lastName: response.lastName,
                        };
                    }
                    return person;
                });
                setPersons(updatedList);
                setCurrentRecord({});
                updateCastCrew(updatedList, uiConfig.type === CAST);
                setOpenPersonModal(false);
            });
        } else {
            configService.create(endpoint, newVal).then(person => {
                setCurrentRecord({});
                setOpenPersonModal(false);
                addPerson(person);
                setSearchText('');
            });
        }
    };

    const closePersonModal = () => {
        setOpenPersonModal(false);
        setCurrentRecord({});
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
                            onCancel={closePersonModal}
                        />
                    )}
                    <div className="nexus-c-nexus-persons-list__add">
                        <UserPicker
                            fieldId={uiConfig.htmlFor}
                            inputId={uiConfig.htmlFor}
                            width="100%"
                            loadOptions={() => loadOptions(uiConfig, searchText, searchPerson, emetLanguage)}
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
    setFieldValue: PropTypes.func,
    getValues: PropTypes.func,
    searchPerson: PropTypes.func,
    castCrewConfig: PropTypes.object,
    emetLanguage: PropTypes.string,
    setUpdate: PropTypes.func,
    isVerticalLayout: PropTypes.bool,
};

NexusPersonsList.defaultProps = {
    personsList: [],
    uiConfig: CAST_CONFIG,
    hasCharacter: false,
    isEdit: false,
    updateCastCrew: () => null,
    setFieldValue: () => null,
    getValues: () => null,
    searchPerson: () => null,
    setUpdate: () => null,
    castCrewConfig: {},
    emetLanguage: 'en',
    isVerticalLayout: false,
};

export default NexusPersonsList;
