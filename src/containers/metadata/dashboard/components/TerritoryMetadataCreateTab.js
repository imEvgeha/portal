import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button } from 'reactstrap';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import {
    addTerritoryMetadata,
} from '../../../../stores/actions/metadata/index';

class TerritoryMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            territories: []
        };
    }

    addMetadata = () => {
        this.props.addTerritoryMetadata(this.state.territories);
        this.form && this.form.reset();
    }

    handleChange = (e) => {
        this.setState({
            territories: {
                ...this.state.territories,
                [e.target.name]: e.target.value
            }
        });
    }
    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                <AvForm onValidSubmit={this.addMetadata} ref={c => (this.form = c)}>
                    <Button>Save</Button>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Locale<span style={{ color: 'red' }}>*</span></b>
                        </Col>
                        <Col md={2}>                        
                            <AvField type="text" id="territoryLocal" name="local" placeholder="Enter Locale" value={this.state.territories.local} onChange={this.handleChange} required errorMessage="Field cannot be empty!"
                            validate={{
                                pattern: { value: '^[a-zA-Z]', errorMessage: 'Please enter a valid locale!' },
                                maxLength: { value: 2 },
                                minLength: { value: 2, errorMessage: 'Please enter a valid locale!' }
                            }} />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Theatrical Release Year</b>
                        </Col>
                        <Col md={2}>                        
                            <AvField type="date" id="territoryTheatricalReleaseYear" value={this.state.territories.theatricalReleaseYear} name="theatricalReleaseYear" onChange={this.handleChange} validate={{date: {format: 'MM/DD/YYYY', errorMessage: 'Please enter a valid date!'}}} errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Home Video Release Year</b>
                        </Col>
                        <Col md={2}>                        
                            <AvField type="date" id="territoryHomeVideoReleaseYear" value={this.state.territories.homeVideoReleaseYear} name="homeVideoReleaseYear" onChange={this.handleChange} errorMessage="Please enter a valid date!"
                            validate={{
                                date: {format: 'MM/DD/YYYY', errorMessage: 'Please enter a valid date!'},
                            }} />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Avail Announce Date</b>
                        </Col>
                        <Col md={2}>                        
                            <AvField type="date" id="territoryAvailAnnounceDate" value={this.state.territories.availAnnounceDate} name="availAnnounceDate" onChange={this.handleChange} validate={{date: {format: 'MM/DD/YYYY'}}} errorMessage="Please enter a valid date!" />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Box Office</b>
                        </Col>
                        <Col md={2}>                        
                            <AvField type="text" id="territoryBoxOffice" value={this.state.territories.boxOffice} name="boxOffice" placeholder="Enter Box Office" onChange={this.handleChange}
                            validate={{
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                            }} />
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Release Year</b>
                        </Col>
                        <Col md={2}>                        
                            <AvField name="releaseYear" type="text" value={this.state.territories.releaseYear}  placeholder="Enter Release Year" onChange={this.handleChange}
                                validate={{
                                    date: {format: 'YYYY', errorMessage: 'Please enter a valid date!'},
                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a valid date!' },
                            }} />
                        </Col>
                    </Row>
                    </AvForm>
                </Fragment>
            </div>
        );
    }
}

TerritoryMetadataCreateTab.propTypes = {
    addTerritoryMetadata: PropTypes.func
};

const mapDispatchToProps = {
    addTerritoryMetadata
};


export default connect(null, mapDispatchToProps)(TerritoryMetadataCreateTab);