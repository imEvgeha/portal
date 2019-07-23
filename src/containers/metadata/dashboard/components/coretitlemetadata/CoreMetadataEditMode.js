import React, { Component, Fragment } from 'react';
import {
  FormGroup,
  Label,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './CoreMetadata.scss';
import PropTypes from 'prop-types';
import { AvField } from 'availity-reactstrap-validation';
import CoreMetadataCreateCastModal from './CoreMetadataCreateCastModal';
import CoreMetadataCreateCrewModal from './CoreMetadataCreateCrewModal';
import { connect } from 'react-redux';
import { configFields, searchPerson } from '../../../service/ConfigService';
import {
  CREW,
  CAST,
  getFilteredCrewList, 
  getFilteredCastList, 
  getFormatTypeName, 
  PERSONS_PER_REQUEST,
  PERSON_INPUT_TIMEOUT
} from '../../../../../constants/metadata/configAPI';
import Rating from './rating/Rating';
import UserPicker from '@atlaskit/user-picker';

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
      isValidPersonSelected: true,
      persons: [],
      searchText: '',
      disableInput: false,
    };    
    this.keyInputTimeout = 0;
    this.userPickerPersonsPromise = [];
  }

  handleRatingSystemValue = (e) => {
    const rating = e.target.value;
    let newRatings = this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === rating);
    this.setState({
      ratings: newRatings
    });

  };

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

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

  validateAndAddSelectedPerson = (personJSON) => {
    if (personJSON) {
      let person = JSON.parse(personJSON);
      let isValid = this.isSelectedPersonValid(person);
      console.log('isValid', isValid)
      if (isValid) {
        this.props.addCastCrew(person);
      }
      this.setState({
        isValidPersonSelected: isValid
      });
    } else {
      this.setState({
        isValidPersonSelected: true
      });
    }
  };

  filterPerson = (inputValue) => {
    console.log(inputValue);
    searchPerson(inputValue, PERSONS_PER_REQUEST, CAST)
      .then(res => {
        console.log(res.data.data)
        this.setState({ persons: getFilteredCastList(res.data.data, true) });
      }).catch((err) => { console.error(err); });
  };

  loadOptions = (searchText) => {
    return searchPerson(searchText, PERSONS_PER_REQUEST, CAST)
            .then(res => getFilteredCastList(res.data.data, true).map(e => {return {id: e.id, name: e.displayName, original: JSON.stringify(e)};})
          );
  };

  onInputChange = (e) => {
    console.log(e);
  }
  handleClear = (b, e) => {
    console.log(b, e)
  }

  handleOnSelect = e => {
    console.log('select', e)
    this.validateAndAddSelectedPerson(e.original);
  }


  render() {
    return (
      <Fragment>
        <Row>
          <Col>
            <Card id='cardContainer'>
              <CardHeader className='clearfix'>
                <h4 className='float-left'>Cast</h4>
                <FontAwesome
                  onClick={() => this.props.renderModal(CAST)}
                  className='float-right'
                  name='plus-circle'
                  style={{ marginTop: '8px', cursor: 'pointer' }}
                  color='#111'
                  size='lg'
                />
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
                  {this.props.editedTitle.castCrew &&
                    getFilteredCastList(this.props.editedTitle.castCrew, false).map((cast, i) => {
                      return (
                        <div key={i} style={{marginTop: '5px'}}>
                          <UserPicker 
                            width="100%"
                            value={cast.displayName} 
                            disableInput={true} 
                            search={cast.displayName} 
                            onClear={() => this.props.removeCastCrew(cast)} 
                          />
                        </div>
                      );
                    })}
                    <div style={{marginTop: '5px'}}>
                      <UserPicker
                        width="100%"
                        onClear={this.handleClear}
                        loadOptions={this.loadOptions}
                        onChange={this.handleOnChange}
                        onSelection={this.handleOnSelect}
                      />
                    </div>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card id='cardContainer'>
              <CardHeader className='clearfix'>
                <h4 className='float-left'>Crew</h4>
                <FontAwesome
                  className='float-right'
                  onClick={() => this.props.renderModal(CREW)}
                  name='plus-circle'
                  style={{ marginTop: '8px', cursor: 'pointer' }}
                  color='#111'
                  size='lg'
                />
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
                  {this.props.editedTitle.castCrew &&
                    getFilteredCrewList(this.props.editedTitle.castCrew, false).map((crew, i) => (
                      <ListGroupItem key={i}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          {getFormatTypeName(crew.personType)}
                        </span>{' '}
                        {crew.displayName}
                        <FontAwesome
                          className='float-right'
                          name='times-circle'
                          style={{ marginTop: '5px', cursor: 'pointer' }}
                          color='#111'
                          size='lg'
                          onClick={() => this.props.removeCastCrew(crew)}
                        />
                      </ListGroupItem>
                    ))}
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
        <CoreMetadataCreateCastModal
          isCastModalOpen={this.props.isCastModalOpen}
          renderCastModal={this.props.renderModal}
          addCastCrew={this.props.addCastCrew}
          castInputValue={this.props.castInputValue}
          cleanCastInput={this.props.cleanCastInput}
          configCastAndCrew={this.props.configCastAndCrew}
          castCrewList={this.props.editedTitle.castCrew}
        />
        <CoreMetadataCreateCrewModal
          isCrewModalOpen={this.props.isCrewModalOpen}
          renderCrewModal={this.props.renderModal}
          addCastCrew={this.props.addCastCrew}
          castInputValue={this.props.castInputValue}
          cleanCastInput={this.props.cleanCastInput}
          configCastAndCrew={this.props.configCastAndCrew}
          castCrewList={this.props.editedTitle.castCrew}
        />
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

  renderModal: PropTypes.func,
  isCrewModalOpen: PropTypes.bool,
  isCastModalOpen: PropTypes.bool,
  castInputValue: PropTypes.string,
  removeCastCrew: PropTypes.func,
  castCrew: PropTypes.array,
  cleanCastInput: PropTypes.func,
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
