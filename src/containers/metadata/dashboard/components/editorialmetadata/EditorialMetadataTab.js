import React, { Component, Fragment } from 'react';
import { 
    Col, 
    Row,
    ListGroup,
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
import { CHARACTER_NAME } from '../../../../../constants/metadata/constant-variables';
import PersonListReadOnly from '../coretitlemetadata/PersonListReadOnly';
import './EditorialMetadata.scss';

function EditorialMetadataTab({data, titleContentType, getLanguageByCode}) {

    const { episodic, locale, language, format, service, genres, synopsis, castCrew,
        copyright, awards, sasktelInventoryId, sasktelLineupId } = data;
    const {title, shortTitle, mediumTitle, longTitle, sortTitle} = data.title || {};
    const {seriesName, seasonNumber, episodeNumber} = episodic || {};
    const {description, shortDescription, longDescription } = synopsis || {};

    function emptySpan() {
        return <span className='metadata-empty-value'>Empty</span>;
    }

    return (
        <div id="editorialMetadataTabs">
            <Row>
                <Col md={3}><b>Locale: </b> {locale || emptySpan()}</Col>
                <Col md={3}><b>Language: </b> {language ? getLanguageByCode(language) : emptySpan()}</Col>
                <Col md={3}><b>Format: </b> {format || emptySpan()}</Col>
                <Col md={3}><b>Service: </b> {service || emptySpan()}</Col>
            </Row>

            {(titleContentType === EPISODE.apiName || titleContentType === SEASON.apiName) && (
                <Row>
                    <Col md={3}><b>Series Name: </b> {seriesName || emptySpan()}</Col>
                    <Col md={3}><b>Season Number: </b> {seasonNumber || emptySpan()}</Col>
                    {titleContentType === EPISODE.apiName &&
                    <Col md={3}><b>Episode Number: </b> {episodeNumber || emptySpan()}</Col>}
                </Row>
              )}
            <Row>
                <Col>
                    <b>Genres: </b> {genres && genres.length > 0 ?
                        genres.map((code, i) => (
                            genres.length === i + 1 ?
                                <span key={i}>{code.genre}</span> : <span key={i}>{code.genre},</span>
                        )) :
                        emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Display Title:</b> {title || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Brief Title:</b> {shortTitle || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Medium Title:</b> {mediumTitle || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Long Title:</b> {longTitle || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Sort Title:</b> {sortTitle || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Short Synopsis:</b> {description || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Med Synopsis:</b> {shortDescription || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Long Synopsis:</b> {longDescription || emptySpan()}
                </Col>
            </Row>
            {
                    castCrew && castCrew.length > 0 &&
                        (
                        <Row>
                            <Col>
                                <Card id='cardContainer'>
                                    <CardHeader className='clearfix'>
                                        <h4 className='float-left'>Cast</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <ListGroup id='listContainer'>
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
                                <Card id='cardContainer'>
                                    <CardHeader className='clearfix'>
                                        <h4 className='float-left'>Crew</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <ListGroup id='listContainer'>
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
)
                }
            <Row>
                <Col className='wrap-value'>
                    <b>Copyright:</b> {copyright || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Awards:</b> {awards || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Sasktel Inventory ID:</b> {sasktelInventoryId || emptySpan()}
                </Col>
            </Row>
            <Row>
                <Col className='wrap-value'>
                    <b>Sasktel Lineup ID:</b> {sasktelLineupId || emptySpan()}
                </Col>
            </Row>
        </div>
    );
}

EditorialMetadataTab.propTypes = {
    data: PropTypes.object,
    titleContentType: PropTypes.string,
    getLanguageByCode: PropTypes.func
};


export default EditorialMetadataTab;