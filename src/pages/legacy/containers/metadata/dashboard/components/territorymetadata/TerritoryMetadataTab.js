import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Container} from 'reactstrap';
import moment from 'moment';
import {useIntl} from 'react-intl';
import {COUNTRY} from '../../../../../constants/metadata/constant-variables';
import {getDateFormatBasedOnLocale, parseSimulcast} from '../../../../../../../util/date-time/DateTimeUtils';

const TerritoryMetadataTab = ({data, getLanguageByCode}) => {
    const {
        locale,
        boxOffice,
        releaseYear,
        originalAirDate,
        homeVideoReleaseDate,
        availAnnounceDate,
        theatricalReleaseDate,
        estReleaseDate,
        metadataStatus,
    } = data || {};

    // Get locale provided by intl
    const intl = useIntl();
    const {locale: globalLocale = 'en-US'} = intl || {};

    const dateFormat = getDateFormatBasedOnLocale(globalLocale);

    return (
        <div id="territoryMetadataTabs">
            <Container>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Metadata Status: </b>
                        {metadataStatus ? metadataStatus : <span style={{color: '#999'}}>Empty</span>}
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Locale: </b>
                        {locale ? getLanguageByCode(locale, COUNTRY) : <span style={{color: '#999'}}>Empty</span>}
                    </Col>
                    {boxOffice && (
                        <Col>
                            <b>Box Office: </b>
                            {boxOffice}
                        </Col>
                    )}
                </Row>
                {(releaseYear || originalAirDate) && (
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <b>Release Year: </b>
                            {releaseYear ? releaseYear : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                        <Col>
                            <b>Original Air Date: </b>
                            {originalAirDate ? (
                                parseSimulcast(originalAirDate, dateFormat, false)
                            ) : (
                                <span style={{color: '#999'}}>Empty</span>
                            )}
                        </Col>
                    </Row>
                )}
                {(homeVideoReleaseDate || availAnnounceDate) && (
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <b>Home Video Release Date: </b>
                            {homeVideoReleaseDate ? (
                                parseSimulcast(homeVideoReleaseDate, dateFormat, false)
                            ) : (
                                <span style={{color: '#999'}}>Empty</span>
                            )}
                        </Col>
                        <Col>
                            <b>Avail Announce Date: </b>
                            {availAnnounceDate ? (
                                parseSimulcast(availAnnounceDate, dateFormat, false)
                            ) : (
                                <span style={{color: '#999'}}>Empty</span>
                            )}
                        </Col>
                    </Row>
                )}
                {(theatricalReleaseDate || estReleaseDate) && (
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <b>Theatrical Release Date: </b>
                            {theatricalReleaseDate ? (
                                parseSimulcast(theatricalReleaseDate, dateFormat, false)
                            ) : (
                                <span style={{color: '#999'}}>Empty</span>
                            )}
                        </Col>
                        <Col>
                            <b>EST Release Date: </b>
                            {estReleaseDate ? (
                                parseSimulcast(estReleaseDate, dateFormat, false)
                            ) : (
                                <span style={{color: '#999'}}>Empty</span>
                            )}
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

TerritoryMetadataTab.propTypes = {
    data: PropTypes.object,
    getLanguageByCode: PropTypes.func,
};

TerritoryMetadataTab.defaultProps = {
    data: {},
    getLanguageByCode: () => null,
};

export default TerritoryMetadataTab;
