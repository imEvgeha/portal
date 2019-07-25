import React from 'react';
import PropTypes from 'prop-types';
import {
    Col
  } from 'reactstrap';

import UserPicker from '@atlaskit/user-picker';
import { Label as LB } from '@atlaskit/field-base';
import Lozenge from '@atlaskit/lozenge';
import CastCrewCardContainer from './CastCrewCardContainer';

class CreateCastCrew extends React.Component {
    render() {
        return (
            <React.Fragment>
               <Col>
                    <CastCrewCardContainer 
                        title={this.props.castHeader}
                        label={this.props.castLabel} 
                        htmlFor={this.props.castHtmlFor}>                             
                        <div style={{marginTop: '5px', border: !this.props.isValidCastPersonValid ? '2px solid red' : null, borderRadius: '3px', width: '97%'}}>                                 
                                <UserPicker
                                id={this.props.castHtmlFor}
                                width="100%"
                                loadOptions={this.props.loadOptionsCast}
                                value={this.props.searchCastText}
                                onInputChange={this.props.handleInputChangeCast}
                                onSelection={this.props.handleOnSelectCast}
                                placeholder={this.props.castLabel}
                                />  
                        </div>   
                        <LB
                            label={this.props.castListLabel}
                            isFirstChild
                            htmlFor="person-list"
                        >
                        {this.props.castCrew &&
                            this.props.getFilteredCastList(this.props.castCrew, false).map((cast, i) => {
                            return (
                                <div key={i} style={{border: '1px solid #EEE', padding: '5px', backgroundColor: '#FAFBFC', width: '97%'}}>
                                    <div style={{boxSizing: 'border-box', width: '6%', display: 'inline-block', padding: '7px', verticalAlign: 'middle'}}>
                                        <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{width: '30px', height: '30px'}} />   
                                    </div>
                                    <div style={{boxSizing: 'border-box', width: '93%', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <UserPicker 
                                        width="100%"
                                        appearance="normal"
                                        subtle
                                        value={cast.displayName} 
                                        disableInput={true} 
                                        search={cast.displayName} 
                                        onClear={() => this.props.removeCastCrew(cast)} 
                                    />
                                    </div>
                                </div>
                            );
                            })}
                        </LB>
                    </CastCrewCardContainer>
                </Col>
                <Col>
                    <CastCrewCardContainer 
                    title={this.props.crewHeader}
                    label={this.props.crewLabel} 
                    htmlFor={this.props.crewHtmlFor}>    
                            <div style={{marginTop: '5px', border: !this.props.isValidCrewPersonValid ? '2px solid red' : null, borderRadius: '3px', width: '97%'}}>                  
                                <UserPicker
                                width="100%"
                                id={this.props.crewHtmlFor}
                                loadOptions={this.props.loadOptionsCrew}
                                value={this.props.searchCrewText}
                                onInputChange={this.props.handleInputChangeCrew}
                                onSelection={this.props.handleOnSelectCrew}
                                placeholder={this.props.crewLabel}
                                />   
                            </div>                 
                        <LB
                            label={this.props.crewListLabel}
                            isFirstChild
                            htmlFor="person-list"
                        >
                        {this.props.castCrew &&
                            this.props.getFilteredCrewList(this.props.castCrew, false).map((crew, i) => {
                            return (
                                <div key={i} style={{border: '1px solid #EEE', padding: '5px', backgroundColor: '#FAFBFC', width: '97%'}}>
                                    <div style={{boxSizing: 'border-box', width: '6%', display: 'inline-block', padding: '7px', verticalAlign: 'middle'}}>
                                        <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Crew" style={{width: '30px', height: '30px'}} />   
                                    </div>
                                    <div style={{boxSizing: 'border-box', width: '14%', display: 'inline-block', padding: '7px', verticalAlign: 'middle'}}>                       
                                        <span style={{marginLeft: '10px'}}><Lozenge appearance={'default'}>{this.props.getFormatTypeName(crew.personType)}</Lozenge></span>
                                    </div>
                                    <div style={{boxSizing: 'border-box', width: '79%', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <UserPicker 
                                        width="100%"
                                        appearance="normal"
                                        subtle
                                        value={crew.displayName} 
                                        disableInput={true} 
                                        search={crew.displayName} 
                                        onClear={() => this.props.removeCastCrew(crew)} 
                                    />
                                    </div>
                                </div>
                            );
                            })}
                        </LB>
                    </CastCrewCardContainer>
                </Col>
            </React.Fragment>
        );
    }
}

CreateCastCrew.propTypes = {
    searchCastText: PropTypes.string,
    searchCrewText: PropTypes.string,
    isValidCastPersonValid: PropTypes.bool,
    getFilteredCastList: PropTypes.any,
    getFilteredCrewList: PropTypes.any,
    castCrew: PropTypes.array,
    removeCastCrew: PropTypes.func,
    handleOnSelectCast: PropTypes.func,
    handleOnSelectCrew: PropTypes.func,
    handleInputChangeCast: PropTypes.func,
    handleInputChangeCrew: PropTypes.func,
    loadOptionsCast: PropTypes.any,
    loadOptionsCrew: PropTypes.any,
    isValidCrewPersonValid: PropTypes.bool,
    crewListLabel: PropTypes.string,
    castListLabel: PropTypes.string,
    crewLabel: PropTypes.string,
    castLabel: PropTypes.string,
    getFormatTypeName: PropTypes.func,
    crewHtmlFor: PropTypes.string,
    castHtmlFor: PropTypes.string,
    castHeader: PropTypes.string,
    crewHeader: PropTypes.string
};

export default CreateCastCrew;