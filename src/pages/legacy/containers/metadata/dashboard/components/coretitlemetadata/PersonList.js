import React from 'react';
import PropTypes from 'prop-types';
import UserPicker from '@atlaskit/user-picker';
import {Label} from '@atlaskit/field-base';
import Lozenge from '@atlaskit/lozenge';
import {Row, Col} from 'reactstrap';
import {uid} from 'react-uid';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import PersonListContainer from './PersonListContainer';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import CharacterModal from './CharacterModal';
import {
    DraggableContent,
    DroppableContent,
    PersonListFlag,
    ListText,
    CustomAddButton,
    CustomColumn,
    CustomEllipsis,
    ListItemText,
    CustomDeleteButton,
    CustomDragButton,
} from './CustomComponents';

class PersonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchPersonText: '',
            isPersonValid: true,
            isModalOpen: false,
            modalType: null,
            selectedId: null,
        };
    }

    isSelectedPersonValid = selectedPerson => {
        return (
            this.props.persons === null ||
            this.props.persons.findIndex(
                person =>
                    person.id === selectedPerson.id &&
                    person.personType.toString().toLowerCase() === selectedPerson.personType.toString().toLowerCase()
            ) < 0
        );
    };

    validateAndAddPerson = personJSON => {
        const person = JSON.parse(personJSON);
        const isValid = this.isSelectedPersonValid(person);
        if (isValid) {
            this.props.addPerson(person);
            this.setState({
                searchPersonText: '',
            });
        }
        this.setState({
            isPersonValid: isValid,
        });
    };

    handleOnSelectPerson = e => {
        this.validateAndAddPerson(e.original);
    };

    handleInputChangePerson = e => {
        this.setState({
            searchPersonText: e,
        });
    };
    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const items = this.reorder(this.props.persons, result.source.index, result.destination.index);
        this.props.onReOrder(items);
    };

    toggleModal = () => {
        this.setState(prevState => ({
            isModalOpen: !prevState.isModalOpen,
        }));
    };

    setSelectedPerson = (id, type) => {
        const modalType = type === 'add' ? 'Add' : 'Edit';
        const selectedPerson = this.props.persons && this.props.persons[id];
        this.toggleModal();
        this.setState({
            selectedId: id,
            selectedPerson,
            modalType,
        });
    };

    render() {
        return (
            <>
                <Col>
                    <PersonListContainer
                        title={this.props.personHeader}
                        label={this.props.personLabel}
                        htmlFor={this.props.personHtmlFor}
                    >
                        <div
                            style={{
                                marginTop: '5px',
                                border: !this.state.isPersonValid ? '2px solid red' : null,
                                borderRadius: '3px',
                                width: '97%',
                            }}
                        >
                            <UserPicker
                                id={this.props.personHtmlFor}
                                width="100%"
                                loadOptions={() =>
                                    this.props.loadOptionsPerson(this.state.searchPersonText, this.props.type)
                                }
                                value={this.state.searchPersonText}
                                onInputChange={this.handleInputChangePerson}
                                onSelection={this.handleOnSelectPerson}
                                placeholder={this.props.personLabel}
                            />
                        </div>
                        {!this.state.isPersonValid && (
                            <span style={{color: '#e74c3c', fontWeight: 'bold'}}>Person is already exists!</span>
                        )}
                        <Label label={this.props.personListLabel} isFirstChild htmlFor="person-list">
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <DroppableContent isDragging={snapshot.isDraggingOver}>
                                                {this.props.persons &&
                                                    this.props.persons.map((person, i) => {
                                                        return (
                                                            <Draggable
                                                                key={uid(person.id, i)}
                                                                draggableId={person.id}
                                                                index={i}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                    >
                                                                        <DraggableContent
                                                                            isDragging={snapshot.isDragging}
                                                                        >
                                                                            <Row>
                                                                                <CustomColumn
                                                                                    xs={
                                                                                        !this.props.isMultiColumn
                                                                                            ? 10
                                                                                            : 5
                                                                                    }
                                                                                >
                                                                                    <CustomEllipsis>
                                                                                        <img
                                                                                            src={DefaultUserIcon}
                                                                                            alt="Cast"
                                                                                            style={{
                                                                                                width: '30px',
                                                                                                height: '30px',
                                                                                            }}
                                                                                        />
                                                                                        {this.props.showPersonType && (
                                                                                            <PersonListFlag>
                                                                                                <span
                                                                                                    style={{
                                                                                                        marginLeft:
                                                                                                            '10px',
                                                                                                    }}
                                                                                                >
                                                                                                    <Lozenge appearance="default">
                                                                                                        {this.props.getFormatTypeName(
                                                                                                            person.personType
                                                                                                        )}
                                                                                                    </Lozenge>
                                                                                                </span>
                                                                                            </PersonListFlag>
                                                                                        )}
                                                                                        <CustomEllipsis
                                                                                            isInline={true}
                                                                                            title={person.displayName}
                                                                                        >
                                                                                            {person.displayName}
                                                                                        </CustomEllipsis>
                                                                                    </CustomEllipsis>
                                                                                </CustomColumn>
                                                                                {this.props.isMultiColumn ? (
                                                                                    <CustomColumn xs={5}>
                                                                                        <CustomEllipsis
                                                                                            style={{width: '100%'}}
                                                                                        >
                                                                                            <ListText
                                                                                                style={{width: '100%'}}
                                                                                            >
                                                                                                <PersonListFlag>
                                                                                                    <span
                                                                                                        style={{
                                                                                                            marginLeft:
                                                                                                                '10px',
                                                                                                        }}
                                                                                                    >
                                                                                                        <Lozenge appearance="default">
                                                                                                            CHARACTER
                                                                                                        </Lozenge>
                                                                                                    </span>
                                                                                                </PersonListFlag>
                                                                                                {person.characterName ? (
                                                                                                    <ListItemText
                                                                                                        isEditMode
                                                                                                        onClick={() =>
                                                                                                            this.setSelectedPerson(
                                                                                                                i,
                                                                                                                'edit'
                                                                                                            )
                                                                                                        }
                                                                                                        title={
                                                                                                            person.characterName
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            person.characterName
                                                                                                        }
                                                                                                    </ListItemText>
                                                                                                ) : (
                                                                                                    <CustomAddButton
                                                                                                        onClick={() =>
                                                                                                            this.setSelectedPerson(
                                                                                                                i,
                                                                                                                'add'
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        Add
                                                                                                    </CustomAddButton>
                                                                                                )}
                                                                                            </ListText>
                                                                                        </CustomEllipsis>
                                                                                    </CustomColumn>
                                                                                ) : null}
                                                                                <CustomColumn xs={2}>
                                                                                    <CustomDeleteButton
                                                                                        onClick={() =>
                                                                                            this.props.removePerson(
                                                                                                person
                                                                                            )
                                                                                        }
                                                                                        name="times"
                                                                                    />
                                                                                    <CustomDragButton
                                                                                        name="bars"
                                                                                        {...provided.dragHandleProps}
                                                                                    />
                                                                                </CustomColumn>
                                                                            </Row>
                                                                        </DraggableContent>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                {provided.placeholder}
                                            </DroppableContent>
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Label>
                    </PersonListContainer>
                </Col>
                <CharacterModal
                    parentId={this.props.parentId}
                    handleAddCharacterName={this.props.handleAddCharacterName}
                    selectedPerson={this.state.selectedPerson}
                    selectedId={this.state.selectedId}
                    isModalOpen={this.state.isModalOpen}
                    toggleModal={this.toggleModal}
                    modalType={this.state.modalType}
                    data={this.props.data}
                />
            </>
        );
    }
}

PersonList.propTypes = {
    isMultiColumn: PropTypes.bool,
    persons: PropTypes.array,
    removePerson: PropTypes.func,
    loadOptionsPerson: PropTypes.any,
    personHeader: PropTypes.string,
    personLabel: PropTypes.string,
    personListLabel: PropTypes.string,
    personHtmlFor: PropTypes.string,
    type: PropTypes.string,
    getFormatTypeName: PropTypes.func,
    showPersonType: PropTypes.bool,
    addPerson: PropTypes.func,
    onReOrder: PropTypes.func,
    handleAddCharacterName: PropTypes.func,
};

PersonList.defaultProps = {
    showPersonType: false,
    isMultiColumn: false,
};

export default PersonList;
