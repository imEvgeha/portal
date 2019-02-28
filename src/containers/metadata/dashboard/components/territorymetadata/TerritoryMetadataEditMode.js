import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import moment from 'moment';


const DATE_FORMAT = 'YYYY-MM-DD';

class TerritoryMetadataEditMode extends Component {

    getValidDate = (date) => {
        if(date) {
            return moment(date).format(DATE_FORMAT);
        }
        return date;
    };


    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Locale </b>
                        </Col>
                        <Col md={2}>
                            {this.props.data.locale ? <b>{this.props.data.locale}</b> : <span style={{ color: '#999' }}>Empty</span>}
                        </Col>
                    </Row>
                   <AvForm onValidSubmit={this.props.validSubmit}>
                       <Row style={{ padding: '15px' }}>
                           <Col md={2}>
                               <b>Theatrical Release Date</b>
                           </Col>
                           <Col md={2}>
                               <AvField type="date" id="territoryTheatricalReleaseDate"
                                        name="theatricalReleaseDate"
                                        value={this.getValidDate(this.props.data.theatricalReleaseDate)}
                                        onChange={this.props.handleChange}
                                        validate={{
                                            date: { format: DATE_FORMAT, errorMessage: 'Please enter a valid date!' },
                                        }}
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
                                        value={this.getValidDate(this.props.data.homeVideoReleaseDate)}
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
                                        value={this.getValidDate(this.props.data.availAnnounceDate)}
                                        onChange={this.props.handleChange}
                                        errorMessage="Please enter a valid date!" />
                           </Col>
                       </Row>
                       <Row style={{ padding: '15px' }}>
                           <Col md={2}>
                               <b>Box Office</b>
                           </Col>
                           <Col md={2}>
                               <AvField type="number" id="territoryBoxOffice" name="boxOffice" value={this.props.data.boxOffice} required={this.props.isLocalRequired} placeholder="Enter Box Office" onChange={this.props.handleChange}
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
                               <AvField name="releaseYear" type="number" value={this.props.data.releaseYear} required={this.props.isLocalRequired} placeholder="Enter Release Year" onChange={this.props.handleChange}
                                        validate={{
                                            pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a valid date!' },
                                            maxLength: { value: 4 }, minLength: { value: 4 }
                                        }} />
                           </Col>
                       </Row>
                   </AvForm>
                </Fragment>
            </div>
        );
    }
}

TerritoryMetadataEditMode.propTypes = {
    data: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    isLocalRequired: PropTypes.bool,
    validSubmit: PropTypes.func.isRequired,
};


export default TerritoryMetadataEditMode;