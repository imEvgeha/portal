import React, {Component, Fragment} from 'react';
import {Alert, Col, Container, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import CoreMetadataReadOnlyMode from './coretitlemetadata/CoreMetadataReadOnlyMode';
import {toPrettyContentTypeIfExist} from '../../../../constants/metadata/contentType';
import { Link } from 'react-router-dom';

class TitleReadOnlyMode extends Component {
    constructor(props) {
        super(props);
    }

    addBooleanQuotes = (fieldName) => {
        if(fieldName !== undefined && fieldName !== null) {
            return fieldName.toString();
        }
        return fieldName;
    };

    renderFields = () => {
        const { 
            title,
            releaseYear,
            boxOffice,
            animated,
            totalNumberOfSeasons,
            totalNumberOfEpisodes,
            countryOfOrigin,
            duration,
            eventType,
            seasonPremiere,
            seasonFinale,
            contentType,
            originalLanguage,
            episodic,
            parentIds
        } = this.props.data;
        let seriesLink;
        let seasonLink;
        parentIds && parentIds.map(e => {
            if(e.contentType === 'SERIES') {
                seriesLink = e.id;
            }
            if(e.contentType === 'SEASON') {
                seasonLink = e.id;
            }
        })

        return (
            <Fragment>
                <Container fluid id="titleContainer">
                    <Row style={{ marginTop: '5px' }}>
                        <Col xs="4">
                            <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleName"><h2><b>Title: </b>{title ? title : <span style={{ color: '#999' }}>Empty</span>}</h2></Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleContentType"><b>Content Type:</b> {contentType ? toPrettyContentTypeIfExist(contentType) : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                </Col>
                            </Row>
                            <Fragment>
                                <Row>
                                    {
                                        episodic && episodic.seriesTitleName ?
                                            <Col>
                                                <Alert color="light" id="titleSeasonNumber"><b>Series: </b>{episodic.seriesTitleName ? contentType === 'EPISODE' ? <a href={seriesLink} className={'linked-data'}>{episodic.seriesTitleName}</a> : episodic.seriesTitleName  : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                            </Col>
                                            : null
                                    }
                                    {
                                        episodic && episodic.seasonNumber ?
                                            <Col>
                                                <Alert color="light" id="titleSeasonNumber"><b>Season Number: </b>{episodic.seasonNumber ? contentType === 'EPISODE' ? <a href={seasonLink} className={'linked-data'}>{episodic.seasonNumber}</a> : episodic.seasonNumber : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                            </Col>
                                            : null
                                    }
                                    {
                                        episodic && episodic.episodeNumber ?
                                            <Col md={6}>
                                                <Alert color="light" id="titleEpisodeNumber"><b>Episode Number: </b>{episodic.episodeNumber ? episodic.episodeNumber : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                            </Col>
                                            : null
                                    }
                                </Row>
                                <Row>
                                    {
                                        episodic && episodic.seasonId ?
                                            <Col>
                                                <Alert color="light" id="titleSeasonId"><b>Season ID: </b>{episodic.seasonId ? episodic.seasonId : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                            </Col>
                                            : null
                                    }
                                    {
                                        episodic && episodic.episodeId ?
                                            <Col>
                                                <Alert color="light" id="titleEpisodeId"><b>Episode ID: </b>{episodic.episodeId ? episodic.episodeId : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                            </Col>
                                            : null
                                    }
                                </Row>
                            </Fragment>
                            <Row>
                                {
                                    totalNumberOfSeasons ?
                                        <Col>
                                            <Alert color="light" id="titleSeasons"><span><b>Seasons: </b>{totalNumberOfSeasons}</span></Alert>
                                        </Col>
                                        : null
                                }
                            </Row>
                            <Row>
                                {
                                    this.addBooleanQuotes(animated) ?
                                        <Col>
                                            <Alert color="light" id="titleAnimated"><span><b>Animated: </b>{this.addBooleanQuotes(animated) === 'true' ? 'Y' : 'N'}</span></Alert>
                                        </Col>
                                        : null
                                }
                                {
                                    countryOfOrigin ?
                                        <Col>
                                            <Alert color="light" id="titleCountryOfOrigin"><span><b>Country of Origin: </b>{countryOfOrigin}</span></Alert>
                                        </Col>
                                        : null
                                }
                                {
                                    originalLanguage ?
                                        <Col>
                                            <Alert color="light" id="titleOriginalLanguage"><span><b>Original Language: </b>{originalLanguage}</span></Alert>
                                        </Col>
                                        : null
                                }
                                {
                                    duration ?
                                        <Col>
                                            <Alert color="light" id="titleDuration"><span><b>Duration: </b>{duration}</span></Alert>
                                        </Col>
                                        : null
                                }
                            </Row>
                            <Row>
                                {
                                    eventType ?
                                        <Col>
                                            <Alert color="light" id="titleEventType"><span><b>Event Type: </b>{eventType}</span></Alert>
                                        </Col>
                                        : null
                                }
                                {
                                    totalNumberOfEpisodes ?
                                        <Col>
                                            <Alert color="light" id="titleEpisodes"><span><b>Episodes: </b>{totalNumberOfEpisodes}</span></Alert>
                                        </Col>
                                        : null
                                }
                                {
                                    this.props.data.episodic && this.props.data.episodic.episodeCount ?
                                        <Col>
                                            <Alert color="light" id="titleEpisodeCount"><span><b>Episode Count: </b>{this.props.data.episodic.episodeCount ? this.props.data.episodic.episodeCount : ''}</span></Alert>
                                        </Col>
                                        : null
                                }
                            </Row>
                            <Row>
                                {
                                    seasonPremiere ?
                                        <Col>
                                            <Alert color="light" id="titleSeasonPremiere"><span><b>Season Premiere: </b>{this.addBooleanQuotes(seasonPremiere) === 'true' ? 'Y' : 'N'}</span></Alert>
                                        </Col>
                                        : null
                                }
                                {
                                    seasonFinale ?
                                        <Col>
                                            <Alert color="light" id="titleSeasonFinale"><span><b>Season Finale: </b>{this.addBooleanQuotes(seasonFinale) === 'true' ? 'Y' : 'N'}</span></Alert>
                                        </Col>
                                        : null
                                }
                            </Row>
                            <Row>
                                {
                                    releaseYear ? 
                                    <Col>
                                        <Alert color="light" id="titleReleaseYear"><b>Release Year: </b>{releaseYear ? releaseYear : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                    </Col>
                                    : null
                                }
                                {
                                    boxOffice ?
                                    <Col>
                                        <Alert color="light" id="titleBoxOffice"><b>Box Office: </b> {boxOffice ? '$' + boxOffice : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                    </Col>
                                    : null
                                }
                            </Row>
                        </Col>
                    </Row>
                    <CoreMetadataReadOnlyMode
                        data={this.props.data}
                        toggleTitleRating={this.props.toggleTitleRating}
                        activeTab={this.props.activeTab}
                    />
                </Container>
            </Fragment>
        );
    };

    render() {
        if (this.props.data) {
            return this.renderFields();
        } else {
            return null;
        }
    }
}

TitleReadOnlyMode.propTypes = {
    data: PropTypes.object.isRequired,
    episodic: PropTypes.object,
    addBooleanQuotes: PropTypes.func,
    toggleTitleRating: PropTypes.func,
    activeTab: PropTypes.any
};

export default TitleReadOnlyMode;