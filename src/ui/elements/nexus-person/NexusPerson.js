/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import RemovePerson from './elements/RemovePerson';
import DragButton from './elements/DragButton';
import PersonCharacterContainer from './elements/PersonCharacterContainer';
import PersonTypeContainer from './elements/PersonTypeContainer';
import DraggableContent from './elements/DraggableContent';
import {Draggable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import './NexusPerson.scss';

const NexusPerson = ({person, index, hasCharacter, onRemove, onEditCharacter}) => {
    return (
        <Draggable draggableId={uid(person.id, index)} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <DraggableContent isDragging={snapshot.isDragging}>
                        <div className="nexus-c-nexus-person">
                            <PersonTypeContainer personName={person.displayName} personType={person.personType} />
                            <div className="nexus-c-nexus-person__character">
                                {hasCharacter ? (
                                    <PersonCharacterContainer
                                        index={index}
                                        onEditCharacter={onEditCharacter}
                                        characterName={person.characterName}
                                    />
                                ) : null}
                            </div>
                            <div className="nexus-c-nexus-person__character-buttons">
                                <RemovePerson onClick={onRemove} />
                                <DragButton {...provided.dragHandleProps} />
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
    hasCharacter: PropTypes.bool,
    onRemove: PropTypes.func,
    onEditCharacter: PropTypes.func,
};

NexusPerson.defaultProps = {
    hasCharacter: false,
};

export default NexusPerson;
