import React, { Component, Fragment } from 'react';
import {
    FormGroup,
    Label,
    Input,
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
import CloseableBtn from '../../../../../components/form/CloseableBtn';
import PropTypes from 'prop-types';
import { AvField } from 'availity-reactstrap-validation';
import CoreMetadataCreateCastModal from './CoreMetadataCreateCastModal';
import CoreMetadataCreateCrewModal from './CoreMetadataCreateCrewModal';
import {connect} from 'react-redux';
import {configFields} from '../../../service/ConfigService';
import {
    CREW,
    CAST,
    getFilteredCrewList, getFilteredCastList, getFormatTypeName
} from '../../../../../constants/metadata/configAPI';

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
            crewList: []
        };
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
    }

    onRatingKeyDown = e => {
        if(this.state.isRatingValid) {
            this.props._handleRatingKeyPress(e);
        }
    };

    onAdvisoryCodeDown = e => {
        if(this.state.isAdvisoryCodeValid) {
            this.props._handleAdvisoryCodeKeyPress(e);
        }
    };

    validateRating = (value, ctx, input, cb) => {
        let isValid = false;
        if(value === '') {
            isValid = true;
        } else if(this.props.configRatings) {
            let rating = this.props.configRatings.value.find(e => {
                if(this.props.ratingSystem) {
                    return e.value === value && e.ratingSystem === this.props.ratingSystem;
                }
                return e.value === value;
            });
            isValid = !!rating;
        } else {
            isValid = false;
        }
        this.setState({
            isRatingValid: isValid
        });

        cb(isValid);
    };

    validateAdvisoryCode = (value, ctx, input, cb) => {
        let isValid = false;
        if(value === '') {
            isValid = true;
        } else if(this.props.configAdvisoryCode) {
            let advisoryCode = this.props.configAdvisoryCode.value.find(e => {
                return e.code === value;
            });
            isValid = !!advisoryCode;
        } else {
            isValid = false;
        }
        this.setState({
            isAdvisoryCodeValid: isValid
        });

        cb(isValid);
    };

    handleMovidaLegacyIds(e) {
        let movidaLegacyId = {movida: {[e.target.name]: e.target.value}};
        this.props.handleOnLegacyIds(movidaLegacyId);
    }

    handleVzLegacyIds(e) {
        let vzLegacyId = {vz: {[e.target.name]: e.target.value}};
        this.props.handleOnLegacyIds(vzLegacyId);
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
                    // this.props.editedTitle.castCrew.filter(function (e) {return e.personType==='actor';}).map((cast, i) => (
                  getFilteredCastList(this.props.editedTitle.castCrew, false).map((cast, i) => (
                      <ListGroupItem key={i}>
                        {cast.displayName}
                        <FontAwesome
                          className='float-right'
                          name='times-circle'
                          style={{ marginTop: '5px', cursor: 'pointer' }}
                          color='#111'
                          size='lg'
                          onClick={() => this.props.removeCastCrew(cast)}
                        />
                      </ListGroupItem>
                    ))}
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
                    // this.props.editedTitle.castCrew.filter(function (e) {return e.personType==='director';}).map((crew, i) => (
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
        <Row>
          <Col>
          <FormGroup>
              <Label for='ratingSystem'>Rating System</Label>
              <Input
                type='select'
                onChange={e => this.props.handleRatingSystemUpdate(e)}
                name='ratingSystem'
                id='ratingSystem'
                defaultValue={this.props.ratingSystem}
              >
                <option value={''}>Select Rating System</option>
                {
                  this.props.configRatingSystem && this.props.configRatingSystem.value.map((e, index) => {
                    return <option key={index} value={e.value}>{e.value}</option>;
                  })
                }
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='ratings'>Ratings</Label>
              <AvField
                type='text'
                onChange={e => this.props.updateValue(e.target.value)}
                name='ratings'
                id='ratings'
                value={this.props.ratingValue}
                onKeyDown={this.onRatingKeyDown}
                placeholder='Ratings'
                validate={{async: this.validateRating}}
                errorMessage="Invalid Rating due to selected Rating System"
              />
              {this.props.ratings &&
                this.props.ratings.map((rating, i) => (
                  <CloseableBtn
                    style={{
                      marginTop: '5px',
                      width: 'auto',
                      marginRight: '5px'
                    }}
                    title={rating.rating}
                    key={i}
                    onClick={() => {
                      return;
                    }}
                    highlighted={false}
                    id={'core-metadata-tags-' + i}
                    onClose={() => this.props.removeRating(rating)}
                  />
                ))}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='advisoriesFreeText'>Advisories</Label>
              <AvField
                type='text'
                onChange={e => this.props.handleOnAdvisories(e)}
                name='advisoriesFreeText'
                id='advisories'
                value={this.props.advisoryCodeList && this.props.advisoryCodeList.advisoriesFreeText ? this.props.advisoryCodeList.advisoriesFreeText : ''}
                placeholder='Advisories'
                validate={{
                  maxLength: { value: 500 }
                }}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='advisoryCode'>Advisory Code</Label>
              <AvField
                type='text'
                onChange={e => this.props.handleOnAdvisoriesCodeUpdate(e.target.value)}
                value={this.props.advisoryCode}
                placeholder="Advisory Codes"
                onKeyDown={this.onAdvisoryCodeDown}
                name='advisoryCode'
                id='advisoryCode'
                validate={{async: this.validateAdvisoryCode}}
                errorMessage="Invalid Advisory Code"
              />
              {this.props.advisoryCodeList && this.props.advisoryCodeList.advisoriesCode &&
                this.props.advisoryCodeList.advisoriesCode.map((advisory, i) => (
                  <CloseableBtn
                    style={{
                      marginTop: '5px',
                      width: 'auto',
                      marginRight: '5px'
                    }}
                    title={advisory}
                    key={i}
                    onClick={() => {
                      return;
                    }}
                    highlighted={false}
                    id={'core-metadata-tags-' + i}
                    onClose={() => this.props.removeAdvisoryCodes(advisory)}
                  />
                ))}
            </FormGroup>
          </Col>
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
              value={this.props.data.externalIds ? this.props.data.externalIds.eidrLevel1: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.tmsId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.eidrLevel2: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.dmaId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.licensorTitleId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.isan: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.overrideMsvAssociationId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.alid: ''}
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
              value={this.props.data.legacyIds && this.props.data.legacyIds.vz  ? this.props.data.legacyIds.vz.vzTitleId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.cid: ''}
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
              value={this.props.data.legacyIds && this.props.data.legacyIds.movida  ? this.props.data.legacyIds.movida.movidaId: ''}
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
              value={this.props.data.externalIds ? this.props.data.externalIds.isrc: ''}
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
              value={this.props.data.legacyIds && this.props.data.legacyIds.movida ? this.props.data.legacyIds.movida.movidaTitleId: ''}
              placeholder='Movida Title ID'
            />
          </Col>
        </Row>
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
  data: PropTypes.object,
  onChange: PropTypes.func,
  handleOnExternalIds: PropTypes.func,
  handleOnLegacyIds: PropTypes.func,
  handleOnAdvisories: PropTypes.func,
  isCrewModalOpen: PropTypes.bool,
  isCastModalOpen: PropTypes.bool,
  renderModal: PropTypes.func,
  castInputValue: PropTypes.string,
  ratingValue: PropTypes.string,
  ratings: PropTypes.array,
  updateValue: PropTypes.func,
  removeRating: PropTypes.func,
  removeCastCrew: PropTypes.func,
  castCrew: PropTypes.array,
  editedTitle: PropTypes.object,
  _handleRatingKeyPress: PropTypes.func,
  cleanCastInput: PropTypes.func,
  addCastCrew: PropTypes.func,
  ratingSystem: PropTypes.string,
  _handleAdvisoryCodeKeyPress: PropTypes.func,
  handleOnAdvisoriesCodeUpdate: PropTypes.func,
  handleRatingSystemUpdate: PropTypes.func,
  advisoryCode: PropTypes.string,
  advisoryCodeList: PropTypes.object,
  removeAdvisoryCodes: PropTypes.func,

  configCastAndCrew: PropTypes.object,
  configRatingSystem: PropTypes.object,
  configRatings: PropTypes.object,
  configAdvisoryCode: PropTypes.object,
};


export default connect(mapStateToProps)(CoreMetadataEditMode);
