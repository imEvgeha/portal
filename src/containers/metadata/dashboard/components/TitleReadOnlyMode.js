import React, {Component, Fragment} from 'react';
import {Alert, Col, Container, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import CoreMetadataReadOnlyMode from './coretitlemetadata/CoreMetadataReadOnlyMode';
import {toPrettyContentTypeIfExist} from '../../../../constants/metadata/contentType';
import Spinner from '@atlaskit/spinner';

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
            episodic: { seriesTitleName, seasonNumber, episodeNumber, seasonId, episodeId, episodeCount },
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
        });

        return (
            <Fragment>
                <Container fluid id="titleContainer">
                    <Row style={{ marginTop: '5px' }}>
                        <Col xs="4">
                            <img width="700" height="350" src="https://www.bbsocal.com/wp-content/uploads/2018/05/image-placeholder.png" alt="Slide" />
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
                                    {seriesTitleName && (
                                        <Col>
                                            <Alert color="light" id="titleSeriesName">
                                                <b>Series: </b><a href={seriesLink} className={'linked-data'}>{seriesTitleName}</a>
                                            </Alert>
                                        </Col>)}
                                    {
                                       seasonNumber && (
                                        <Col>
                                            <Alert color="light" id="titleSeasonNumber">
                                                <b>Season Number: </b><a href={seasonLink} className={'linked-data'}>{seasonNumber}</a>
                                            </Alert>
                                        </Col>
                                       )
                                    }
                                    {
                                       episodeNumber && (
                                        <Col md={6}>
                                            <Alert color="light" id="titleEpisodeNumber">
                                                <b>Episode Number: </b>{episodeNumber}
                                            </Alert>
                                        </Col>
                                       )
                                    }
                                </Row>
                                <Row>
                                    {
                                        seasonId && (
                                            <Col>
                                                <Alert color="light" id="titleSeasonId">
                                                    <b>Season ID: </b>{seasonId}
                                                </Alert>
                                            </Col>
                                        )
                                    }
                                    {
                                        episodeId && (
                                            <Col>
                                                <Alert color="light" id="titleEpisodeId">
                                                    <b>Episode ID: </b>{episodeId}
                                                </Alert>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </Fragment>
                            <Row>
                                {
                                    totalNumberOfSeasons && (
                                        <Col>
                                            <Alert color="light" id="titleSeasons">
                                                <b>Seasons: </b>{totalNumberOfSeasons}
                                            </Alert>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row>
                                {
                                    this.addBooleanQuotes(animated) && (
                                        <Col>
                                            <Alert color="light" id="titleAnimated">
                                                <b>Animated: </b>{this.addBooleanQuotes(animated) === 'true' ? 'Y' : 'N'}
                                            </Alert>
                                        </Col>
                                    )
                                }
                                {
                                    countryOfOrigin && (
                                        <Col>
                                            <Alert color="light" id="titleCountryOfOrigin">
                                                <b>Country of Origin: </b>{countryOfOrigin}
                                            </Alert>
                                        </Col>
                                    )
                                }
                                {
                                    originalLanguage && (
                                        <Col>
                                            <Alert color="light" id="titleOriginalLanguage">
                                                <b>Original Language: </b>{originalLanguage}
                                            </Alert>
                                        </Col>
                                    )
                                }
                                {
                                    duration && (
                                        <Col>
                                            <Alert color="light" id="titleDuration">
                                                <b>Duration: </b>{duration}
                                            </Alert>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row>
                                {
                                    eventType && (
                                        <Col>
                                            <Alert color="light" id="titleEventType">
                                                <b>Event Type: </b>{eventType}
                                            </Alert>
                                        </Col>
                                    )
                                }
                                {
                                    totalNumberOfEpisodes && (
                                        <Col>
                                            <Alert color="light" id="titleEpisodes">
                                                <b>Episodes: </b>{totalNumberOfEpisodes}
                                            </Alert>
                                        </Col>
                                    )
                                }
                                {
                                    episodeCount && (
                                        <Col>
                                            <Alert color="light" id="titleEpisodeCount">
                                                <b>Episode Count: </b>{episodeCount}
                                            </Alert>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row>
                                {
                                    seasonPremiere && (
                                        <Col>
                                            <Alert color="light" id="titleSeasonPremiere">
                                                <b>Season Premiere: </b>{this.addBooleanQuotes(seasonPremiere) === 'true' ? 'Y' : 'N'}
                                            </Alert>
                                        </Col>
                                    )
                                }
                                {
                                    seasonFinale && (
                                        <Col>
                                            <Alert color="light" id="titleSeasonFinale">
                                                <b>Season Finale: </b>{this.addBooleanQuotes(seasonFinale) === 'true' ? 'Y' : 'N'}
                                            </Alert>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row>
                                {
                                    releaseYear && (
                                        <Col>
                                        <Alert color="light" id="titleReleaseYear">
                                            <b>Release Year: </b>{releaseYear}
                                        </Alert>
                                    </Col>
                                    )
                                }
                                {
                                    boxOffice && (
                                        <Col>
                                            <Alert color="light" id="titleBoxOffice">
                                                <b>Box Office: </b> {'$' + boxOffice}</Alert>
                                        </Col>
                                    )
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
        const {data: { episodic }} = this.props;
        if (episodic) {
            return this.renderFields();
        } else {
            return (
                <div style={{textAlign: 'center'}}>
                    <Spinner size="xlarge" />
                </div>
            );
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