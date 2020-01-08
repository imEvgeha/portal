import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Container} from 'reactstrap';
import moment from 'moment';
import {useIntl} from 'react-intl';
import {getDateFormatBasedOnLocale} from '../../../../../util/Common';
import {COUNTRY} from '../../../../../constants/metadata/constant-variables';

const TerritoryMetadataTab = ({data, getLanguageByCode}) => {
    const {
        locale,
        boxOffice,
        releaseYear,
        originalAirDate,
        homeVideoReleaseDate,
        availAnnounceDate,
        theatricalReleaseDate,
        estReleaseDate
    } = data || {};

    // Get locale provided by intl
    const intl = useIntl();
    const {globalLocale = 'en-US'} = intl || {};

    const dateFormat = getDateFormatBasedOnLocale(globalLocale);
    // Attach (UTC) to date, if it is simulcast
    const parseSimulcast = (date) => `${moment(date).format(dateFormat)}${date.endsWith('Z') ? ' (UTC)' : ''}`;

    return (
        <div id="territoryMetadataTabs">
            <Container>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Locale: </b>
                        {locale
                            ? getLanguageByCode(locale, COUNTRY)
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                    <Col>
                        <b>Box Office: </b>
                        {boxOffice
                            ? boxOffice
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Release Year: </b>
                        {releaseYear
                            ? releaseYear
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                    <Col>
                        <b>Original Air Date: </b>
                        {originalAirDate
                            ? parseSimulcast(originalAirDate)
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Home Video Release Date: </b>
                        {homeVideoReleaseDate
                            ? parseSimulcast(homeVideoReleaseDate)
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                    <Col>
                        <b>Avail Announce Date: </b>
                        {availAnnounceDate
                            ? parseSimulcast(availAnnounceDate)
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Theatrical Release Date: </b>
                        {theatricalReleaseDate
                            ? parseSimulcast(theatricalReleaseDate)
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                    <Col>
                        <b>EST Release Date: </b>
                        {estReleaseDate
                            ? parseSimulcast(estReleaseDate)
                            : <span style={{color: '#999'}}>Empty</span>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

TerritoryMetadataTab.propTypes = {
    data: PropTypes.object,
    getLanguageByCode: PropTypes.func
};

TerritoryMetadataTab.defaultProps = {
    data: {},
    getLanguageByCode: () => null,
};

export default TerritoryMetadataTab;