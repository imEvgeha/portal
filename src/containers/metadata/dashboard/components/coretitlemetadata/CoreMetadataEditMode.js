import React, { Component, Fragment } from 'react';
import {
  FormGroup,
  Label,
  Row,
  Col,
  ListGroup,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import './CoreMetadata.scss';
import PropTypes from 'prop-types';
import { AvField } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { configFields, searchPerson } from '../../../service/ConfigService';
import {
  CAST,
  getFilteredCrewList, 
  getFilteredCastList, 
  getFormatTypeName, 
  CREW,
  PERSONS_PER_REQUEST,
} from '../../../../../constants/metadata/configAPI';
import Rating from './rating/Rating';
import UserPicker from '@atlaskit/user-picker';
import { Label as LB } from '@atlaskit/field-base';
import Lozenge from '@atlaskit/lozenge';

const mapStateToProps = state => {
  return {
    configCastAndCrew: state.titleReducer.configData.find(e => e.key === configFields.CAST_AND_CREW),
    configRatingSystem: state.titleReducer.configData.find(e => e.key === configFields.RATING_SYSTEM),
    configRatings: state.titleReducer.configData.find(e => e.key === configFields.RATINGS),
    configAdvisoryCode: state.titleReducer.configData.find(e => e.key === configFields.ADVISORY_CODE),
  };
};

class CoreMetadataEditMode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRatingValid: false,
      isAdvisoryCodeValid: false,
      castList: [],
      crewList: [],
      ratings: [],
      isValidCastPersonValid: true,
      isValidCrewPersonValid: true,
      persons: [],
      searchCastText: '',
      searchCrewText: '',
      disableInput: false,
      isHover: false
    };    
    this.keyInputTimeout = 0;
  }

  handleRatingSystemValue = (e) => {
    const rating = e.target.value;
    let newRatings = this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === rating);
    this.setState({
      ratings: newRatings
    });

  };

  handleMovidaLegacyIds(e) {
    let movidaLegacyId = { movida: { [e.target.name]: e.target.value } };
    this.props.handleOnLegacyIds(movidaLegacyId);
  }

  handleVzLegacyIds(e) {
    let vzLegacyId = { vz: { [e.target.name]: e.target.value } };
    this.props.handleOnLegacyIds(vzLegacyId);
  }

  isSelectedPersonValid = (selectedPerson) => {
    return this.props.editedTitle.castCrew === null || this.props.editedTitle.castCrew.findIndex(person =>
      person.id === selectedPerson.id && person.personType === selectedPerson.personType) < 0;
  };

  validateAndAddCastPerson = (personJSON) => {
      let person = JSON.parse(personJSON);
      let isValid = this.isSelectedPersonValid(person);
      const length = getFilteredCastList(this.props.editedTitle.castCrew, false).length;
      if (isValid && length < 5) {
        this.props.addCastCrew(person);
        this.setState({
          searchCrewText: ''
        });
      }
      this.setState({
        isValidCastPersonValid: isValid
      });
  };

  validateAndAddCrewPerson = (personJSON) => {
    let person = JSON.parse(personJSON);
    let isValid = this.isSelectedPersonValid(person);
    if (isValid) {
      this.props.addCastCrew(person);
      this.setState({
        searchCrewText: ''
      });
    }
    this.setState({
      isValidCrewPersonValid: isValid
    });
};

  loadOptionsCast = () => {
    return searchPerson(this.state.searchCastText, PERSONS_PER_REQUEST, CAST)
            .then(res => getFilteredCastList(res.data.data, true).map(e => {return {id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase()  , original: JSON.stringify(e)};})
          );
  };

  loadOptionsCrew = () => {
    return searchPerson(this.state.searchCrewText, PERSONS_PER_REQUEST, CREW)
            .then(res => getFilteredCrewList(res.data.data, true).map(e => {return {id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase(), original: JSON.stringify(e)};})
          );
  }

  handleOnSelectCast = e => {
    this.validateAndAddCastPerson(e.original);
  }

  handleOnSelectCrew = e => {
    this.validateAndAddCrewPerson(e.original);
  }

  handleInputChangeCast = e => {
    this.setState({
      searchCastText: e
    });
  }

  handleInputChangeCrew = e => {
    this.setState({
      searchCrewText: e
    });
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Col>
            <Card id='cardContainer'>
              <CardHeader className='clearfix'>
                <h4 className='float-left'>Cast</h4>
              </CardHeader>
              <CardBody>
                <ListGroup
                  style={{
                    overflowY: 'scroll',
                    overFlowX: 'hidden',
                    maxHeight: '280px'
                  }}
                  id='listContainer'
                >   
                  <LB
                      label="Add new cast"
                      isFirstChild
                      htmlFor="new-person-cast"
                  >            
                    <div style={{marginTop: '5px', border: !this.state.isValidCastPersonValid ? '2px solid red' : null, borderRadius: '3px', width: '97%'}}>
                      
                        <UserPicker
                          id="new-person-cast"
                          width="100%"
                          onClear={this.handleClear}
                          loadOptions={this.loadOptionsCast}
                          value={this.state.searchCastText}
                          onInputChange={this.handleInputChangeCast}
                          onChange={this.handleOnChange}
                          onSelection={this.handleOnSelectCast}
                        />
                    </div>
                    {!this.state.isValidCastPersonValid && (<span style={{color: 'red'}}>Person is already exists!</span>)}              
                  </LB>
                  <LB
                      label="Cast List"
                      isFirstChild
                      htmlFor="person-list"
                  >
                  {this.props.editedTitle.castCrew &&
                    getFilteredCastList(this.props.editedTitle.castCrew, false).map((cast, i) => {
                      return (
                        <div 
                          key={i} 
                          style={{marginTop: '5px', padding: '5px', border:'1px solid #EEE', backgroundColor: '#FAFBFC', borderRadius: '3px', width: '97%'}}>
                          <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{marginLeft: '15px', width: '30px', height: '30px', verticalAlign: 'middle', marginTop: '10px'}} />
                          <div style={{display: 'inline-block', width: '90%', marginLeft: '5px'}}>
                          <UserPicker 
                            appearance="normal"
                            subtle
                            width="100%"
                            value={cast.displayName} 
                            disableInput={true} 
                            search={cast.displayName} 
                            onClear={() => this.props.removeCastCrew(cast)} 
                          />
                          </div>                          
                          <div style={{clear: 'both'}} />
                        </div>
                      );
                    })}
                  </LB>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card id='cardContainer'>
              <CardHeader className='clearfix'>
                <h4 className='float-left'>Crew</h4>
              </CardHeader>
              <CardBody>
                <ListGroup
                  style={{
                    overflowY: 'scroll',
                    overFlowX: 'hidden',
                    maxHeight: '280px'
                  }}
                  id='listContainer'
                >
                    <LB
                      label="Add new crew"
                      isFirstChild
                      htmlFor="new-person-crew"
                  >            
                    <div style={{marginTop: '5px', border: !this.state.isValidCrewPersonValid ? '2px solid red' : null, borderRadius: '3px', width: '97%'}}>                      
                        <UserPicker
                          width="100%"
                          id="new-person-crew"
                          onClear={this.handleClear}
                          loadOptions={this.loadOptionsCrew}
                          value={this.state.searchCrewText}
                          onInputChange={this.handleInputChangeCrew}
                          onChange={this.handleOnChange}
                          onSelection={this.handleOnSelectCrew}
                        />
                    </div>                        
                    {!this.state.isValidCrewPersonValid && (<span style={{color: 'red'}}>Person is already exists!</span>)}              
                  </LB>
                  <LB
                      label="Crew List"
                      isFirstChild
                      htmlFor="person-list"
                  >
                  {this.props.editedTitle.castCrew &&
                    getFilteredCrewList(this.props.editedTitle.castCrew, false).map((crew, i) => {
                      return (
                        <div 
                          key={i} 
                          style={{marginTop: '5px', padding: '5px', border:'1px solid #EEE', backgroundColor: '#FAFBFC', borderRadius: '3px', width: '97%'}}>
                          <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Crew" style={{marginLeft: '15px', width: '30px', height: '30px', verticalAlign: 'middle', marginTop: '10px'}} />                          
                          <span style={{marginLeft: '10px'}}><Lozenge appearance={'default'}>{getFormatTypeName(crew.personType)}</Lozenge></span>
                          <div style={{display: 'inline-block', width: '82%', marginLeft: '5px'}}>
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
                          <div style={{clear: 'both'}} />
                        </div>
                      );
                    })}
                  </LB>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <hr />
        <Row>
          <Rating
            isEditMode={true}
            ratings={this.props.ratings}
            areRatingFieldsRequired={this.props.areRatingFieldsRequired}
            handleAdvisoryCodeChange={this.props.handleAdvisoryCodeChange}
            ratingObjectForCreate={this.props.ratingObjectForCreate}
            filteredRatings={this.state.ratings}
            activeTab={this.props.titleRankingActiveTab}
            toggle={this.props.toggleTitleRating}
            addRating={this.props.addTitleRatingTab}
            createRatingTab={this.props.createRatingTab}
            handleEditChange={this.props.handleRatingEditChange}
            handleRatingCreateChange={this.props.handleRatingCreateChange}
            handleRatingSystemValue={this.props.handleRatingSystemValue}
          />
        </Row>

        <hr />
        <Row>
          <Col>
            <FormGroup>
              <Label for='awards'>Awards</Label>
              <AvField
                type='text'
                name='awards'
                onChange={e => this.props.onChange(e)}
                id='awards'
                placeholder='Awards'
                validate={{
                  maxLength: { value: 500 }
                }}
              />
            </FormGroup>
          </Col>
        </Row>

        <hr />
        <h4>External IDS</h4>
        <div id="coreMetadataEditMode">
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='eidrLevel1'>EIDR Level 1 </Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='eidrLevel1'
                id='eidrLevel1'
                value={this.props.data.externalIds ? this.props.data.externalIds.eidrLevel1 : ''}
                placeholder='EIDR Level 1'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
            <Col md={1}>
              <Label for='tmsId'>TMS ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                name='tmsId'
                id='tmsId'
                value={this.props.data.externalIds ? this.props.data.externalIds.tmsId : ''}
                onChange={e => this.props.handleOnExternalIds(e)}
                placeholder='TMS ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='eidrLevel2'>EIDR Level 2 </Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='eidrLevel2'
                id='eidrLevel2'
                value={this.props.data.externalIds ? this.props.data.externalIds.eidrLevel2 : ''}
                placeholder='EIDR Level 2'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
            <Col md={1}>
              <Label for='xfinityMovieId'>Xfinity Movie ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='xfinityMovieId'
                id='xfinityMovieId'
                value={this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId : ''}
                placeholder='Xfiniy Movie ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='dmaId'>DMA ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                name='dmaId'
                onChange={e => this.props.handleOnExternalIds(e)}
                id='dmaId'
                value={this.props.data.externalIds ? this.props.data.externalIds.dmaId : ''}
                placeholder='DMA ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
            <Col md={1}>
              <Label for='licensorTitleId'>Licensor Title ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='licensorTitleId'
                id='licensorTitleId'
                value={this.props.data.externalIds ? this.props.data.externalIds.licensorTitleId : ''}
                placeholder='Licensor Title ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='isan'>ISAN</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='isan'
                id='isan'
                value={this.props.data.externalIds ? this.props.data.externalIds.isan : ''}
                placeholder='ISAN'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
            <Col md={1}>
              <Label for='overrideMsvAssociationId'>
                Override MSV Association ID
            </Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='overrideMsvAssociationId'
                id='overrideMsvAssociationId'
                value={this.props.data.externalIds ? this.props.data.externalIds.overrideMsvAssociationId : ''}
                placeholder='Override MSV Association ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='alid'>ALID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='alid'
                id='alid'
                value={this.props.data.externalIds ? this.props.data.externalIds.alid : ''}
                placeholder='ALID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
            <Col md={1}>
              <Label for='vzId'>VZ Title ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.handleVzLegacyIds(e)}
                name='vzTitleId'
                id='vzTitleId'
                value={this.props.data.legacyIds && this.props.data.legacyIds.vz ? this.props.data.legacyIds.vz.vzTitleId : ''}
                placeholder='VZ ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='cid'>C ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='cid'
                id='cid'
                value={this.props.data.externalIds ? this.props.data.externalIds.cid : ''}
                placeholder='C ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
            <Col md={1}>
              <Label for='movidaId'>Movida ID</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.handleMovidaLegacyIds(e)}
                name='movidaId'
                id='movidaId'
                value={this.props.data.legacyIds && this.props.data.legacyIds.movida ? this.props.data.legacyIds.movida.movidaId : ''}
                placeholder='Movie ID'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col md={1}>
              <Label for='isrc'>ISRC</Label>
            </Col>
            <Col>
              <AvField
                type='text'
                onChange={e => this.props.handleOnExternalIds(e)}
                name='isrc'
                id='isrc'
                value={this.props.data.externalIds ? this.props.data.externalIds.isrc : ''}
                placeholder='ISRC'
                validate={{
                  maxLength: { value: 200 }
                }}
              />
            </Col>

            <Col md={1}>
              <Label for='movidaTitleId'>Movida Title ID</Label>
            </Col>
            <Col>
              <AvField
                readOnly
                type='text'
                name='movidaTitleId'
                id='movidaTitleId'
                value={this.props.data.legacyIds && this.props.data.legacyIds.movida ? this.props.data.legacyIds.movida.movidaTitleId : ''}
                placeholder='Movida Title ID'
              />
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

CoreMetadataEditMode.propTypes = {
  titleRankingActiveTab: PropTypes.any,
  toggleTitleRating: PropTypes.func,
  addTitleRatingTab: PropTypes.func,
  createRatingTab: PropTypes.string,
  handleRatingEditChange: PropTypes.func,
  handleRatingCreateChange: PropTypes.func,

  data: PropTypes.object,
  editedTitle: PropTypes.object,

  onChange: PropTypes.func,
  handleOnExternalIds: PropTypes.func,
  handleOnLegacyIds: PropTypes.func,

  isCrewModalOpen: PropTypes.bool,
  removeCastCrew: PropTypes.func,
  castCrew: PropTypes.array,
  addCastCrew: PropTypes.func,

  ratings: PropTypes.array,

  configCastAndCrew: PropTypes.object,
  configRatingSystem: PropTypes.object,
  configRatings: PropTypes.object,
  configAdvisoryCode: PropTypes.object,

  handleRatingSystemValue: PropTypes.func,
  ratingObjectForCreate: PropTypes.object,
  handleAdvisoryCodeChange: PropTypes.func,
  areRatingFieldsRequired: PropTypes.bool
};


export default connect(mapStateToProps)(CoreMetadataEditMode);
