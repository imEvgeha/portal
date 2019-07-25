import React, { Component, Fragment } from 'react';
import {
  FormGroup,
  Label,
  Row,
  Col
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
  PERSONS_PER_REQUEST
} from '../../../../../constants/metadata/configAPI';
import {
  CREW_LIST_LABEL,
  CAST_LIST_LABEL,
  CAST_LABEL,
  CREW_LABEL,
  CAST_HTML_FOR,
  CREW_HTML_FOR,
  CAST_HEADER,
  CREW_HEADER
} from '../../../../../constants/metadata/constant-variables';
import Rating from './rating/Rating';
import CreateCastCrew from './CreateCastCrew';

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
          <CreateCastCrew
              castLabel={CAST_LABEL}
              castHtmlFor={CAST_HTML_FOR}
              castListLabel={CAST_LIST_LABEL}
              castHeader={CAST_HEADER}
              castCrew={this.props.editedTitle.castCrew}
              getFilteredCastList={getFilteredCastList}
              removeCastCrew={this.props.removeCastCrew}
              isValidCastPersonValid={this.state.isValidCastPersonValid}
              searchCastText={this.state.searchCastText}
              loadOptionsCast={this.loadOptionsCast}
              handleInputChangeCast={this.handleInputChangeCast}
              handleOnSelectCast={this.handleOnSelectCast}

              crewLabel={CREW_LABEL}
              crewHtmlFor={CREW_HTML_FOR}
              crewListLabel={CREW_LIST_LABEL}
              crewHeader={CREW_HEADER}
              getFilteredCrewList={getFilteredCrewList}
              isValidCrewPersonValid={this.state.isValidCrewPersonValid}
              searchCrewText={this.state.searchCrewText}
              loadOptionsCrew={this.loadOptionsCrew}
              handleInputChangeCrew={this.handleInputChangeCrew}
              handleOnSelectCrew={this.handleOnSelectCrew}
              getFormatTypeName={getFormatTypeName}
            />
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
