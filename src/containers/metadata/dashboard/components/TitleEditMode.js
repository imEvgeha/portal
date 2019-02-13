import React, { Component, Fragment } from 'react';
import { Button, Row, Col, Label, Container, Progress, Alert, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { titleService } from '../../service/TitleService';
import { errorModal } from '../../../../components/modal/ErrorModal';

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
                    episodeCount: '',
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

    handleOnChange = (e) => {
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                [e.target.name]: e.target.value
            }
        });
    }

    handleChangeBrand = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            brandTitleName: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isBrandProdYearCompleted: true
            });
        } else {
            this.setState({
                isBrandProdYearCompleted: false
            });
        }
    }

    handleChangeBrandProdYear = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            brandProdYear: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isBrandCompleted: true
            });
        } else {
            this.setState({
                isBrandCompleted: false
            });
        }
    }

    handleChangeEpisodic = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            [e.target.name]: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
    }
    onSave = () => {
        const updatedTitle = this.state.editedForm;
        this.setState({
            isLoading: true
        });
        titleService.updateTitle(updatedTitle).then(() => {
            this.setState({
                isLoading: false,
                titleForm: this.state.editedForm
            });
            this.props.handleSwitchMode();
        }).catch((err) => {
            errorModal.open('Error', () => { }, { description: err.message, closable: true });
            console.error('Unable to load Title Data');
        });

    }
    render() {
        const { title, contentType, productionStudioId, productionYear, boxOffice } = this.state.titleForm;
        const { seasonId, seasonNumber, episodeId, episodeNumber, episodeCount } = this.state.titleForm.episodic;
        return (
            <AvForm id="titleDetail" onValidSubmit={this.onSave} ref={c => (this.form = c)}>
                <Container fluid id="titleContainer" onKeyDown={this.props.keyPressed}>
                    <Row>
                        <Col className="clearfix">
                            <Button className="float-right" id="btnSave" color="primary">Save</Button>
                            <Button className="float-right" id="btnCancel" onClick={this.props.handleSwitchMode} outline color="danger" style={{ marginRight: '10px' }}>Cancel</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4">
                            <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="title" errorMessage="Please enter a valid title!" id="title" value={title || ''} placeholder="Enter Title" onChange={this.handleOnChange} validate={{
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
                                    <AvField name="productionStudioId" errorMessage="Please enter a valid production studio!" id="titleProductionStudio" value={productionStudioId || ''} placeholder="Enter Studio" onChange={this.handleOnChange} />
                                </Col>
                            </Row>
                            {
                                contentType !== 'MOVIE' && contentType !== 'BRAND' ?
                                    <Fragment>
                                        <Row>
                                            <Col>
                                                <Label for="titleBrandName">Brand</Label>
                                                <AvField type="text" name="brandTitleName" id="titleBrandName" placeholder={'Enter Brand Name'} errorMessage="Field cannot be empty!"
                                                    onChange={this.handleChangeBrand} required={this.state.isBrandCompleted}
                                                />
                                            </Col>
                                            <Col>
                                                <Label for="titleBrandProductionYear">Brand Release Year</Label>
                                                <AvField name="brandProdYear" id="titleBrandProductionYear" required={this.state.isBrandProdYearCompleted} errorMessage="Please enter a valid year!" validate={{
                                                    required: { errorMessage: 'Field cannot be empty!' },
                                                    pattern: { value: '^[0-9]+$' },
                                                    minLength: { value: 4 },
                                                    maxLength: { value: 4 }
                                                }} placeholder="Enter Brand Release Year" onChange={this.handleChangeBrandProdYear} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col  md={6}>
                                                <FormGroup>
                                                    <Label for="titleSeasonNumber">Season</Label>
                                                    <AvField type="text" name="seasonNumber" value={seasonNumber || ''} id="titleSeasonNumber" placeholder={'Enter Season Number'}
                                                        onChange={this.handleChangeEpisodic}
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
                                                                <AvField type="text" name="episodeNumber" value={episodeNumber || ''} id="titleEpisodeNumber" placeholder={'Enter Episode Number'} onChange={this.handleChangeEpisodic} />
                                                            </FormGroup>
                                                        </Col>
                                                        : null
                                                }
                                                {
                                                    contentType === 'SEASON' ?
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <Label for="titleEpisodeCount">Episode Count</Label>
                                                                <AvField type="text" name="episodeCount" value={episodeCount || ''} id="titleEpisodeCount" placeholder={'Enter Episode Count'} onChange={this.handleChangeEpisodic} />
                                                            </FormGroup>
                                                        </Col> : null
                                                }
                                            </React.Fragment>
                                        </Row>
                                        <Row>
                                            {
                                                contentType === 'SEASON' ?
                                                    <Col>
                                                        <Label for="titleSeasonID">Season ID</Label>
                                                        <AvField type="text" name="seasonId" value={seasonId || ''} id="titleSeasonID" placeholder={'Enter Season ID'} onChange={this.handleChangeEpisodic} />
                                                    </Col>
                                                    : null
                                            }
                                            {
                                                contentType !== 'SEASON' ?

                                                    <Col>
                                                        <Label for="titleEpisodeID">Episode ID</Label>
                                                        <AvField type="text" name="episodeId" value={episodeId || ''} id="titleEpisodeID" placeholder={'Enter Episode ID'} onChange={this.handleChangeEpisodic} />
                                                    </Col>
                                                    : null
                                            }
                                        </Row>
                                    </Fragment>
                                    :
                                    null
                            }
                            <Row style={{ marginTop: '15px' }}>
                                <Col>
                                    <Label for="titleProductionYear">Release Year<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="productionYear" errorMessage="Please enter a valid year!" id="titleProductionYear" validate={{
                                        required: { value: true, errorMessage: 'Field cannot be empty!' },
                                        pattern: { value: '^[0-9]+$' },
                                        minLength: { value: 4 },
                                        maxLength: { value: 4 }
                                    }} placeholder="Enter Release Year" value={productionYear} onChange={this.handleOnChange} />
                                </Col>
                                <Col>
                                    <Label for="titleBoxOffice">Box Office</Label>
                                    <AvField name="boxOffice" id="titleBoxOffice" type="text" value={boxOffice || ''} placeholder="Enter Box Office" validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                    }} onChange={this.handleOnChange} />
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
            </AvForm>
        );
    }
}

TitleEditMode.propTypes = {
    handleSwitchMode: PropTypes.func.isRequired,
    titleId: PropTypes.string.isRequired,
    keyPressed: PropTypes.func
};

export default TitleEditMode;