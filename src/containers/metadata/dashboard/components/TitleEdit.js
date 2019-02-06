import React from 'react';
import { updateBreadcrumb } from '../../../../stores/actions/metadata/index';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import { BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH } from '../../../../constants/metadata-breadcrumb-paths';
import { Button, Row, Col, Label, Container, Progress, Alert } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { titleService } from '../../service/TitleService';
import { errorModal } from '../../../../components/modal/ErrorModal';
import './TitleEdit.scss';


class TitleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',

            isEditMode: false,
            isFailed: false,
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
                    seasonId: '',
                    seasonNumber: ''
                },
            }
        };
    }
    componentDidMount() {
        this.props.updateBreadcrumb([BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH]);
        const titleId = this.props.match.params.id;
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
                isEditMode: false,
                isLoading: false,
                titleForm: this.state.editedForm
            });
        }).catch((err) => {
            errorModal.open('Error', () => { }, { description: err.message, closable: true });
            console.error('Unable to load Title Data');
        });

    }
    handleEditMode = () => {
        this.setState({
            isEditMode: !this.state.isEditMode
        });
    }
    handleCancel = () => {
        this.setState({ isEditMode: !this.state.isEditMode });
    }

    readOnly = () => {
        const { title, contentType, productionStudioId, productionYear, boxOffice } = this.state.titleForm;
        const { seasonId, seasonNumber, episodeId, episodeNumber } = this.state.titleForm.episodic;
        return (
            <Container fluid id="titleContainer">
                <Row>
                    <Col className="clearfix"><Button className="float-right" onClick={this.handleEditMode}>Edit</Button></Col>
                </Row>
                <Row style={{ marginTop: '5px' }}>
                    <Col xs="4">
                        <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <Alert color="light" id="titleName"><h2><b>Title: </b>{title}</h2></Alert>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Alert color="light" id="titleContentType"><b>Content Type:</b> {contentType}</Alert>
                            </Col>
                            <Col>
                                <Alert color="light" id="titleProductionStudioId"><b>Production Studio: </b>{productionStudioId}</Alert>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Alert color="light" id="titleSeasonNumber"><b>Season Number: </b>{seasonNumber}</Alert>
                            </Col>

                            <Col>
                                <Alert color="light" id="titleEpisodeNumber"><b>Episode Number: </b>{episodeNumber}</Alert>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Alert color="light" id="titleSeasonId"><b>Season ID: </b>{seasonId}</Alert>
                            </Col>
                            <Col>
                                <Alert color="light" id="titleEpisodeId"><b>Episode ID: </b>{episodeId}</Alert>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Alert color="light" id="titleProductionYear"><b>Production Year: </b>{productionYear}</Alert>
                            </Col>
                            <Col>
                                <Alert color="light" id="titleBoxOffice"><b>Box Office: </b> ${boxOffice}</Alert>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    };

    editMode = () => {
        const { title, contentType, productionStudioId, productionYear, boxOffice } = this.state.titleForm;
        const { brandTitleName, brandProdYear, seasonId, seasonNumber, episodeId, episodeNumber } = this.state.titleForm.episodic;
        return (
            <AvForm id="titleDetail" onValidSubmit={this.onSave} ref={c => (this.form = c)} >
                <Container fluid id="titleContainer">
                    <Row>
                        <Col className="clearfix">
                            <Button className="float-right" id="btnSave" color="primary" onKeyPress={this._handleKeyPress}>Save</Button>
                            <Button className="float-right" id="btnCancel" onClick={this.handleCancel} outline color="danger" style={{ marginRight: '10px' }} onKeyPress={this._handleKeyPress}>Cancel</Button>
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
                                    <AvField name="title" errorMessage="Please enter a valid title!" id="title" value={title} placeholder="Enter Title" onChange={this.handleOnChange} validate={{
                                        required: { errorMessage: 'Field cannot be empty!' }
                                    }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label for="titleContentType">Content Type</Label>
                                    <Alert color="light" id="titleContentType"><b>{contentType}</b></Alert>
                                </Col>
                                <Col>
                                    <Label for="titleProductionStudio">Production Studio<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="productionStudioId" errorMessage="Please enter a valid production studio!" id="titleProductionStudio" value={productionStudioId} placeholder="Enter Studio" onChange={this.handleOnChange} validate={{
                                        required: { errorMessage: 'Field cannot be empty!' }
                                    }} />
                                </Col>
                            </Row>
                            {
                                !this.state.brandChecked ?
                                    <Row>
                                        <Col>
                                            <Label for="titleBrandName">Brand</Label>
                                            <AvField type="text" name="brandTitleName" value={brandTitleName} id="titleBrandName" placeholder={'Enter Brand Name'} errorMessage="Field cannot be empty!"
                                                onChange={this.handleChangeBrand} required={this.state.isBrandCompleted}
                                            />
                                        </Col>
                                        <Col>
                                            <Label for="titleBrandProductionYear">Brand Production Year</Label>
                                            <AvField name="brandProdYear" id="titleBrandProductionYear" required={this.state.isBrandProdYearCompleted} errorMessage="Please enter a valid year!" validate={{
                                                required: { errorMessage: 'Field cannot be empty!' },
                                                pattern: { value: '^[0-9]+$' },
                                                minLength: { value: 4 },
                                                maxLength: { value: 4 }
                                            }} placeholder="Enter Brand Production Year" value={brandProdYear} onChange={this.handleChangeBrandProdYear} />
                                        </Col>
                                    </Row>
                                    : null
                            }
                            {
                                !this.state.seasonChecked ?
                                    <Row>
                                        <Col>
                                            <Label for="titleSeasonNumber">Season</Label>
                                            <AvField type="text" name="seasonNumber" value={seasonNumber} id="titleSeasonNumber" placeholder={'Enter Season Number'}
                                                onChange={this.handleChangeEpisodic}
                                            />
                                        </Col>
                                        {
                                            !this.state.episodeChecked ?
                                                <Col>
                                                    <Label for="titleEpisodeNumber">Episode</Label>
                                                    <AvField type="text" name="episodeNumber" value={episodeNumber} id="titleEpisodeNumber" placeholder={'Enter Episode Number'} onChange={this.handleChangeEpisodic} />
                                                </Col>
                                                : null
                                        }
                                    </Row>
                                    : null
                            }
                            {
                                !this.state.seasonChecked ?
                                    <Row>
                                        <Col>
                                            <Label for="titleSeasonID">Season ID</Label>
                                            <AvField type="text" name="seasonId" value={seasonId} id="titleSeasonID" placeholder={'Enter Season ID'} onChange={this.handleChangeEpisodic} />
                                        </Col>
                                        {
                                            !this.state.episodeChecked ?
                                                <Col>
                                                    <Label for="titleEpisodeID">Episode ID</Label>
                                                    <AvField type="text" name="episodeId" value={episodeId} id="titleEpisodeID" placeholder={'Enter Episode ID'} onChange={this.handleChangeEpisodic} />
                                                </Col>
                                                : null
                                        }
                                    </Row>
                                    : null
                            }
                            <Row style={{ marginTop: '15px' }}>
                                <Col>
                                    <Label for="titleProductionYear">Production Year<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="productionYear" errorMessage="Please enter a valid year!" id="titleProductionYear" validate={{
                                        required: { value: true, errorMessage: 'Field cannot be empty!' },
                                        pattern: { value: '^[0-9]+$' },
                                        minLength: { value: 4 },
                                        maxLength: { value: 4 }
                                    }} placeholder="Enter Production Year" value={productionYear} onChange={this.handleOnChange} />
                                </Col>
                                <Col>
                                    <Label for="titleBoxOffice">Box Office</Label>
                                    <AvField name="boxOffice" id="titleBoxOffice" type="text" value={boxOffice} placeholder="Enter Box Office" validate={{
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
    };
    render() {
        return (
            this.state.isEditMode ? this.editMode() : this.readOnly()
        );
    }
}

let mapDispatchToProps = {
    updateBreadcrumb
};

TitleEdit.propTypes = {
    updateBreadcrumb: t.func,
    match: t.object.isRequired
};

export default connect(null, mapDispatchToProps)(TitleEdit);