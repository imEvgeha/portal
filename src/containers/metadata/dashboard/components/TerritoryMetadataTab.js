import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

class TerritoryMetadataTab extends Component {
    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Locale: </b> {this.props.data.local ? this.props.data.local : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                           <b>Theatrical Release Year: </b> {this.props.data.theatricalReleaseYear ? this.props.data.theatricalReleaseYear : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Home Video Release Year: </b> {this.props.data.homeVideoReleaseYear ? this.props.data.homeVideoReleaseYear : <span style={{color: '#999'}}>Empty</span>}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Avail Announce Date: </b> {this.props.data.availAnnounceDate ? this.props.data.availAnnounceDate : <span style={{color: '#999'}}>Empty</span>}
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