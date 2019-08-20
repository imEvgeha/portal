import React, { Component, Fragment } from 'react';
import { 
    Col, 
    Row,
    ListGroup,
    ListGroupItem,
    Card,
    CardHeader,
    CardBody, } from 'reactstrap';
import PropTypes from 'prop-types';
import '../territorymetadata/MetadataTerritoryTab.scss';
import { EPISODE, SEASON } from '../../../../../constants/metadata/contentType';
import {
    getFilteredCastList,
    getFilteredCrewList, getFormatTypeName,
} from '../../../../../constants/metadata/configAPI';
import Lozenge from '@atlaskit/lozenge';

class EditorialMetadataTab extends Component {

    emptySpan = () => {
        return <span style={{ color: '#999' }}>Empty</span>;
    };

    render() {
        return (
            <div id="editorialMetadataTabs">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col md={3}><b>Locale: </b> {this.props.data.locale ? this.props.data.locale : this.emptySpan()}</Col>
                        <Col md={3}><b>Language: </b> {this.props.data.language ? this.props.getLanguageByCode(this.props.data.language) : this.emptySpan()}</Col>
                        <Col md={3}><b>Format: </b> {this.props.data.format ? this.props.data.format : this.emptySpan()}</Col>
                        <Col md={3}><b>Service: </b> {this.props.data.service ? this.props.data.service : this.emptySpan()}</Col>
                    </Row>

                    {(this.props.titleContentType === EPISODE.apiName || this.props.titleContentType === SEASON.apiName) &&
                        <Row style={{ padding: '15px' }}>
                            <Col md={3}><b>Series Name: </b> {this.props.data.seriesName ? this.props.data.seriesName : this.emptySpan()}</Col>
                            <Col md={3}><b>Season Number: </b> {this.props.data.seasonNumber ? this.props.data.seasonNumber : this.emptySpan()}</Col>
                            {this.props.titleContentType === EPISODE.apiName &&
                                <Col md={3}><b>Episode Number: </b> {this.props.data.episodeNumber ? this.props.data.episodeNumber : this.emptySpan()}</Col>
                            }
                        </Row>}
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Genres: </b> {this.props.data.genres && this.props.data.genres.length > 0 ?
                                this.props.data.genres.map((code, i) => (
                                    this.props.data.genres.length === i + 1 ?
                                        <span key={i}>{code.genre}</span> : <span key={i}>{code.genre},</span>
                                )) :
                                this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Display Title:</b> {this.props.data.title ? (this.props.data.title.title ? this.props.data.title.title : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Brief Title:</b> {this.props.data.title ? (this.props.data.title.shortTitle ? this.props.data.title.shortTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Medium Title:</b> {this.props.data.title ? (this.props.data.title.mediumTitle ? this.props.data.title.mediumTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Long Title:</b> {this.props.data.title ? (this.props.data.title.longTitle ? this.props.data.title.longTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Short Title:</b> {this.props.data.title ? (this.props.data.title.sortTitle ? this.props.data.title.sortTitle : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Short Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.description ? this.props.data.synopsis.description : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Med Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.shortDescription ? this.props.data.synopsis.shortDescription : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Long Synopsis:</b> {this.props.data.synopsis ? (this.props.data.synopsis.longDescription ? this.props.data.synopsis.longDescription : this.emptySpan()) : this.emptySpan()}
                        </Col>
                    </Row>
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
                                                    getFilteredCastList(this.props.data.castCrew, false, true).map((cast, i) => {
                                                        return (
                                                            <ListGroupItem key={i}>
                                                                <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{ marginLeft: '10px', width: '30px', height: '30px', verticalAlign: 'middle' }} />
                                                                <span style={{ marginLeft: '10px' }}>
                                                                    <Lozenge appearance={'default'}>{getFormatTypeName(cast.personType)}</Lozenge>
                                                                </span>
                                                                <span style={{ marginLeft: '10px' }}>{cast.displayName}</span>
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
                                                            <img src="https://www.hbook.com/webfiles/1562167874472/images/default-user.png" alt="Cast" style={{ marginLeft: '10px', width: '30px', height: '30px', verticalAlign: 'middle' }} />
                                                            <span style={{ marginLeft: '10px' }}>
                                                                <Lozenge appearance={'default'}>{getFormatTypeName(crew.personType)}</Lozenge>
                                                            </span>
                                                            <span style={{ marginLeft: '10px' }}>{crew.displayName}</span>
                                                        </ListGroupItem>
                                                    ))}
                                            </ListGroup>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            : null
                    }
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Copyright:</b> {this.props.data.copyright ? this.props.data.copyright : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Awards:</b> {this.props.data.awards ? this.props.data.awards : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Sasktel Inventory ID:</b> {this.props.data.sasktelInventoryId ? this.props.data.sasktelInventoryId : this.emptySpan()}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col style={{ wordWrap: 'break-word' }}>
                            <b>Sasktel Lineup ID:</b> {this.props.data.sasktelLineupId ? this.props.data.sasktelLineupId : this.emptySpan()}
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

EditorialMetadataTab.propTypes = {
    data: PropTypes.object,
    titleContentType: PropTypes.string,
    getLanguageByCode: PropTypes.func
};


export default EditorialMetadataTab;