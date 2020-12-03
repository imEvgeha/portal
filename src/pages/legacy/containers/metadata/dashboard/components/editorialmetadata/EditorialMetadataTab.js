import React from 'react';
import {Col, Row, ListGroup, Card, CardHeader, CardBody} from 'reactstrap';
import PropTypes from 'prop-types';
import '../territorymetadata/MetadataTerritoryTab.scss';
import {EPISODE, SEASON} from '../../../../../constants/metadata/contentType';
import {getFilteredCastList, getFilteredCrewList, getFormatTypeName} from '../../../../../constants/metadata/configAPI';
import {CHARACTER_NAME} from '../../../../../constants/metadata/constant-variables';
import PersonListReadOnly from '../coretitlemetadata/PersonListReadOnly';
import './EditorialMetadata.scss';

const EditorialMetadataTab = ({data, titleContentType, getLanguageByCode}) => {
    const {
        episodic,
        locale,
        language,
        format,
        service,
        genres,
        category,
        synopsis,
        castCrew,
        copyright,
        awards,
        sasktelInventoryId,
        sasktelLineupId,
        shortTitleTemplate,
        metadataStatus,
    } = data;
    const {title, shortTitle, mediumTitle, longTitle, sortTitle} = data.title || {};
    const {seriesName, seasonNumber, episodeNumber} = episodic || {};
    const {description, shortDescription, longDescription} = synopsis || {};
    const isMaster = data['hasGeneratedChildren'] || false;

    const emptySpan = () => {
        return <span className="metadata-empty-value">Empty</span>;
    };

    return (
        <div id="editorialMetadataTabs">
            <Row>
                <Col>
                    <b>Metadata Status: </b>
                    {metadataStatus ? metadataStatus : <span style={{color: '#999'}}>Empty</span>}
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <b>Locale: </b> {locale || emptySpan()}
                </Col>
                <Col md={3}>
                    <b>Language: </b> {language ? getLanguageByCode(language) : emptySpan()}
                </Col>
                {format && (
                    <Col md={3}>
                        <b>Format: </b> {format}
                    </Col>
                )}
                {service && (
                    <Col md={3}>
                        <b>Service: </b> {service}
                    </Col>
                )}
            </Row>
            {(titleContentType === EPISODE.apiName || titleContentType === SEASON.apiName) && (
                <Row>
                    {seriesName && (
                        <Col md={3}>
                            <b>Series Name: </b> {seriesName}
                        </Col>
                    )}
                    {seasonNumber && (
                        <Col md={3}>
                            <b>Season Number: </b> {seasonNumber}
                        </Col>
                    )}
                    {titleContentType === EPISODE.apiName && episodeNumber && (
                        <Col md={3}>
                            <b>Episode Number: </b> {episodeNumber}
                        </Col>
                    )}
                </Row>
            )}
            {genres && genres.length > 0 && (
                <Row>
                    <Col>
                        <b>Genres: </b>
                        {genres.map((code, i) =>
                            genres.length === i + 1 ? (
                                <span key={i}>{code.genre}</span>
                            ) : (
                                <span key={i}>{code.genre}, </span>
                            )
                        )}
                    </Col>
                </Row>
            )}
            {category && category.length > 0 && (
                <Row>
                    <Col>
                        <b>Categories: </b>
                        {category.map((value, i) =>
                            category.length === i + 1 ? (
                                <span key={i}>{value.name}</span>
                            ) : (
                                <span key={i}>{value.name}, </span>
                            )
                        )}
                    </Col>
                </Row>
            )}
            {title && (
                <Row>
                    <Col className="wrap-value">
                        <b>Display Title:</b> {title}
                    </Col>
                </Row>
            )}
            {isMaster && (
                <Row>
                    <Col className="wrap-value">
                        <b>Auto-Decorate Title:</b> {shortTitleTemplate}
                    </Col>
                </Row>
            )}
            {shortTitle && (
                <Row>
                    <Col className="wrap-value">
                        <b>Brief Title:</b> {shortTitle}
                    </Col>
                </Row>
            )}
            {mediumTitle && (
                <Row>
                    <Col className="wrap-value">
                        <b>Medium Title:</b> {mediumTitle}
                    </Col>
                </Row>
            )}
            {longTitle && (
                <Row>
                    <Col className="wrap-value">
                        <b>Long Title:</b> {longTitle}
                    </Col>
                </Row>
            )}
            {sortTitle && (
                <Row>
                    <Col className="wrap-value">
                        <b>Sort Title:</b> {sortTitle}
                    </Col>
                </Row>
            )}
            {description && (
                <Row>
                    <Col className="wrap-value">
                        <b>Short Synopsis:</b> {description}
                    </Col>
                </Row>
            )}
            {shortDescription && (
                <Row>
                    <Col className="wrap-value">
                        <b>Med Synopsis:</b> {shortDescription}
                    </Col>
                </Row>
            )}
            {longDescription && (
                <Row>
                    <Col className="wrap-value">
                        <b>Long Synopsis:</b> {longDescription}
                    </Col>
                </Row>
            )}
            {castCrew && castCrew.length > 0 && (
                <Row>
                    <Col>
                        <Card id="cardContainer">
                            <CardHeader className="clearfix">
                                <h4 className="float-left">Cast</h4>
                            </CardHeader>
                            <CardBody>
                                <ListGroup id="listContainer">
                                    {castCrew &&
                                        getFilteredCastList(castCrew, false, true).map((cast, i) => {
                                            return (
                                                <PersonListReadOnly
                                                    key={i}
                                                    showPersonType={true}
                                                    person={cast}
                                                    columnName={CHARACTER_NAME}
                                                    getFormatTypeName={getFormatTypeName}
                                                />
                                            );
                                        })}
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card id="cardContainer">
                            <CardHeader className="clearfix">
                                <h4 className="float-left">Crew</h4>
                            </CardHeader>
                            <CardBody>
                                <ListGroup id="listContainer">
                                    {castCrew &&
                                        getFilteredCrewList(castCrew, false).map((crew, i) => (
                                            <PersonListReadOnly
                                                key={i}
                                                showPersonType={true}
                                                person={crew}
                                                getFormatTypeName={getFormatTypeName}
                                            />
                                        ))}
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
            {copyright && (
                <Row>
                    <Col className="wrap-value">
                        <b>Copyright:</b> {copyright}
                    </Col>
                </Row>
            )}
            {awards && (
                <Row>
                    <Col className="wrap-value">
                        <b>Awards:</b> {awards}
                    </Col>
                </Row>
            )}
            {sasktelInventoryId && (
                <Row>
                    <Col className="wrap-value">
                        <b>Sasktel Inventory ID:</b> {sasktelInventoryId}
                    </Col>
                </Row>
            )}
            {sasktelLineupId && (
                <Row>
                    <Col className="wrap-value">
                        <b>Sasktel Lineup ID:</b> {sasktelLineupId}
                    </Col>
                </Row>
            )}
        </div>
    );
};

EditorialMetadataTab.propTypes = {
    data: PropTypes.object,
    titleContentType: PropTypes.string,
    getLanguageByCode: PropTypes.func,
};

export default EditorialMetadataTab;
