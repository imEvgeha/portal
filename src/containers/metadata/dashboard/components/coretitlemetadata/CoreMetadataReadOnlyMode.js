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
import Lozenge from '@atlaskit/lozenge';
// import { getSortedData } from '../../../../../util/Common';

// const SORT_TYPE = 'displayName';
// const IS_ASC = true;
// getFilteredCrewList(getSortedData(this.props.data.castCrew, SORT_TYPE, IS_ASIC), false).map(e => console.log(e));

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
                                                getFilteredCastList(this.props.data.castCrew, false).map((cast, i) => {                                                    
                                                    return (
                                                        <ListGroupItem key={i}>
                                                            <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{marginLeft: '10px', width: '30px', height: '30px', verticalAlign: 'middle'}} />
                                                            <span style={{marginLeft: '10px'}}>{cast.displayName}</span>
                                                        </ListGroupItem>
                                                    );
                                                })}
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
                                                        <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{marginLeft: '10px', width: '30px', height: '30px', verticalAlign: 'middle'}} />
                                                        <span style={{ marginLeft: '10px' }}>                                                            
                                                            <Lozenge appearance={'default'}>{getFormatTypeName(crew.personType)}</Lozenge>
                                                        </span>
                                                        <span style={{marginLeft: '10px'}}>{crew.displayName}</span>
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
                            <div id="coreMetadataEditMode">
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.eidrLevel1 ?
                                            <Col>
                                                <Alert color='light' ><b style={{ color: '#000' }}>EIDR Level 1: </b> {this.props.data.externalIds ? this.props.data.externalIds.eidrLevel1 : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.externalIds.tmsId ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>TMS ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.tmsId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.eidrLevel2 ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>EIDR Level 2: </b> {this.props.data.externalIds ? this.props.data.externalIds.eidrLevel2 : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.externalIds.xfinityMovieId ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>Xfinity Movie ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.dmaId ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>DMA ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.dmaId : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.externalIds.licensorTitleId ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>Licensor Title ID:</b> {this.props.data.externalIds ? this.props.data.externalIds.licensorTitleId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.isan ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>ISAN: </b> {this.props.data.externalIds ? this.props.data.externalIds.isan : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.externalIds.overrideMsvAssociationId ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>Override MSV Association ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.overrideMsvAssociationId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.alid ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>ALID: </b> {this.props.data.externalIds ? this.props.data.externalIds.alid : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.legacyIds && this.props.data.legacyIds.vz ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>VZ Title ID: </b> {this.props.data.legacyIds.vz.vzTitleId ? this.props.data.legacyIds.vz.vzTitleId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.cid ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>C ID: </b> {this.props.data.externalIds ? this.props.data.externalIds.cid : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.legacyIds && this.props.data.legacyIds.movida ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>Movida ID: </b> {this.props.data.legacyIds.movida.movidaId ? this.props.data.legacyIds.movida.movidaId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    {
                                        this.props.data.externalIds.isrc ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>ISRC: </b> {this.props.data.externalIds ? this.props.data.externalIds.isrc : null}</Alert>
                                            </Col> : null
                                    }
                                    {
                                        this.props.data.legacyIds && this.props.data.legacyIds.movida ?
                                            <Col>
                                                <Alert color='light'><b style={{ color: '#000' }}>Movida Title ID: </b> {this.props.data.legacyIds.movida.movidaTitleId ? this.props.data.legacyIds.movida.movidaTitleId : null}</Alert>
                                            </Col> : null
                                    }
                                </Row>
                            </div>
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
