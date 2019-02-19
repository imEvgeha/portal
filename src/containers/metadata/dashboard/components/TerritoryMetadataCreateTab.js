import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';

class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            territories: [
                {
                    local: '',
                    theatricalReleaseYear: '',
                    homeVideoReleaseYear: '',
                    availAnnounceDate: '',
                    boxOffice: '',
                    releaseYear: ''
                }
            ]
        };
    }
    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                        <Row style={{ padding: '15px' }}>
                            <Col md={2}>
                                <b>Locale<span style={{ color: 'red' }}>*</span></b>
                            </Col>
                            <Col md={2}>
                                <AvField type="select"
                                                name="local"
                                                id="territoryLocal"
                                                required={this.props.isRequired}
                                                onChange={this.props.handleChange}
                                                errorMessage="Field cannot be empty!">
                                                <option value={''}>Select Locale</option>
                                                <option value="UK">UK</option>
                                                <option value="US">US</option>
                                                <option value="PL">PL</option>
                                            </AvField>
                                {/* <AvField type="text" id="territoryLocal" name="local" placeholder="Enter Locale" onChange={this.props.handleChange} required={this.props.isRequired} errorMessage="Field cannot be empty!"
                                    validate={{
                                        pattern: { value: '^[a-zA-Z]', errorMessage: 'Please enter a valid locale!' },
                                        maxLength: { value: 2 },
                                        minLength: { value: 2, errorMessage: 'Please enter a valid locale!' }
                                    }} /> */}
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col md={2}>
                                <b>Theatrical Release Year</b>
                            </Col>
                            <Col md={2}>
                                <AvField type="date" id="territoryTheatricalReleaseYear" name="theatricalReleaseYear" onChange={this.props.handleChange} validate={{ date: { format: 'MM/DD/YYYY', errorMessage: 'Please enter a valid date!' } }} errorMessage="Please enter a valid date!" />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col md={2}>
                                <b>Home Video Release Year</b>
                            </Col>
                            <Col md={2}>

                                <AvField type="date" id="territoryHomeVideoReleaseYear" name="homeVideoReleaseYear" onChange={this.props.handleChange} errorMessage="Please enter a valid date!"
                                    validate={{
                                        date: { format: 'MM/DD/YYYY', errorMessage: 'Please enter a valid date!' },
                                    }} />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col md={2}>
                                <b>Avail Announce Date</b>
                            </Col>
                            <Col md={2}>
                                <AvField type="date" id="territoryAvailAnnounceDate" name="availAnnounceDate" onChange={this.props.handleChange} validate={{ date: { format: 'MM/DD/YYYY' } }} errorMessage="Please enter a valid date!" />
                            </Col>
                        </Row>
                        <Row style={{ padding: '15px' }}>
                            <Col md={2}>
                                <b>Box Office</b>
                            </Col>
                            <Col md={2}>
                                <AvField type="text" id="territoryBoxOffice" name="boxOffice" placeholder="Enter Box Office" onChange={this.props.handleChange}
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
                                <AvField name="releaseYear" type="text" placeholder="Enter Release Year" onChange={this.props.handleChange}
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

TerritoryMetadataCreateTab.propTypes = {
    handleChange: PropTypes.func.isRequired,
    isRequired: PropTypes.bool.isRequired
}


export default TerritoryMetadataCreateTab;