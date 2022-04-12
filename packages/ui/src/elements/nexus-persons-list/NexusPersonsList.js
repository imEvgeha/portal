import React, {useState, useEffect, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import UserPicker from '@atlaskit/user-picker';
import {configService} from "@vubiquity-nexus/portal-utils/lib/services/ConfigService";
import classnames from 'classnames';
import {cloneDeep, isObject} from 'lodash';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {useDispatch, useSelector} from 'react-redux';
import {uid} from 'react-uid';
import {addToast} from "../../toast/NexusToastNotificationActions";
import CreateEditConfig from '../nexus-create-edit-config/CreateEditConfig';
import {PROPAGATE_TITLE} from '../nexus-dynamic-form/constants';
import {checkIfEmetIsEditorial, getDir} from '../nexus-dynamic-form/utils';
import {NexusModalContext} from "../nexus-modal/NexusModal";
import NexusPersonRO from '../nexus-person-ro/NexusPersonRO';
import NexusPerson from '../nexus-person/NexusPerson';
import PropagateForm from '../nexus-person/elements/PropagateForm/PropagateForm';
import {loadOptions} from './utils';
import {CAST, CAST_CONFIG, SEASON} from './constants';
import './NexusPersonsList.scss';

const propagateRemovePersonsSelector = state => state?.titleMetadata?.propagateRemovePersons || [];

export const PROPAGATE_REMOVE_PERSONS = 'PROPAGATE_REMOVE_PERSONS';
export const removeSeasonPerson = payload => ({
    type: PROPAGATE_REMOVE_PERSONS,
    payload,
});

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
    isEditable,
    ...props
}) => {
    const dispatch = useDispatch();
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [openPersonModal, setOpenPersonModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    const [persons, setPersons] = useState(personsList || []);

    const [searchText, setSearchText] = useState('');
    const propagateRemovePersons = useSelector(propagateRemovePersonsSelector);
    const {title, contentType, castCrew, editorialMetadata} = getValues();
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const updatedPersons = [...personsList];

        updatedPersons.forEach((person, index) => {
            // Avails crew doesn't come with id so displayName is used instead
            !person.hasOwnProperty('id') ? (person.id = person.displayName) : person;
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
        const updatedPersons = [...persons];

        if (person['personTypes'] && Array.isArray(person['personTypes'])) {
            const personWithType = {...person};
            delete personWithType['personTypes'];

            person['personTypes'].forEach(personType => {
                updatedPersons.push({...personWithType, personType});
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
                : [...propagateRemovePersons, {id, personType, creditsOrder, propagateToEmet: true}];

            dispatch(removeSeasonPerson(payload));
        }

        const updateEditorialMetadata = editorialMetadata?.map(emet => {
            const updatedCastCrew =
                emet?.castCrew &&
                emet.castCrew.filter(entry => {
                    return entry.id !== person.id || entry.personType !== person.personType;
                });

            const updatedEmet = {
                ...emet,
                castCrew: updatedCastCrew,
            };

            const {editorial} = getValues();

            if (checkIfEmetIsEditorial(emet, editorial)) {
                setFieldValue('editorial', {...editorial, castCrew: updatedCastCrew});
                if (isVerticalLayout) {
                    return updatedEmet;
                }
            }

            if (!isVerticalLayout) {
                return updatedEmet;
            }
            return emet;
        });

        const updatedCastCrew = castCrew
            ? castCrew?.filter(entry => {
                  return entry.id !== person.id || entry.personType !== person.personType;
              })
            : null;

        !isVerticalLayout && setFieldValue('castCrew', updatedCastCrew);
        editorialMetadata && setFieldValue('editorialMetadata', updateEditorialMetadata);
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
            } else if (contentType === SEASON) {
                return `Remove ${person.displayName} from this Season, it's Episodes and all related Emets?`;
            }

            return `Remove ${person.displayName} from ${title}?`;
        };

        openModal(
            <>
                <p>{removeMessage()}</p>
                <div className="nexus-c-nexus-persons-list__remove-modal-actions">
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button onClick={() => removePerson(person)}>Remove</Button>
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
                    isEditable={isEditable}
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

        const successToast = {
            severity: 'success',
            // description: `Cast or Crew has been successfully ${newVal.id ? 'updated.' : 'added.'}`,
            detail: `${newVal.displayName} has been successfully ${newVal.id ? 'updated.' : 'added.'}`,
        };

        setSubmitLoading(true);

        if (newVal.id) {
            configService.update(endpoint, newVal.id, newVal).then(
                response => {
                    dispatch(addToast(successToast));
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
                    setSubmitLoading(false);
                },
                () => {
                    setSubmitLoading(false);
                }
            );
        } else {
            configService.create(endpoint, newVal).then(
                person => {
                    dispatch(addToast(successToast));
                    setCurrentRecord({});
                    setOpenPersonModal(false);
                    addPerson(person);
                    setSearchText('');
                    setSubmitLoading(false);
                },
                () => {
                    setSubmitLoading(false);
                }
            );
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
                        <CreateEditConfig
                            visible={openPersonModal}
                            schema={castCrewConfig?.uiSchema}
                            label={castCrewConfig?.displayName}
                            displayName={castCrewConfig?.displayName}
                            values={cloneDeep(currentRecord)}
                            onSubmit={editRecord}
                            submitLoading={submitLoading}
                            onHide={closePersonModal}
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
    isEditable: PropTypes.bool,
};

NexusPersonsList.defaultProps = {
    onChange: null,
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
    isEditable: true,
};

export default NexusPersonsList;
