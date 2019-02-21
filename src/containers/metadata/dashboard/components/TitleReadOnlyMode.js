import React, { Component, Fragment } from 'react';
import { Row, Col, Container, Alert } from 'reactstrap';
import PropTypes from 'prop-types';

class TitleReadOnlyMode extends Component {
    constructor(props) {
        super(props);
    }
    renderFields = (contentType) => {
        const { title, productionStudioId, productionYear, boxOffice } = this.props.data;
        return (
            <Fragment>
                <Container fluid id="titleContainer">
                    <Row style={{ marginTop: '5px' }}>
                        <Col xs="4">
                            <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleName"><h2><b>Title: </b>{title ? title : <span style={{ color: '#999' }}>Empty</span>}</h2></Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleContentType"><b>Content Type:</b> {contentType ? contentType : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                </Col>
                                <Col>
                                    <Alert color="light" id="titleProductionStudioId"><b>Production Studio: </b>{productionStudioId ? productionStudioId : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                </Col>
                            </Row>
                            {
                                contentType !== 'MOVIE' && contentType !== 'BRAND' ?
                                    <Fragment>
                                        <Row>
                                            <Col md={6}>
                                                <Alert color="light" id="titleSeasonNumber"><b>Season Number: </b>{this.props.data.episodic.seasonNumber ? this.props.data.episodic.seasonNumber : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                            </Col>
                                            {
                                                contentType !== 'SEASON' ?
                                                    <Col md={6}>
                                                        <Alert color="light" id="titleEpisodeNumber"><b>Episode Number: </b>{this.props.data.episodic.episodeNumber ? this.props.data.episodic.episodeNumber : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                                    </Col>
                                                    :
                                                    <Col md={6}>
                                                        <Alert color="light" id="titleEpisodeCount"><b>Episode Count: </b>{this.props.data.episodic.episodeCount ? this.props.data.episodic.episodeCount : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                                    </Col>
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                contentType === 'SEASON' ?
                                                    <Col>
                                                        <Alert color="light" id="titleSeasonId"><b>Season ID: </b>{this.props.data.episodic.seasonId ? this.props.data.episodic.seasonId : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                                    </Col>
                                                    :
                                                    <Col>
                                                        <Alert color="light" id="titleEpisodeId"><b>Episode ID: </b>{this.props.data.episodic.episodeId ? this.data.props.episodic.episodeId : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                                    </Col>
                                            }
                                        </Row>
                                    </Fragment>
                                    :
                                    null
                            }
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleProductionYear"><b>Release Year: </b>{productionYear ? productionYear : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                </Col>
                                <Col>
                                    <Alert color="light" id="titleBoxOffice"><b>Box Office: </b> {boxOffice ? '$' + boxOffice : <span style={{ color: '#999' }}>Empty</span>}</Alert>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
    render() {
        if (this.props.data) {
            const { contentType } = this.props.data;
            if (!contentType) {
                return null;
            } else {
                return this.renderFields(contentType);
            }
        } else {
            return null;
        }
    }
}

TitleReadOnlyMode.propTypes = {
    data: PropTypes.object
};

export default TitleReadOnlyMode;