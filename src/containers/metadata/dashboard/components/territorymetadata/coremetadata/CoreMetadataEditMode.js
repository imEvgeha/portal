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

class CoreMetadataEditMode extends Component {
  render() {
    const {
      advisoriesCode,
      awards,
      ratings
    } = this.props.data;
    return (
      <Fragment>
        <Row>
          <Col>
            <Card id='cardContainer'>
              <CardHeader className='clearfix'>
                <h4 className='float-left'>Crew</h4>
                <FontAwesome
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
                    Cras justo odio
                    <FontAwesome
                      className='float-right'
                      name='times-circle'
                      style={{ marginTop: '5px', cursor: 'pointer' }}
                      color='#111'
                      size='lg'
                    />
                  </ListGroupItem>
                  <ListGroupItem>
                    Cras justo odio
                    <FontAwesome
                      className='float-right'
                      name='times-circle'
                      style={{ marginTop: '5px', cursor: 'pointer' }}
                      color='#111'
                      size='lg'
                    />
                  </ListGroupItem>
                  <ListGroupItem>
                    Cras justo odio
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
                <h4 className='float-left'>Cast</h4>
                <FontAwesome
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
                    Cras justo odio
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
                value={ratings}
                onChange={(e) => this.props.onChange(e)}
                name='ratings'
                id='ratings'
                placeholder='Ratings'
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
              <CloseableBtn
                style={{ marginTop: '5px', width: 'auto', marginRight: '5px' }}
                title={'PG'}
                highlighted={false}
                id={'core-metadata-tags'}
                onClose={() => alert('Test')}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleEmail'>Advisories</Label>
              <Input
                type='text'
                // value={advisoriesCode}
                onChange={(e) => this.props.onChange(e)}
                name='advisories'
                id='advisories'
                placeholder='Advisories'
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleSelect'>Advisory Code</Label>
              <Input
                type='select'
                value={advisoriesCode}
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
              <Input
                type='text'
                name='awards'
                value={awards}
                onChange={(e) => this.props.onChange(e)}
                id='awards'
                placeholder='Awards'
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
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.eidrLevel1 : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='eidrLevel1'
              id='eidrLevel1'
              placeholder='EIDR Level 1'
            />
          </Col>
          <Col md={1}>
            <Label for='tmsId'>TMS ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              name='tmsId'
              id='tmsId'
              value={this.props.data.externalIds ? this.props.data.externalIds.tmsId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              placeholder='TMS ID'
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='eidrLevel2'>EIDR Level 2 </Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.eidrLevel2 : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='eidrLevel2'
              id='eidrLevel2'
              placeholder='EIDR Level 2'
            />
          </Col>
          <Col md={1}>
            <Label for='xFinityId'>Xfinity Movie ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='xFinityId'
              id='xFinityId'
              placeholder='Xfiniy Movie ID'
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='dmaId'>DMA ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              name='dmaId'
              value={this.props.data.externalIds ? this.props.data.externalIds.dmaId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              id='dmaId'
              placeholder='DMA ID'
            />
          </Col>
          <Col md={1}>
            <Label for='licensorTitleId'>Licensor Title ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.licensorTitleId :  null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='licensorTitleId'
              id='licensorTitleId'
              placeholder='Licensor Title ID'
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='isan'>ISAN</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.isan : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='isan'
              id='isan'
              placeholder='ISAN'
            />
          </Col>
          <Col md={1}>
            <Label for='overrideMsvAssociationId'>
              Override MSV Association ID
            </Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.overrideMsvAssociationId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='overrideMsvAssociationId'
              id='overrideMsvAssociationId'
              placeholder='Override MSV Association ID'
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='alId'>AL ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.alid : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='alId'
              id='alId'
              placeholder='AL ID'
            />
          </Col>
          <Col md={1}>
            <Label for='vzId'>VZ ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.vzId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='vzId'
              id='vzId'
              placeholder='VZ ID'
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='cId'>C ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.cid : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='cId'
              id='cId'
              placeholder='C ID'
            />
          </Col>
          <Col md={1}>
            <Label for='movidaId'>Movida ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.movidaId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='movidaId'
              id='movidaId'
              placeholder='Movie ID'
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='isrc'>ISRC</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.isrc : null}
              onChange={this.props.handleOnExternalIds}
              name='isrc'
              id='isrc'
              placeholder='ISRC'
            />
          </Col>

          <Col md={1}>
            <Label for='movidaTitleId'>Movida Title ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
              value={this.props.data.externalIds ? this.props.data.externalIds.movidaTitleId : null}
              onChange={(e) => this.props.handleOnExternalIds(e)}
              name='movidaTitleId'
              id='movidaTitleId'
              placeholder='Movida Title ID'
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

CoreMetadataEditMode.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  handleOnExternalIds: PropTypes.func
};

export default CoreMetadataEditMode;
