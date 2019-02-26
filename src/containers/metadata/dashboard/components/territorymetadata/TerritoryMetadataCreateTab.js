import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';


class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            territories: {
                releaseYear: ''
            },
            activeTab: 0

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
                                name="locale"
                                id="territoryLocal"
                                required={this.props.isRequired}
                                onChange={this.props.handleChange}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select Locale</option>
                                <option value="GB">UK</option>
                                <option value="US">US</option>
                                <option value="PL">PL</option>
                                <option value="CN">CN</option>
                                <option value="HR">HR</option>
                                <option value="TW">TW</option>
                            </AvField>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Theatrical Release Date</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="date" id="territoryTheatricalReleaseDate"
                                name="theatricalReleaseDate"
                                onChange={this.props.handleChange}
                                errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Home Video Release Date</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="date" id="territoryHomeVideoReleaseDate" name="homeVideoReleaseDate"  onChange={this.props.handleChange} errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Avail Announce Date</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="date" id="territoryAvailAnnounceDate" name="availAnnounceDate"  onChange={this.props.handleChange} errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Box Office</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="number" id="territoryBoxOffice" name="boxOffice" placeholder="Enter Box Office" onChange={this.props.handleChange}
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
                            <AvField name="releaseYear" type="text" errorMessage="Please enter a valid year!" placeholder="Enter Release Year" onChange={this.props.handleChange}
                                validate={{
                                    date: { format: 'YYYY', errorMessage: 'Please enter a valid date!' },
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a valid date!' },
                                    maxLength: { value: 4 }, minLength: { value: 4 }
                                }}
                            />
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
};


export default TerritoryMetadataCreateTab;