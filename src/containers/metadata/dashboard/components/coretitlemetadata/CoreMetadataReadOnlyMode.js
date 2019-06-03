import React, { Component, Fragment } from 'react';
import {
    FormGroup,
    Alert,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Card,
    CardHeader,
    CardBody,
} from 'reactstrap';
import './CoreMetadata.scss';
import PropTypes from 'prop-types';
import {
    getFilteredCastList,
    getFilteredCrewList, getFormatTypeName,
} from '../../../../../constants/metadata/configAPI';
import Rating from './rating/Rating';

class CoreMetadataReadOnlyMode extends Component {
    render() {
        return (
            <Fragment>
                {
                    this.props.data.castCrew && this.props.data.castCrew.length > 0 ?
                        <Row style={{ marginTop: '15px' }}>
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
                                            {this.props.data.castCrew &&
                                                getFilteredCastList(this.props.data.castCrew, false).map((cast, i) => (
                                                    <ListGroupItem key={i}>
                                                        {cast.displayName}
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
                                            {this.props.data.castCrew &&
                                                getFilteredCrewList(this.props.data.castCrew, false).map((crew, i) => (
                                                    <ListGroupItem key={i}>
                                                        <span style={{ fontSize: '14px', color: '#666' }}>
                                                            {getFormatTypeName(crew.personType)}
                                                        </span>{' '}
                                                        {crew.displayName}
                                                    </ListGroupItem>
                                                ))}
                                        </ListGroup>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        : null
                }
                <Row style={{ marginTop: '10px' }}>
                    <Rating
                        activeTab={this.props.activeTab ? this.props.activeTab : 0}
                        isEditMode={false}
                        ratings={this.props.data.ratings}
                        toggle={this.props.toggleTitleRating}
                    />
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    {
                        this.props.data.awards && this.props.data.awards.length > 0 ?
                            <Col>
                                <FormGroup>
                                    <Alert color='light'><b>Awards: </b> {this.props.data.awards}</Alert>
                                </FormGroup>
                            </Col>
                            : null
                    }
                </Row>
                {
                    this.props.data.externalIds ?
                        <Fragment>
                            <hr />
                            <h4>External IDs</h4>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.eidrLevel1 ?
                                        <Col>
                                            <Alert color='light' ><b>EIDR Level 1: </b> {this.props.data.externalIds ? this.props.data.externalIds.eidrLevel1 : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.externalIds.tmsId ?
                                        <Col>
                                            <Alert color='light'><b>TMS ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.tmsId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.eidrLevel2 ?
                                        <Col>
                                            <Alert color='light'><b>EIDR Level 2: </b> {this.props.data.externalIds ? this.props.data.externalIds.eidrLevel2 : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.externalIds.xfinityMovieId ?
                                        <Col>
                                            <Alert color='light'><b>Xfinity Movie ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.dmaId ?
                                        <Col>
                                            <Alert color='light'><b>DMA ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.dmaId : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.externalIds.licensorTitleId ?
                                        <Col>
                                            <Alert color='light'><b>Licensor Title ID:</b> {this.props.data.externalIds ? this.props.data.externalIds.licensorTitleId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.isan ?
                                        <Col>
                                            <Alert color='light'><b>ISAN: </b> {this.props.data.externalIds ? this.props.data.externalIds.isan : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.externalIds.overrideMsvAssociationId ?
                                        <Col>
                                            <Alert color='light'><b>Override MSV Association ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.overrideMsvAssociationId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.alid ?
                                        <Col>
                                            <Alert color='light'><b>ALID: </b> {this.props.data.externalIds ? this.props.data.externalIds.alid : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.legacyIds && this.props.data.legacyIds.vz ?
                                        <Col>
                                            <Alert color='light'><b>VZ Title ID: </b> {this.props.data.legacyIds.vz.vzTitleId ? this.props.data.legacyIds.vz.vzTitleId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.cid ?
                                        <Col>
                                            <Alert color='light'><b>C ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.cid : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.legacyIds && this.props.data.legacyIds.movida ?
                                        <Col>
                                            <Alert color='light'><b>Movida ID: </b> {this.props.data.legacyIds.movida.movidaId ? this.props.data.legacyIds.movida.movidaId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                {
                                    this.props.data.externalIds.isrc ?
                                        <Col>
                                            <Alert color='light'><b>ISRC: </b> {this.props.data.externalIds ? this.props.data.externalIds.isrc : null}</Alert>
                                        </Col> : null
                                }
                                {
                                    this.props.data.legacyIds && this.props.data.legacyIds.movida ?
                                        <Col>
                                            <Alert color='light'><b>Movida Title ID: </b> {this.props.data.legacyIds.movida.movidaTitleId ? this.props.data.legacyIds.movida.movidaTitleId : null}</Alert>
                                        </Col> : null
                                }
                            </Row>
                        </Fragment>
                        : null
                }
            </Fragment>
        );
    }
}

CoreMetadataReadOnlyMode.propTypes = {
    data: PropTypes.object,
    toggleTitleRating: PropTypes.func,
    activeTab: PropTypes.any
};

export default CoreMetadataReadOnlyMode;
