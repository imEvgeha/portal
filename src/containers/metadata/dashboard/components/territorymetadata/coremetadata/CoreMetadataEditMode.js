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
  CardBody,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './CoreMetadata.scss';
import CloseableBtn from '../../../../../../components/form/CloseableBtn';
import PropTypes from 'prop-types';
import { AvField } from 'availity-reactstrap-validation';
import CoreMetadataCreateCastModal from './CoreMetadataCreateCastModal';
import CoreMetadataCreateCrewModal from './CoreMetadataCreateCrewModal';

class CoreMetadataEditMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isCastModalOpen: false,
       isCrewModalOpen: false
    };
  }
  renderModal = (modalName) => {
      if(modalName === 'cast') {
        this.setState({
          isCastModalOpen: !this.state.isCastModalOpen
        });
      } else if(modalName === 'crew') {
        this.setState({
          isCrewModalOpen: !this.state.isCrewModalOpen
        });
      } else {
        this.setState({
          isCrewModalOpen: false,
          isCastModalOpen: false
        });
      }
  }
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
                  onClick={() => this.renderModal('cast')}
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
                  <ListGroupItem>
                    Firstname Lastname
                    <FontAwesome
                      className='float-right'
                      name='times-circle'
                      style={{ marginTop: '5px', cursor: 'pointer' }}
                      color='#111'
                      size='lg'
                    />
                  </ListGroupItem>
                  <ListGroupItem>
                    Firstname Lastname
                    <FontAwesome
                      className='float-right'
                      name='times-circle'
                      style={{ marginTop: '5px', cursor: 'pointer' }}
                      color='#111'
                      size='lg'
                    />
                  </ListGroupItem>
                  <ListGroupItem>
                    Firstname Lastname
                    <FontAwesome
                      className='float-right'
                      name='times-circle'
                      style={{ marginTop: '5px', cursor: 'pointer' }}
                      color='#111'
                      size='lg'
                    />
                  </ListGroupItem>
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
                  onClick={() => this.renderModal('crew')}
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
                  <ListGroupItem>
                    <span style={{fontSize: '14px', color: '#666'}}>Directed by:</span> Firstname Lastname
                    <FontAwesome
                      className='float-right'
                      name='times-circle'
                      style={{ marginTop: '8px', cursor: 'pointer' }}
                      color='#111'
                      size='lg'
                    />
                  </ListGroupItem>
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
                onChange={(e) => this.props.onChange(e)}
                name='ratings'
                id='ratings'
                placeholder='Ratings'
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                onClick={() => {return;}}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                onClick={() => {return;}}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                onClick={() => {return;}}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                onClick={() => {return;}}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                onClick={() => {return;}}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleEmail'>Advisories</Label>
              <AvField
                type='text'
                onChange={(e) => this.props.handleOnAdvisories(e)}
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
                onChange={(e) => this.props.onChange(e)}
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
                onChange={(e) => this.props.onChange(e)}
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='eidrLevel1'
              id='eidrLevel1'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='eidrLevel2'
              id='eidrLevel2'
              placeholder='EIDR Level 2'
              validate={{
                maxLength: { value: 200 }
              }}
            />
          </Col>
          <Col md={1}>
            <Label for='xFinityId'>Xfinity Movie ID</Label>
          </Col>
          <Col>
            <AvField
              type='text'
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='xFinityId'
              id='xFinityId'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              id='dmaId'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='licensorTitleId'
              id='licensorTitleId'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='isan'
              id='isan'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='overrideMsvAssociationId'
              id='overrideMsvAssociationId'
              placeholder='Override MSV Association ID'
              validate={{
                maxLength: { value: 200 }
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='alId'>AL ID</Label>
          </Col>
          <Col>
            <AvField
              type='text'
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='alId'
              id='alId'
              placeholder='AL ID'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='vzId'
              id='vzId'
              placeholder='VZ ID'
              validate={{
                maxLength: { value: 200 }
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='cId'>C ID</Label>
          </Col>
          <Col>
            <AvField
              type='text'
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='cId'
              id='cId'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='movidaId'
              id='movidaId'
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
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='movidaTitleId'
              id='movidaTitleId'
              placeholder='Movida Title ID'
              validate={{
                maxLength: { value: 200 }
              }}
            />
          </Col>
        </Row>
        <CoreMetadataCreateCastModal isCastModalOpen={this.state.isCastModalOpen} renderCastModal={this.renderModal} />
        <CoreMetadataCreateCrewModal isCrewModalOpen={this.state.isCrewModalOpen} renderCrewModal={this.renderModal} />        
      </Fragment>
    );
  }
}

CoreMetadataEditMode.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  handleOnExternalIds: PropTypes.func,
  handleOnAdvisories: PropTypes.func,  
};

export default CoreMetadataEditMode;
