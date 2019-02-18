import React, { Component, Fragment } from 'react';
import { Button, Row, Col, Container, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { titleService } from '../../service/TitleService';
import { errorModal } from '../../../../components/modal/ErrorModal';

class TitleReadOnlyMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleForm: {
                title: '',
                contentType: '',
                productionYear: '',
                productionStudioId: '',
                boxOffice: '',
                episodic: {
                    brandProdYear: '',
                    brandTitleName: '',
                    episodeId: '',
                    episodeNumber: '',
                    seasonId: '',
                    seasonNumber: ''
                },
            }
        };
    }
    componentDidMount() {
        const titleId = this.props.titleId;
        titleService.getTitleById(titleId).then((response) => {
            const titleForm = response.data;
            this.setState({ titleForm, editedForm: titleForm });
        }).catch((err) => {
            errorModal.open('Error', () => { }, { description: err.message, closable: false });
            console.error('Unable to load Title Data');
        });
    }
    renderFields = (contentType) => {
        const { title, productionStudioId, productionYear, boxOffice } = this.state.titleForm;


        return (
            <Fragment>
                <Row>
                    <Col className="clearfix"><Button className="float-right" style={{ marginRight: '20px', marginBottom: '10px' }} onClick={this.props.handleSwitchMode}>Edit</Button></Col>
                </Row>
                <Container fluid id="titleContainer">
                    <Row style={{ marginTop: '5px' }}>
                        <Col xs="4">
                            <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleName"><h2><b>Title: </b>{title ? title : <span style={{color: '#999'}}>Empty</span>}</h2></Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleContentType"><b>Content Type:</b> {contentType ? contentType : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                </Col>
                                <Col>
                                    <Alert color="light" id="titleProductionStudioId"><b>Production Studio: </b>{productionStudioId ? productionStudioId : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                </Col>
                            </Row>
                            {
                                contentType !== 'MOVIE' && contentType !== 'BRAND' ?
                                    <Fragment>
                                        <Row>
                                            <Col md={6}>
                                                <Alert color="light" id="titleSeasonNumber"><b>Season Number: </b>{this.state.titleForm.episodic.seasonNumber ? this.state.titleForm.episodic.seasonNumber : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                            </Col>
                                            {
                                                contentType !== 'SEASON' ?
                                                    <Col md={6}>
                                                        <Alert color="light" id="titleEpisodeNumber"><b>Episode Number: </b>{this.state.titleForm.episodic.episodeNumber ? this.state.titleForm.episodic.episodeNumber : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                                    </Col>
                                                    :
                                                    <Col md={6}>
                                                        <Alert color="light" id="titleEpisodeCount"><b>Episode Count: </b>{this.state.titleForm.episodic.episodeCount ? this.state.titleForm.episodic.episodeCount : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                                    </Col>
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                contentType === 'SEASON' ?
                                                    <Col>
                                                        <Alert color="light" id="titleSeasonId"><b>Season ID: </b>{this.state.titleForm.episodic.seasonId ? this.state.titleForm.episodic.seasonId : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                                    </Col>
                                                    :
                                                    <Col>
                                                        <Alert color="light" id="titleEpisodeId"><b>Episode ID: </b>{this.state.titleForm.episodic.episodeId ? this.state.titleForm.episodic.episodeId : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                                    </Col>
                                            }
                                        </Row>
                                    </Fragment>
                                    :
                                    null
                            }
                            <Row>
                                <Col>
                                    <Alert color="light" id="titleProductionYear"><b>Release Year: </b>{productionYear ? productionYear : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                </Col>
                                <Col>
                                    <Alert color="light" id="titleBoxOffice"><b>Box Office: </b> {boxOffice ? '$' + boxOffice : <span style={{color: '#999'}}>Empty</span>}</Alert>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
    render() {
        const { contentType } = this.state.titleForm;
        if (!contentType) {
            return null;
        } else {
            return this.renderFields(contentType);
        }
    }
}

TitleReadOnlyMode.propTypes = {
    handleSwitchMode: PropTypes.func.isRequired,
    titleId: PropTypes.string.isRequired
};

export default TitleReadOnlyMode;