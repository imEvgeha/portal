import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';

class TerritoryMetadataEditMode extends Component {
    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col md={4}>
                            <b>Locale: </b> {this.props.data.local ? this.props.data.local : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Theatrical Release Date</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="date" id="territoryTheatricalReleaseDate"
                                name="theatricalReleaseDate"
                                value={this.props.data.theatricalReleaseDate}
                                onChange={this.props.handleChange}
                                errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Home Video Release Date</b>
                        </Col>
                        <Col md={2}>

                            <AvField type="date" id="territoryHomeVideoReleaseDate"
                                name="homeVideoReleaseDate"
                                value={this.props.data.homeVideoReleaseDate}
                                onChange={this.props.handleChange}
                                errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Avail Announce Date</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="date" id="territoryAvailAnnounceDate"
                                name="availAnnounceDate"
                                value={this.props.data.availAnnounceDate}
                                onChange={this.props.handleChange}
                                errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Box Office</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="territoryBoxOffice" name="boxOffice" value={this.props.data.boxOffice} placeholder="Enter Box Office" onChange={this.props.handleChange}
                                validate={{
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                }} />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Release Year</b>
                        </Col>
                        <Col md={2}>
                            <AvField name="releaseYear" type="text" value={this.props.data.releaseYear} placeholder="Enter Release Year" onChange={this.props.handleChange}
                                validate={{
                                    date: { format: 'YYYY', errorMessage: 'Please enter a valid date!' },
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a valid date!' },
                                    maxLength: { value: 4 },
                                    minLength: { value: 4 }
                                }} />
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

TerritoryMetadataEditMode.propTypes = {
    data: PropTypes.object,
    handleChange: PropTypes.func.isRequired
};


export default TerritoryMetadataEditMode;