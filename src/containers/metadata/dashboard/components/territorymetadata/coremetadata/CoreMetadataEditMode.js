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
import CloseableBtn from '../../../../../../components/form/CloseableBtn';
import PropTypes from 'prop-types';
import { AvField } from 'availity-reactstrap-validation';
import CoreMetadataCreateCastModal from './CoreMetadataCreateCastModal';
import CoreMetadataCreateCrewModal from './CoreMetadataCreateCrewModal';


const CAST = 'CAST';
const CREW = 'CREW';

class CoreMetadataEditMode extends Component { 

  render() {
    // const {
    //   advisoriesCode,
    //   awards,
    //   ratings
    // } = this.props.data;
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
                    this.props.editedTitle.castCrew.filter(function (e) {return e.personType==='actor';}).map((cast, i) => (
                      <ListGroupItem key={i}>
                        {cast.displayName}
                        <FontAwesome
                          className='float-right'
                          name='times-circle'
                          style={{ marginTop: '5px', cursor: 'pointer' }}
                          color='#111'
                          size='lg'
                          onClick={() => this.props.removeCast(cast)}
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
                    this.props.editedTitle.castCrew.filter(function (e) {return e.personType==='director';}).map((crew, i) => (
                      <ListGroupItem key={i}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                        Directed by:
                        </span>{' '}
                        {crew.displayName}
                        <FontAwesome
                          className='float-right'
                          name='times-circle'
                          style={{ marginTop: '5px', cursor: 'pointer' }}
                          color='#111'
                          size='lg'
                          onClick={() => this.props.removeCast(crew)}
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
              <Label for='exampleEmail'>Ratings</Label>
              <Input
                type='text'
                // onChange={(e) => this.props.onChange(e)}
                onChange={e => this.props.updateValue(e.target.value)}
                name='ratings'
                id='ratings'
                value={this.props.ratingValue}
                onKeyDown={this.props._handleKeyPress}
                placeholder='Ratings'
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
              <Label for='exampleEmail'>Advisories</Label>
              <AvField
                type='text'
                onChange={e => this.props.handleOnAdvisories(e)}
                name='advisoriesFreeText'
                id='advisories'
                placeholder='Advisories'
                validate={{
                  maxLength: { value: 500 }
                }}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleSelect'>Advisory Code</Label>
              <Input
                type='select'
                onChange={e => this.props.onChange(e)}
                name='advisoryCode'
                id='advisoryCode'
              >
                <option value={''}>Select Advisory Code</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleSelect'>Awards</Label>
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
            <Label for='vzId'>VZ ID</Label>
          </Col>
          <Col>
            <AvField
              type='text'
              onChange={e => this.props.handleOnExternalIds(e)}
              name='vzId'
              id='vzId'
              value={this.props.data.externalIds ? this.props.data.externalIds.vzId: ''}
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
              onChange={e => this.props.handleOnExternalIds(e)}
              name='movidaId'
              id='movidaId'
              value={this.props.data.externalIds ? this.props.data.externalIds.movidaId: ''}
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
              onChange={this.props.handleOnExternalIds}
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
              type='text'
              onChange={e => this.props.handleOnExternalIds(e)}
              name='movidaTitleId'
              id='movidaTitleId'
              value={this.props.data.externalIds ? this.props.data.externalIds.movidaTitleId: ''}
              placeholder='Movida Title ID'
              validate={{
                maxLength: { value: 200 }
              }}
            />
          </Col>
        </Row>
        <CoreMetadataCreateCastModal
          isCastModalOpen={this.props.isCastModalOpen}
          renderCastModal={this.props.renderModal}
          addCast={this.props.addCast}
          updateCastValue={this.props.updateCastValue}
          castInputValue={this.props.castInputValue}
          cleanCastInput={this.props.cleanCastInput}
        />
        <CoreMetadataCreateCrewModal
          isCrewModalOpen={this.props.isCrewModalOpen}
          renderCrewModal={this.props.renderModal}
          addCast={this.props.addCast}
          updateCastValue={this.props.updateCastValue}
          castInputValue={this.props.castInputValue}
          cleanCastInput={this.props.cleanCastInput}
        />
      </Fragment>
    );
  }
}

CoreMetadataEditMode.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  handleOnExternalIds: PropTypes.func,
  handleOnAdvisories: PropTypes.func,
  isCrewModalOpen: PropTypes.bool,
  isCastModalOpen: PropTypes.bool,
  renderModal: PropTypes.func,
  castInputValue: PropTypes.string,
  updateCastValue: PropTypes.func,
  ratingValue: PropTypes.string,
  ratings: PropTypes.array,
  updateValue: PropTypes.func,
  removeRating: PropTypes.func,
  removeCast: PropTypes.func,
  castCrew: PropTypes.array,
  editedTitle: PropTypes.object,
  _handleKeyPress: PropTypes.func,
  cleanCastInput: PropTypes.func,
  addCast: PropTypes.func

};

export default CoreMetadataEditMode;
