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

class CoreMetadataEditMode extends Component {
  render() {
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
                name='advisories'
                id='advisories'
                placeholder='Advisories'
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleSelect'>Advisory Code</Label>
              <Input type='select' name='advisoryCode' id='advisoryCode'>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='exampleSelect'>Awards</Label>
              <Input
                type='text'
                name='awards'
                id='awards'
                placeholder='Awards'
              />
            </FormGroup>
          </Col>
        </Row>
        <hr />
        <h4>External IDs</h4>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='eidrLevel1'>EIDR Level 1 </Label>
          </Col>
          <Col>
            <Input
              type='text'
              name='eidrLevel1'
              id='eidrLevel1'
              placeholder='EIDR Level 1'
            />
          </Col>
          <Col md={1}>
            <Label for='tmsId'>TMS ID</Label>
          </Col>
          <Col>
            <Input type='text' name='tmsId' id='tmsId' placeholder='TMS ID' />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='eidrLevel2'>EIDR Level 2 </Label>
          </Col>
          <Col>
            <Input
              type='text'
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
            <Input type='text' name='dmaId' id='dmaId' placeholder='DMA ID' />
          </Col>
          <Col md={1}>
            <Label for='licensorTitleId'>Licensor Title ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
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
            <Input type='text' name='isan' id='isan' placeholder='ISAN' />
          </Col>
          <Col md={1}>
            <Label for='overrideMsvAssociationId'>
              Override MSV Association ID
            </Label>
          </Col>
          <Col>
            <Input
              type='text'
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
            <Input type='text' name='alId' id='alId' placeholder='AL ID' />
          </Col>
          <Col md={1}>
            <Label for='vzId'>VZ ID</Label>
          </Col>
          <Col>
            <Input type='text' name='vzId' id='vzId' placeholder='VZ ID' />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col md={1}>
            <Label for='cId'>C ID</Label>
          </Col>
          <Col>
            <Input type='text' name='cId' id='cId' placeholder='C ID' />
          </Col>
          <Col md={1}>
            <Label for='movidaId'>Movida ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
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
            <Input type='text' name='isrc' id='isrc' placeholder='ISRC' />
          </Col>

          <Col md={1}>
            <Label for='movidaTitleId'>Movida Title ID</Label>
          </Col>
          <Col>
            <Input
              type='text'
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

export default CoreMetadataEditMode;
