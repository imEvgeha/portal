import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import UserPicker from '@atlaskit/user-picker';
import { Label } from '@atlaskit/field-base';
import Lozenge from '@atlaskit/lozenge';
import PersonListContainer from './PersonListContainer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DefaultUserIcon from '../../../../../img/default-user.png';
import CharacterModal from './CharacterModal';
import { Row, Col } from 'reactstrap';
import { DraggableContent, DroppableContent, PersonListFlag, ListText, CustomAddButton} from './CustomComponents';


class PersonList extends React.Component {
    static defaultProps = {
        personsLimit: Number.MAX_SAFE_INTEGER,
        showPersonType: false,
        isMultiColumn: false
    }
    constructor(props) {
        super(props);
        this.state = {
            searchPersonText: '',
            isPersonValid: true,
            isModalOpen: false
        };
    }

    isSelectedPersonValid = (selectedPerson) => {
        return this.props.persons === null || this.props.persons.findIndex(person =>
            person.id === selectedPerson.id && person.personType.toString().toLowerCase() === selectedPerson.personType.toString().toLowerCase()) < 0;
    };

    validateAndAddPerson = (personJSON) => {
        let person = JSON.parse(personJSON);
        let isValid = this.isSelectedPersonValid(person);
        const length = this.props.persons.length;
        if (isValid && length < this.props.personsLimit) {
            this.props.addPerson(person);
            this.setState({
                searchPersonText: ''
            });
        } else {
            if (isValid) {
                this.props.addPerson(person);
                this.setState({
                    searchPersonText: ''
                });
            }
        }
        this.setState({
            isPersonValid: isValid
        });
    };

    handleOnSelectPerson = (e) => {
        this.validateAndAddPerson(e.original);
    }

    handleInputChangePerson = e => {
        this.setState({
            searchPersonText: e
        });
    }
    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = this.reorder(
            this.props.persons,
            result.source.index,
            result.destination.index
        );
        this.props.onReOrder(items);
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    setSelectedPerson = (id) => {        
        const selectedPerson = this.props.persons && this.props.persons[id];
        this.toggleModal();
        this.setState({
            selectedPerson
        });
    }

    render() {
        return (
            <React.Fragment>
                <Col>
                    <PersonListContainer
                        title={this.props.personHeader}
                        label={this.props.personLabel}
                        htmlFor={this.props.personHtmlFor}>
                        <div style={{ marginTop: '5px', border: !this.state.isPersonValid ? '2px solid red' : null, borderRadius: '3px', width: '97%' }}>
                            <UserPicker
                                id={this.props.personHtmlFor}
                                width="100%"
                                loadOptions={() => this.props.loadOptionsPerson(this.state.searchPersonText, this.props.type)}
                                value={this.state.searchPersonText}
                                onInputChange={this.handleInputChangePerson}
                                onSelection={this.handleOnSelectPerson}
                                disableInput={this.props.persons.length >= this.props.personsLimit}
                                placeholder={this.props.persons.length >= this.props.personsLimit ? `You can add maximum ${this.props.personsLimit} ${this.props.type.toString().toLowerCase()} members` : this.props.personLabel}
                            />
                        </div>
                        {!this.state.isPersonValid && (<span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Person is already exists!</span>)}
                        <Label
                            label={this.props.personListLabel}
                            isFirstChild
                            htmlFor="person-list"
                        >
                            <DragDropContext
                                onDragEnd={this.onDragEnd}
                            >

                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <DroppableContent
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            isDragging={snapshot.isDraggingOver}
                                        >
                                            {this.props.persons &&
                                                this.props.persons.map((person, i) => {
                                                    return (
                                                        <Draggable key={person.id} draggableId={person.id} index={i}>
                                                            {(provided, snapshot) => (
                                                                <div                                       
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}>
                                                                    <DraggableContent
                                                                        isDragging={snapshot.isDragging}
                                                                    >                       
                                                                                    <Row>
                                                                                        <Col xs={!this.props.isMultiColumn ? 10 : 5} style={{display: 'flex', alignItems: 'center'}}>
                                                                                            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                                                            <img src={DefaultUserIcon} alt="Cast" style={{ width: '30px', height: '30px'}} />
                                                                                            {this.props.showPersonType && (
                                                                                                <PersonListFlag>
                                                                                                <span style={{ marginLeft: '10px' }}><Lozenge appearance={'default'}>{this.props.getFormatTypeName(person.personType)}</Lozenge></span>
                                                                                                </PersonListFlag>
                                                                                            )}
                                                                                            <span title={person.displayName} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{person.displayName}</span>
                                                                                            </div>
                                                                                        </Col>
                                                                                        {this.props.isMultiColumn ? (
                                                                                            <Col xs={5} style={{display: 'flex', alignItems: 'center'}}>
                                                                                            
                                                                                            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                                                            <ListText>
                                                                                                <PersonListFlag>
                                                                                                    <span style={{ marginLeft: '10px' }}><Lozenge appearance={'default'}>CHARACTER</Lozenge></span>
                                                                                                </PersonListFlag>
                                                                                                    {
                                                                                                        person.characterName ? 
                                                                                                            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '40%'}} title={person.characterName}>{person.characterName}</div>
                                                                                                        : <CustomAddButton onClick={() => this.setSelectedPerson(i)}>Add</CustomAddButton>
                                                                                                    }
                                                                                            </ListText>
                                                                                            </div>
                                                                                        </Col>
                                                                                        ) : null}
                                                                                        <Col xs={2} style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
                                                                                            <FontAwesome onClick={() => this.props.removePerson(person)} name="times" style={{marginRight: '5px', cursor: 'pointer', position: 'absolute', right: '35px'}} />
                                                                                            <FontAwesome name="bars" style={{marginLeft: '5px', cursor: 'move', position: 'absolute', right: '15px'}} {...provided.dragHandleProps} />
                                                                                        </Col>
                                                                                    </Row>    
                                                                    </DraggableContent>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                            {provided.placeholder}
                                        </DroppableContent>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Label>
                    </PersonListContainer>
                </Col>
                <CharacterModal parentId={this.props.parentId} updateEditedEditorialMetadata={this.props.updateEditedEditorialMetadata} handleAddCharacterName={this.props.handleAddCharacterName} selectedPerson={this.state.selectedPerson} isModalOpen={this.state.isModalOpen} toggleModal={this.toggleModal} />
            </React.Fragment>
        );
    }
}

PersonList.propTypes = {
    filterPersonList: PropTypes.func,
    persons: PropTypes.array,
    removePerson: PropTypes.func,
    loadOptionsPerson: PropTypes.any,
    personHeader: PropTypes.string,
    personLabel: PropTypes.string,
    personListLabel: PropTypes.string,
    personHtmlFor: PropTypes.string,
    type: PropTypes.string,
    getFormatTypeName: PropTypes.func,
    personsLimit: PropTypes.number,
    showPersonType: PropTypes.bool,
    addPerson: PropTypes.func,
    onReOrder: PropTypes.func,
    handleAddCharacterName: PropTypes.func
};

export default PersonList;