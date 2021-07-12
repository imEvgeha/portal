/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {Draggable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import Tooltip from '@atlaskit/tooltip';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import DragButton from './elements/DragButton/DragButton';
import DraggableContent from './elements/DraggableContent/DraggableContent';
import RemovePerson from './elements/RemovePerson/RemovePerson';
import EditPerson from './elements/EditPerson/EditPerson';
import {NEEDS_TRANSLATION, LOCALIZED_NOT_DEFINED} from '../nexus-persons-list/constants';
import './NexusPerson.scss';

const NexusPerson = ({person, index, onRemove, onEditPerson, emetLanguage}) => {
    const localizedName = () => {
        if (person?.language === 'en' && emetLanguage === 'en') return person.displayNameEn;
        return person.displayName === person.displayNameEn && emetLanguage !== person?.language
            ? NEEDS_TRANSLATION
            : person.displayName;
    };

    return (
        <Draggable draggableId={uid(person.id, index)} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <DraggableContent isDragging={snapshot.isDragging}>
                        <div className="nexus-c-nexus-person">
                            <div className="nexus-c-nexus-person__info">
                                <div>
                                    <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person__img" />
                                    <span
                                        className={
                                            person.displayNameEn && emetLanguage !== person?.language
                                                ? 'nexus-c-nexus-person-italic'
                                                : ''
                                        }
                                    >
                                        {localizedName()}
                                    </span>
                                </div>
                                {emetLanguage !== 'en' && (
                                    <div
                                        className={
                                            person.displayNameEn && emetLanguage !== person?.language
                                                ? 'nexus-c-nexus-person-fade'
                                                : ''
                                        }
                                    >
                                        {person?.displayNameEn}
                                    </div>
                                )}
                                <div>
                                    {person.displayName === person.displayNameEn && emetLanguage !== person?.language && (
                                        <Tooltip content={LOCALIZED_NOT_DEFINED}>
                                            <div className="nexus-c-nexus-person-warning" />
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <div className="nexus-c-nexus-person__buttons">
                                <span title="Edit">
                                    <EditPerson onClick={onEditPerson} />
                                </span>
                                <span title="Remove">
                                    <RemovePerson onClick={onRemove} />
                                </span>
                                <span title="Drag this item">
                                    <DragButton {...provided.dragHandleProps} />
                                </span>
                            </div>
                        </div>
                    </DraggableContent>
                </div>
            )}
        </Draggable>
    );
};

NexusPerson.propTypes = {
    person: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func,
    onEditPerson: PropTypes.func,
    emetLanguage: PropTypes.string,
};

NexusPerson.defaultProps = {
    onRemove: () => null,
    onEditPerson: () => null,
    emetLanguage: 'en',
};

export default NexusPerson;
