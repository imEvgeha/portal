import React, { Component, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
class TerritoryMetadataTab extends Component {
    render() {
        return (
            <div id="territoryContainer">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Locale: </b> {this.props.data.local}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                           <b>Theatrical Release Year: </b> {this.props.data.theatricalReleaseYear}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Home Video Release Year: </b> {this.props.data.homeVideoReleaseYear}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Avail Announce Date: </b> {this.props.data.availAnnounceDate}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Box Office: </b> {this.props.data.boxOffice}
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={4}>
                            <b>Release Year: </b> {this.props.data.releaseYear}
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

export default TerritoryMetadataTab;