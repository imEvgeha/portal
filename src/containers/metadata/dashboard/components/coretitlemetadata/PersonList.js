import React from 'react';
import PropTypes from 'prop-types';
import {
    Col
} from 'reactstrap';

import UserPicker from '@atlaskit/user-picker';
import { Label } from '@atlaskit/field-base';
import Lozenge from '@atlaskit/lozenge';
import PersonListContainer from './PersonListContainer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class PersonList extends React.Component {
    static defaultProps = {
        personsLimit: Number.MAX_SAFE_INTEGER,
        showPersonType: false
    }
    constructor(props) {
        super(props);
        this.state = {
            searchPersonText: '',
            isPersonValid: true
        };
    }

    isSelectedPersonValid = (selectedPerson) => {
        return this.props.persons === null || this.props.persons.findIndex(person =>
            person.id === selectedPerson.id && person.personType === selectedPerson.personType) < 0;
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
                                placeholder={this.props.persons.length >= this.props.personsLimit ? 'You can add maximum 5 cast members' : this.props.personLabel}
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
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {this.props.persons &&
                                                this.props.persons.map((person, i) => {
                                                    return (
                                                        <Draggable key={person.id} draggableId={person.id} index={i}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}>
                                                                    <div style={{ border: '1px solid #EEE', padding: '5px', backgroundColor: '#FAFBFC', width: '97%' }}>
                                                                        <div style={{ boxSizing: 'border-box', width: '6%', display: 'inline-block', padding: '7px', verticalAlign: 'middle' }}>
                                                                            <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{ width: '30px', height: '30px' }} />
                                                                        </div>
                                                                        {this.props.showPersonType ? (
                                                                            <div style={{ boxSizing: 'border-box', width: '14%', display: 'inline-block', padding: '7px', verticalAlign: 'middle' }}>
                                                                                <span style={{ marginLeft: '10px' }}><Lozenge appearance={'default'}>{this.props.getFormatTypeName(person.personType)}</Lozenge></span>
                                                                            </div>) : null}
                                                                        <div style={{ boxSizing: 'border-box', width: !this.props.showPersonType ? '89%' : '75%', display: 'inline-block', verticalAlign: 'middle' }}>
                                                                            <UserPicker
                                                                                width="100%"
                                                                                appearance="normal"
                                                                                subtle
                                                                                value={person.displayName}
                                                                                disableInput={true}
                                                                                search={person.displayName}
                                                                                onClear={() => this.props.removePerson(person)}
                                                                            />
                                                                        </div>
                                                                        <div style={{ width: '25px', height: '25px', position: 'relative', top: '7px', left: '5px', background: '#000', borderRadius: '4px', display: 'inline-block' }} {...provided.dragHandleProps} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                            {provided.placeholder}
                                        </div>

                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Label>
                    </PersonListContainer>
                </Col>
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
    addPerson: PropTypes.func
};

export default PersonList;