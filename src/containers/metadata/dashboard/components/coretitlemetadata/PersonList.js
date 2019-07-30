import React from 'react';
import PropTypes from 'prop-types';
import {
    Col
} from 'reactstrap';

import UserPicker from '@atlaskit/user-picker';
import { Label as LB } from '@atlaskit/field-base';
import Lozenge from '@atlaskit/lozenge';
import PersonListContainer from './PersonListContainer';
import { PERSON_LIMIT } from '../../../../../constants/metadata/constant-variables';

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
        return this.props.person === null || this.props.person.findIndex(person =>
            person.id === selectedPerson.id && person.personType === selectedPerson.personType) < 0;
    };

    validateAndAddPerson = (personJSON) => {
        let person = JSON.parse(personJSON);
        let isValid = this.isSelectedPersonValid(person);
        if (this.props.personsLimit === PERSON_LIMIT) {
            const length = this.props.filterPersonList(this.props.person).length;
            if (isValid && length < this.props.personsLimit) {
                this.props.addPerson(person);
                this.setState({
                    searchPersonText: ''
                });
            }
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
                                disableInput={this.props.filterPersonList(this.props.person).length >= this.props.personsLimit ? true : false}
                                placeholder={this.props.filterPersonList(this.props.person).length >= this.props.personsLimit ? 'You can add maximum 5 cast members' : this.props.personLabel}
                            />
                        </div>
                        {!this.state.isPersonValid && (<span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Person is already exists!</span>)}
                        <LB
                            label={this.props.personListLabel}
                            isFirstChild
                            htmlFor="person-list"
                        >
                            {this.props.person &&
                                this.props.filterPersonList(this.props.person, false).map((person, i) => {
                                    return (
                                        <div key={i} style={{ border: '1px solid #EEE', padding: '5px', backgroundColor: '#FAFBFC', width: '97%' }}>
                                            <div style={{ boxSizing: 'border-box', width: '6%', display: 'inline-block', padding: '7px', verticalAlign: 'middle' }}>
                                                <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{ width: '30px', height: '30px' }} />
                                            </div>
                                            {this.props.showPersonType ? (
                                                <div style={{ boxSizing: 'border-box', width: '14%', display: 'inline-block', padding: '7px', verticalAlign: 'middle' }}>
                                                    <span style={{ marginLeft: '10px' }}><Lozenge appearance={'default'}>{this.props.getFormatTypeName(person.personType)}</Lozenge></span>
                                                </div>) : null}
                                            <div style={{ boxSizing: 'border-box', width: !this.props.showPersonType ? '93%' : '79%', display: 'inline-block', verticalAlign: 'middle' }}>
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
                                        </div>
                                    );
                                })}
                        </LB>
                    </PersonListContainer>
                </Col>
            </React.Fragment>
        );
    }
}

PersonList.propTypes = {
    filterPersonList: PropTypes.func,
    person: PropTypes.array,
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