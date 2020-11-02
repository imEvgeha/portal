/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import RemovePerson from './elements/RemovePerson';
import DragButton from './elements/DragButton';
import PersonCharacterContainer from './elements/PersonCharacterContainer';
import PersonTypeContainer from './elements/PersonTypeContainer';
import {Draggable} from 'react-beautiful-dnd';
import {Row} from 'reactstrap';
import {uid} from 'react-uid';
import './NexusPerson.scss';
import {
    CustomColumn,
    DraggableContent,
} from '../../../pages/legacy/containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';

// TODO: This seems to be extracted from legacy, should be refactored
const NexusPerson = ({person, index, hasCharacter, showPersonType, onRemove, onEditCharacter}) => {
    return (
        <Draggable draggableId={uid(person.id, index)} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <DraggableContent isDragging={snapshot.isDragging}>
                        <Row>
                            <CustomColumn xs={!hasCharacter ? 10 : 5}>
                                <PersonTypeContainer personName={person.displayName} personType={person.personType} />
                            </CustomColumn>
                            {hasCharacter ? (
                                <CustomColumn xs={5}>
                                    <PersonCharacterContainer
                                        className="nexus-c-person-character"
                                        index={index}
                                        onEditCharacter={onEditCharacter}
                                        characterName={person.characterName}
                                        isShown={true}
                                    />
                                </CustomColumn>
                            ) : null}
                            <CustomColumn xs={2}>
                                <RemovePerson onClick={onRemove} />
                                <DragButton {...provided.dragHandleProps} />
                            </CustomColumn>
                        </Row>
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
