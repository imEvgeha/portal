import React, { Component, Fragment } from 'react';
import { Row, Col, Label, Container, Progress, Alert, FormGroup } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';

class TitleEditMode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            seasonChecked: false,
            episodeChecked: false,
            brandChecked: false,
            isBrandProdYearCompleted: false,
            isBrandCompleted: false,

            checkContentType: '',
        };
    }
    render() {
        const { title, contentType, productionStudioId, productionYear, boxOffice } = this.props.data;
        return (
            <Fragment>
                <Container fluid id="titleContainer" onKeyDown={this.props.keyPressed}>
                    <Row>
                        <Col xs="4">
                            <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="title" errorMessage="Please enter a valid title!" id="title" value={title || ''} placeholder="Enter Title" onChange={this.props.handleOnChangeEdit} validate={{
                                        required: { errorMessage: 'Field cannot be empty!' },
                                        maxLength: { value: 200 }
                                    }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label for="titleContentType">Content Type</Label>
                                    <Alert color="light" id="titleContentType"><b>{contentType}</b></Alert>
                                </Col>
                                <Col>
                                    <Label for="titleProductionStudio">Production Studio</Label>
                                    <AvField name="productionStudioId" errorMessage="Please enter a valid production studio!" id="titleProductionStudio" value={productionStudioId || ''} placeholder="Enter Studio" onChange={this.props.handleOnChangeEdit} />
                                </Col>
                            </Row>
                            {
                                contentType !== 'MOVIE' && contentType !== 'BRAND' ?
                                    <Fragment>
                                        <Row>
                                            <Col>
                                                <Label for="titleBrandName">Brand</Label>
                                                <AvField type="text" name="brandTitleName" id="titleBrandName" placeholder={'Enter Brand Name'} errorMessage="Field cannot be empty!"
                                                    onChange={this.props.handleChangeBrand} required={this.state.isBrandCompleted}
                                                />
                                            </Col>
                                            <Col>
                                                <Label for="titleBrandProductionYear">Brand Release Year</Label>
                                                <AvField name="brandProdYear" id="titleBrandProductionYear" required={this.state.isBrandProdYearCompleted} errorMessage="Please enter a valid year!" validate={{
                                                    required: { errorMessage: 'Field cannot be empty!' },
                                                    pattern: { value: '^[0-9]+$' },
                                                    minLength: { value: 4 },
                                                    maxLength: { value: 4 }
                                                }} placeholder="Enter Brand Release Year" onChange={this.props.handleChangeBrandProdYear} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="titleSeasonNumber">Season</Label>
                                                    <AvField
                                                        type="number"
                                                        name="seasonNumber"
                                                        errorMessage="Please enter a valid season number!"
                                                        value={this.props.data.episodic.seasonNumber ? this.props.data.episodic.seasonNumber : ''}
                                                        id="titleSeasonNumber"
                                                        placeholder={'Enter Season Number'}
                                                        onChange={(e) => this.props.handleChangeEpisodic(e)}
                                                        validate={{
                                                            maxLength: { value: 3 }
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <React.Fragment>
                                                {
                                                    contentType !== 'SEASON' ?
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <Label for="titleEpisodeNumber">Episode</Label>
                                                                <AvField
                                                                    type="number"
                                                                    name="episodeNumber"
                                                                    errorMessage="Please enter a valid episode number!"
                                                                    value={this.props.data.episodic.episodeNumber ? this.props.data.episodic.episodeNumber : ''}
                                                                    id="titleEpisodeNumber"
                                                                    placeholder={'Enter Episode Number'}
                                                                    onChange={(e) => this.props.handleChangeEpisodic(e)}
                                                                    validate={{
                                                                        maxLength: { value: 3 }
                                                                    }} />
                                                            </FormGroup>
                                                        </Col>
                                                        :
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <Label for="titleEpisodeCount">Episode Count</Label>
                                                                <AvField
                                                                    type="text"
                                                                    name="episodeCount"
                                                                    value={this.props.data.episodic.episodeCount ? this.props.data.episodic.episodeCount : ''}
                                                                    id="titleEpisodeCount"
                                                                    placeholder={'Enter Episode Count'}
                                                                    onChange={(e) => this.props.handleChangeEpisodic(e)} />
                                                            </FormGroup>
                                                        </Col>
                                                }
                                            </React.Fragment>
                                        </Row>
                                        <Row>
                                            {
                                                contentType === 'SEASON' ?
                                                    <Col>
                                                        <Label for="titleSeasonID">Season ID</Label>
                                                        <AvField
                                                            type="text"
                                                            name="seasonId"
                                                            value={this.props.data.episodic.seasonId ? this.props.data.episodic.seasonId : ''}
                                                            id="titleSeasonID" placeholder={'Enter Season ID'}
                                                            onChange={(e) => this.props.handleChangeEpisodic(e)} />
                                                    </Col>
                                                    :
                                                    <Col>
                                                        <Label for="titleEpisodeID">Episode ID</Label>
                                                        <AvField
                                                            type="text"
                                                            name="episodeId"
                                                            value={this.props.data.episodic.episodeId ? this.props.data.episodic.episodeId : ''}
                                                            id="titleEpisodeID"
                                                            placeholder={'Enter Episode ID'}
                                                            onChange={(e) => this.props.handleChangeEpisodic(e)} />
                                                    </Col>
                                            }
                                        </Row>
                                    </Fragment>
                                    :
                                    null
                            }
                            <Row style={{ marginTop: '15px' }}>
                                <Col>
                                    <Label for="titleProductionYear">Release Year<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField
                                        name="productionYear"
                                        errorMessage="Please enter a valid year!"
                                        id="titleProductionYear"
                                        validate={{
                                            required: { value: true, errorMessage: 'Field cannot be empty!' },
                                            pattern: { value: '^[0-9]+$' },
                                            minLength: { value: 4 },
                                            maxLength: { value: 4 }
                                        }}
                                        placeholder="Enter Release Year"
                                        value={productionYear}
                                        onChange={(e) => this.props.handleOnChangeEdit(e)} />
                                </Col>
                                <Col>
                                    <Label for="titleBoxOffice">Box Office</Label>
                                    <AvField
                                        name="boxOffice"
                                        id="titleBoxOffice"
                                        type="number"
                                        onChange={(e) => this.props.handleOnChangeEdit(e)}
                                        value={boxOffice || ''}
                                        placeholder="Enter Box Office"
                                        validate={{
                                            pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                        }}
                                    />
                                </Col>
                            </Row>
                            {
                                this.state.loading ?
                                    <Progress striped color="success" value="100">Updating...</Progress>
                                    : null
                            }
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

TitleEditMode.propTypes = {
    keyPressed: PropTypes.func,
    data: PropTypes.object,
    handleOnChangeEdit: PropTypes.func.isRequired,
    handleChangeBrandProdYear: PropTypes.func.isRequired,
    handleChangeBrand: PropTypes.func.isRequired,
    handleChangeEpisodic: PropTypes.func.isRequired
};

export default TitleEditMode;