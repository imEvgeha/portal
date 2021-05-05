import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Alert, Col, Container, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import CoreMetadataReadOnlyMode from './coretitlemetadata/CoreMetadataReadOnlyMode';
import {EPISODE, toPrettyContentTypeIfExist} from '../../../../constants/metadata/contentType';
import Spinner from '@atlaskit/spinner';
import {renderTitleName} from './utils/utils';

class TitleReadOnlyMode extends Component {
    constructor(props) {
        super(props);
    }

    addBooleanQuotes = fieldName => {
        if (fieldName !== undefined && fieldName !== null) {
            return fieldName.toString();
        }
        return fieldName;
    };

    renderFields = data => {
        const {
            title,
            releaseYear,
            usBoxOffice,
            animated,
            totalNumberOfSeasons,
            totalNumberOfEpisodes,
            countryOfOrigin,
            duration,
            eventType,
            metadataStatus,
            seasonPremiere,
            seasonFinale,
            contentType,
            contentSubType,
            originalLanguage,
            episodic,
            parentIds,
            category,
            id,
        } = data;
        const {seriesTitleName, seasonNumber, episodeNumber, seasonId, episodeId, episodeCount} = episodic || {};
        let seriesLink;
        let seasonLink;
        parentIds &&
            parentIds.map(e => {
                if (e.contentType === 'SERIES') {
                    seriesLink = e.id;
                }
                if (e.contentType === 'SEASON') {
                    seasonLink = e.id;
                }
            });

        return (
            <Container fluid id="titleContainer">
                <Row style={{marginTop: '5px'}}>
                    <Col md="4">
                        <img
                            width="700"
                            height="350"
                            src="https://www.bbsocal.com/wp-content/uploads/2018/05/image-placeholder.png"
                            alt=""
                            className="placeholder-img"
                        />
                    </Col>
                    <Col md="8">
                        <Row>
                            <Col>
                                <Alert color="light" id="titleName">
                                    <h2>
                                        <b>{contentType === EPISODE.apiName ? 'Concatenated Title' : 'Title'} </b>
                                        {title ? (
                                            renderTitleName(
                                                title,
                                                contentType,
                                                seasonNumber,
                                                episodeNumber,
                                                seriesTitleName
                                            )
                                        ) : (
                                            <span style={{color: '#999'}}>Empty</span>
                                        )}
                                    </h2>
                                </Alert>
                            </Col>
                        </Row>
                        {seasonNumber && episodeNumber && (
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleContentType">
                                        <b>Title:</b>
                                        {title ? title : <span style={{color: '#999'}}>Empty</span>}
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                <Alert color="light" id="titleContentType">
                                    <b>Content Type:</b>{' '}
                                    {contentType ? (
                                        toPrettyContentTypeIfExist(contentType)
                                    ) : (
                                        <span style={{color: '#999'}}>Empty</span>
                                    )}
                                </Alert>
                            </Col>
                        </Row>
                        {contentSubType && (
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleContentSubType">
                                        <b>Content SubType: </b>
                                        {contentSubType.substring(0, 1).toUpperCase() +
                                            contentSubType.substring(1, contentSubType.length).toLowerCase()}
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                        <>
                            <Row>
                                {seriesTitleName && (
                                    <Col md="12">
                                        <Alert color="light" id="titleSeriesName">
                                            <b>Series: </b>{' '}
                                            <a href={seriesLink} className="linked-data">
                                                {seriesTitleName}
                                            </a>
                                        </Alert>
                                    </Col>
                                )}
                                {seasonNumber && (
                                    <Col md="6">
                                        <Alert color="light" id="titleSeasonNumber">
                                            <b>Season Number: </b>{' '}
                                            <a href={seasonLink} className="linked-data">
                                                {seasonNumber}
                                            </a>
                                        </Alert>
                                    </Col>
                                )}
                                {totalNumberOfEpisodes && (
                                    <Col md="6">
                                        <Alert color="light" id="totalNumberOfEpisodes">
                                            <b>Total Episodes: </b> <span>{totalNumberOfEpisodes}</span>
                                        </Alert>
                                    </Col>
                                )}
                                {episodeNumber && (
                                    <Col md="6">
                                        <Alert color="light" id="titleEpisodeNumber">
                                            <b>Episode Number: </b>
                                            {episodeNumber}
                                        </Alert>
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                {seasonId && (
                                    <Col>
                                        <Alert color="light" id="titleSeasonId">
                                            <b>Season ID: </b>
                                            {seasonId}
                                        </Alert>
                                    </Col>
                                )}
                                {episodeId && (
                                    <Col>
                                        <Alert color="light" id="titleEpisodeId">
                                            <b>Episode ID: </b>
                                            {episodeId}
                                        </Alert>
                                    </Col>
                                )}
                            </Row>
                        </>
                        <Row>
                            {totalNumberOfSeasons && (
                                <Col>
                                    <Alert color="light" id="titleSeasons">
                                        <b>Seasons: </b>
                                        {totalNumberOfSeasons}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {contentType === 'SERIES' && (
                                <Col>
                                    <Alert color="light" id="titleSeries">
                                        <Link to={`/metadata?parentId=${id}&contentType=SEASON`} className="linked-url">
                                            Show all seasons
                                        </Link>
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {this.addBooleanQuotes(animated) && (
                                <Col className="no-wrap">
                                    <Alert color="light" id="titleAnimated">
                                        <b>Animated: </b>
                                        {this.addBooleanQuotes(animated) === 'true' ? 'Y' : 'N'}
                                    </Alert>
                                </Col>
                            )}
                            {countryOfOrigin && (
                                <Col className="no-wrap">
                                    <Alert color="light" id="titleCountryOfOrigin">
                                        <b>Country of Origin: </b>
                                        {countryOfOrigin}
                                    </Alert>
                                </Col>
                            )}
                            {originalLanguage && (
                                <Col className="no-wrap">
                                    <Alert color="light" id="titleOriginalLanguage">
                                        <b>Original Language: </b>
                                        {originalLanguage}
                                    </Alert>
                                </Col>
                            )}
                            {duration && (
                                <Col className="no-wrap">
                                    <Alert color="light" id="titleDuration">
                                        <b>Duration: </b>
                                        {duration}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {metadataStatus && (
                                <Col>
                                    <Alert color="light" id="titleMetadataStatus">
                                        <b>Metadata Status: </b>
                                        {metadataStatus}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {eventType && (
                                <Col>
                                    <Alert color="light" id="titleEventType">
                                        <b>Event Type: </b>
                                        {eventType}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {contentType === 'SEASON' && (
                                <Col>
                                    <Alert color="light" id="titleEpisodeCount">
                                        <Link
                                            to={`/metadata?parentId=${id}&contentType=EPISODE`}
                                            className="linked-url"
                                        >
                                            Show all episodes
                                        </Link>
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {seasonPremiere && (
                                <Col>
                                    <Alert color="light" id="titleSeasonPremiere">
                                        <b>Season Premiere: </b>
                                        {this.addBooleanQuotes(seasonPremiere) === 'true' ? 'Y' : 'N'}
                                    </Alert>
                                </Col>
                            )}
                            {seasonFinale && (
                                <Col>
                                    <Alert color="light" id="titleSeasonFinale">
                                        <b>Season Finale: </b>
                                        {this.addBooleanQuotes(seasonFinale) === 'true' ? 'Y' : 'N'}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {releaseYear && (
                                <Col>
                                    <Alert color="light" id="titleReleaseYear">
                                        <b>Release Year: </b>
                                        {releaseYear}
                                    </Alert>
                                </Col>
                            )}
                            {usBoxOffice ? (
                                <Col>
                                    <Alert color="light" id="titleBoxOffice">
                                        <b>US Box Office: </b> {`$${usBoxOffice.toLocaleString()}`}
                                    </Alert>
                                </Col>
                            ) : null}
                        </Row>
                        <Row>
                            {category && category.length > 0 && (
                                <Col>
                                    <Alert color="light" id="titleCategory">
                                        <b>Categories: </b>
                                        {category.map((value, i) =>
                                            category.length === i + 1 ? (
                                                <span key={i}>{value.name}</span>
                                            ) : (
                                                <span key={i}>{value.name}, </span>
                                            )
                                        )}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
                <CoreMetadataReadOnlyMode
                    data={this.props.data}
                    toggleTitleRating={this.props.toggleTitleRating}
                    activeTab={this.props.activeTab}
                    externalIDs={this.props.externalIDs}
                />
            </Container>
        );
    };

    render() {
        const {data} = this.props;
        if (Object.values(data).length > 0) {
            return this.renderFields(data);
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
    toggleTitleRating: PropTypes.func,
    activeTab: PropTypes.any,
    externalIDs: PropTypes.array,
};

export default TitleReadOnlyMode;
