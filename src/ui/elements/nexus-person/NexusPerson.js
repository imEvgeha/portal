/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
import RemovePerson from './elements/RemovePerson';
import {Draggable} from 'react-beautiful-dnd';
import {Row} from 'reactstrap';
import {uid} from 'react-uid';
import './NexusPerson.scss';
import DefaultUserIcon from '../../../assets/img/default-user.png';
import {getFormatTypeName} from '../../../pages/legacy/constants/metadata/configAPI';
import {
    CustomColumn,
    CustomDragButton,
    CustomEllipsis,
    DraggableContent,
    ListItemText,
    ListText,
    PersonListFlag,
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
                                <CustomEllipsis>
                                    <img src={DefaultUserIcon} alt="Person" className="nexus-c-person-avatar" />
                                    {showPersonType && (
                                        <PersonListFlag>
                                            <span className="nexus-c-person-type">
                                                <Lozenge appearance="default">
                                                    {getFormatTypeName(person.personType)}
                                                </Lozenge>
                                            </span>
                                        </PersonListFlag>
                                    )}
                                    <CustomEllipsis isInline={true} title={person.displayName}>
                                        {person.displayName}
                                    </CustomEllipsis>
                                </CustomEllipsis>
                            </CustomColumn>
                            {hasCharacter ? (
                                <CustomColumn xs={5}>
                                    <CustomEllipsis className="nexus-c-person-character-container">
                                        <ListText className="nexus-c-person-character">
                                            <PersonListFlag>
                                                <span className="nexus-c-person-separator">
                                                    <Lozenge appearance="default">CHARACTER</Lozenge>
                                                </span>
                                            </PersonListFlag>
                                            {person.characterName ? (
                                                <ListItemText
                                                    isEditMode
                                                    onClick={() => onEditCharacter(index)}
                                                    title={person.characterName}
                                                >
                                                    {person.characterName}
                                                </ListItemText>
                                            ) : (
                                                <Button onClick={() => onEditCharacter(index)}>Add</Button>
                                            )}
                                        </ListText>
                                    </CustomEllipsis>
                                </CustomColumn>
                            ) : null}
                            <CustomColumn xs={2}>
                                <RemovePerson onClick={onRemove} />
                                <CustomDragButton name="bars" {...provided.dragHandleProps} />
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
    showPersonType: PropTypes.bool,
    onRemove: PropTypes.func,
    onEditCharacter: PropTypes.func,
};

NexusPerson.defaultProps = {
    hasCharacter: false,
    showPersonType: true,
};

export default NexusPerson;
