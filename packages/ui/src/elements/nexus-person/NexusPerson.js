/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {Draggable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import DragButton from './elements/DragButton/DragButton';
import DraggableContent from './elements/DraggableContent/DraggableContent';
import RemovePerson from './elements/RemovePerson/RemovePerson';
import EditPerson from './elements/EditPerson/EditPerson';
import './NexusPerson.scss';

const NexusPerson = ({person, index, onRemove, onEditPerson}) => {

    const localizedName = () => {
        if(person?.language === 'en')
            return person.displayNameEn;
        return person.displayName === person.displayNameEn ? '(Needs translation)' : person.displayName;
    }

    return (
        <Draggable draggableId={uid(person.id, index)} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <DraggableContent isDragging={snapshot.isDragging}>
                        <div className="nexus-c-nexus-person">
                            <div className="nexus-c-nexus-person__info">
                                <div>
                                    <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person__img" />
                                    {localizedName()}
                                </div>
                                {person?.language !== 'en' && <div>{person?.displayNameEn}</div>}
                                <Lozenge appearance="default">{person.personType}</Lozenge>
                            </div>
                            <div className="nexus-c-nexus-person__buttons">
                                <span title="Edit"><EditPerson onClick={onEditPerson} /></span>
                                <span title="Remove"><RemovePerson onClick={onRemove} /></span>
                                <span title="Drag this item"><DragButton {...provided.dragHandleProps} /></span>
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
};

NexusPerson.defaultProps = {
    onRemove: () => null,
    onEditPerson: () => null,
};

export default NexusPerson;
