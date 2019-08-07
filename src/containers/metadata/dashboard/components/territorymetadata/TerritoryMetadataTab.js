import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatTypeFirstLetter } from '../../../../../constants/metadata/format';
import { DATE_FORMAT } from '../../../../../constants/metadata/constant-variables';

class TerritoryMetadataTab extends Component {
    render() {
        return (
            <div id="territoryMetadataTabs">
                <Container>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Territory Type: </b> {this.props.data.territoryType ? formatTypeFirstLetter(this.props.data.territoryType) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Locale: </b> {this.props.data.locale ? this.props.getLanguageByCode(this.props.data.locale, this.props.data.territoryType) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                        <Col>
                            <b>Box Office: </b> {this.props.data.boxOffice ? this.props.data.boxOffice : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Release Year: </b> {this.props.data.releaseYear ? this.props.data.releaseYear : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                        <Col>
                            <b>Original Air Date: </b> {this.props.data.originalAirDate ? moment(this.props.data.originalAirDate).format(DATE_FORMAT) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Home Video Release Date: </b> {this.props.data.homeVideoReleaseDate ? moment(this.props.data.homeVideoReleaseDate).format(DATE_FORMAT) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                        <Col>
                            <b>Avail Announce Date: </b> {this.props.data.availAnnounceDate ? moment(this.props.data.availAnnounceDate).format(DATE_FORMAT) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Theatrical Release Date: </b> {this.props.data.theatricalReleaseDate ? moment(this.props.data.theatricalReleaseDate).format(DATE_FORMAT) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                        <Col>
                            <b>EST Release Date: </b> {this.props.data.estReleaseDate ? moment(this.props.data.estReleaseDate).format(DATE_FORMAT) : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

TerritoryMetadataTab.propTypes = {
    data: PropTypes.object,
    getLanguageByCode: PropTypes.func
};


export default TerritoryMetadataTab;