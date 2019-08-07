import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatTypeFirstLetter } from '../.././../../../constants/metadata/format';
import { DATE_FORMAT } from '../../../../../constants/metadata/constant-variables';

class TerritoryMetadataEditMode extends Component {

    getValidDate = (date) => {
        if (date) {
            return moment(date).format(DATE_FORMAT);
        }
        return date;
    };

    shouldComponentUpdate(nextProps) {
        let differentData = this.props.data !== nextProps.data;
        return differentData;
    }

    render() {
        return (
            <div id="territoryMetadataEdit">
                <Container>
                    <AvForm onValidSubmit={this.props.validSubmit}>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <span>Territory Type</span><br />
                                {this.props.data.territoryType ? <b>{formatTypeFirstLetter(this.props.data.territoryType)}</b> : <span style={{ color: '#999' }}>Empty</span>}
                            </Col>
                            <Col>
                                <AvField label="Box Office" type="number" id="territoryBoxOffice" name="boxOffice" value={this.props.data.boxOffice} placeholder="Enter Box Office" onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                    }} />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <span>Locale</span><br />
                                {this.props.data.locale ? <b>{this.props.getLanguageByCode(this.props.data.locale, this.props.data.territoryType)}</b> : <span style={{ color: '#999' }}>Empty</span>}
                            </Col>
                            <Col>
                                <AvField label="Box Office" type="number" id="territoryBoxOffice" name="boxOffice" value={this.props.data.boxOffice} placeholder="Enter Box Office" onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                    }} />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <AvField label="Release Year" name="releaseYear" type="number" value={this.props.data.releaseYear} placeholder="Enter Release Year" onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a valid date!' },
                                        maxLength: { value: 4 }, minLength: { value: 4 }
                                    }} />
                            </Col>
                            <Col>
                                <AvField label="Original Air Date" type="date" id="territoryOriginalAirDate"
                                    name="originalAirDate"
                                    value={this.getValidDate(this.props.data.originalAirDate)}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    errorMessage="Please enter a valid date!" />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <AvField label="Home Video Release Date" type="date" id="territoryHomeVideoReleaseDate"
                                    name="homeVideoReleaseDate"
                                    value={this.getValidDate(this.props.data.homeVideoReleaseDate)}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    errorMessage="Please enter a valid date!" />
                            </Col>
                            <Col>
                                <AvField label="Avail Announce Date" type="date" id="territoryAvailAnnounceDate"
                                    name="availAnnounceDate"
                                    value={this.getValidDate(this.props.data.availAnnounceDate)}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    errorMessage="Please enter a valid date!" />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <AvField label="Theatrical Release Date" type="date" id="territoryTheatricalReleaseDate"
                                    name="theatricalReleaseDate"
                                    value={this.getValidDate(this.props.data.theatricalReleaseDate)}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    validate={{
                                        date: { format: DATE_FORMAT, errorMessage: 'Please enter a valid date!' },
                                    }}
                                    errorMessage="Please enter a valid date!" />
                            </Col>
                            <Col>
                                <AvField label="EST Release Date" type="date" id="territoryESTReleaseYear"
                                    name="estReleaseDate"
                                    value={this.getValidDate(this.props.data.estReleaseDate)}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    errorMessage="Please enter a valid date!" />
                            </Col>
                        </Row>
                    </AvForm>
                </Container>
            </div>
        );
    }
}

TerritoryMetadataEditMode.propTypes = {
    data: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    validSubmit: PropTypes.func.isRequired,
    getLanguageByCode: PropTypes.func
};


export default TerritoryMetadataEditMode;