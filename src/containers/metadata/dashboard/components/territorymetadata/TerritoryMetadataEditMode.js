import React, {Component} from 'react';
import {Row, Col, Container} from 'reactstrap';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import moment from 'moment';
import NexusDatePicker from '../../../../../ui-elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {DATE_FORMAT, COUNTRY} from '../../../../../constants/metadata/constant-variables';

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
                                <span>Locale</span><br />
                                {this.props.data.locale ? <b>{this.props.getLanguageByCode(this.props.data.locale, COUNTRY)}</b> : <span style={{ color: '#999' }}>Empty</span>}
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
                                <NexusDatePicker
                                    label="Original Air Date"
                                    id="territoryOriginalAirDate"
                                    value={this.getValidDate(this.props.data.originalAirDate)}
                                    onChange={date => this.props.handleChangeDate('originalAirDate', 'territoryOriginalAirDate', date, this.props.data)}
                                    isTimestamp={false}
                                />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <NexusDatePicker
                                    label="Home Video Release Date"
                                    id="territoryHomeVideoReleaseDate"
                                    value={this.getValidDate(this.props.data.originalAirDate)}
                                    onChange={date => this.props.handleChangeDate('homeVideoReleaseDate', 'territoryHomeVideoReleaseDate', date, this.props.data)}
                                    isTimestamp={false}
                                />
                            </Col>
                            <Col>
                                <NexusDatePicker
                                    label="Avail Announce Date"
                                    id="territoryAvailAnnounceDate"
                                    value={this.getValidDate(this.props.data.originalAirDate)}
                                    onChange={date => this.props.handleChangeDate('availAnnounceDate', 'territoryAvailAnnounceDate', date, this.props.data)}
                                    isTimestamp={false}
                                />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col>
                                <NexusDatePicker
                                    label="Theatrical Release Date"
                                    id="territoryTheatricalReleaseDate"
                                    value={this.getValidDate(this.props.data.originalAirDate)}
                                    onChange={date => this.props.handleChangeDate('theatricalReleaseDate', 'territoryTheatricalReleaseDate', date, this.props.data)}
                                    isTimestamp={false}
                                />
                            </Col>
                            <Col>
                                <NexusDatePicker
                                    label="EST Release Date"
                                    id="territoryESTReleaseDate"
                                    value={this.getValidDate(this.props.data.originalAirDate)}
                                    onChange={date => this.props.handleChangeDate('estReleaseDate', 'territoryESTReleaseDate', date, this.props.data)}
                                    isTimestamp={false}
                                />
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
    handleChangeDate: PropTypes.func.isRequired,
    validSubmit: PropTypes.func.isRequired,
    getLanguageByCode: PropTypes.func
};


export default TerritoryMetadataEditMode;