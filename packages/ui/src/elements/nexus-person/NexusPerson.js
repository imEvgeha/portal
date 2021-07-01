/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {Draggable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import Badge from '@atlaskit/badge';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import DragButton from './elements/DragButton/DragButton';
import DraggableContent from './elements/DraggableContent/DraggableContent';
import RemovePerson from './elements/RemovePerson/RemovePerson';
import EditPerson from './elements/EditPerson/EditPerson';
import './NexusPerson.scss';

const NexusPerson = ({person, index, onRemove, onEditPerson, emetLanguage}) => {

    const localizedName = () => {
        if(person?.language === 'en' && emetLanguage === 'en')
            return person.displayNameEn;
        return person.displayName === person.displayNameEn &&  emetLanguage !== person?.language ? '(Needs translation)' : person.displayName;
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
                                {emetLanguage !== 'en' && <div>{person?.displayNameEn}</div>}
                                <div>
                                    {person.displayName === person.displayNameEn &&  emetLanguage !== person?.language &&
                                    <span title="Localized name not found"><Badge appearance="removed">!</Badge></span>}{" "}
                                    <Lozenge appearance="default">{person.personType}</Lozenge>
                                </div>

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
    emetLanguage: PropTypes.string,
};

NexusPerson.defaultProps = {
    onRemove: () => null,
    onEditPerson: () => null,
    emetLanguage: "en",
};

export default NexusPerson;
