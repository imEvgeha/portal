import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

class TerritoryMetadataTab extends Component {
    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Locale: </b> {this.props.data.locale ? this.props.data.locale : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                           <b>Theatrical Release Date: </b> {this.props.data.theatricalReleaseDate ? moment(this.props.data.theatricalReleaseDate).format('YYYY-MM-DD') : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Home Video Release Date: </b> {this.props.data.homeVideoReleaseDate ? moment(this.props.data.homeVideoReleaseDate).format('YYYY-MM-DD') : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Avail Announce Date: </b> {this.props.data.availAnnounceDate ? moment(this.props.data.availAnnounceDate).format('YYYY-MM-DD') : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Box Office: </b> {this.props.data.boxOffice ? this.props.data.boxOffice : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Release Year: </b> {this.props.data.releaseYear ? this.props.data.releaseYear : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

TerritoryMetadataTab.propTypes = {
    data: PropTypes.object
};


export default TerritoryMetadataTab;