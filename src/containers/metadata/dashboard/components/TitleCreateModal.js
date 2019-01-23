import React from 'react';
import { ModalFooter, ModalHeader, Modal, Button, Input, ModalBody, Alert, Row, Col, Label, Container, Progress } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import '../Title.scss';
import { dashboardService } from './DashboardService';

class TitleCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            title: '',
            contentType: '',
            productionYear: '',
            productionStudioId: '',
            brandTitleName: '',
            boxOffice: '',
            brandProdYear: '',
            seasonNumber: '',
            episodeNumber: '',
            seasonId: '',
            episodeId: '',

            isFailed: false,
            loading: false,
            seasonChecked: true,
            episodeChecked: true,
            brandChecked: true
        };
    }

    toggle = () => {
        this.cleanFields();
        this.props.toggle();
        this.setState({
            errorMessage: '',
            seasonChecked: true,
            episodeChecked: true,
            brandChecked: true,
        });
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    onSubmit = () => {
        const { title, contentType, boxOffice, productionYear, brandProdYear, productionStudioId, brandTitleName, seasonId, seasonNumber, episodeId, episodeNumber } = this.state;
        const episodic = {
            brandProdYear,
            brandTitleName,
            episodeId,
            episodeNumber,
            seasonId,
            seasonNumber
        };
        const newTitle = {
            boxOffice: boxOffice ? parseInt(boxOffice) : '',
            contentType,
            episodic,
            productionStudioId,
            productionYear,
            title
        };
        this.setState({ loading: true, errorMessage: '' });
        dashboardService.createTitle(newTitle).then((res) => {
            if (res.status === 200) {
                this.form && this.form.reset();
                this.cleanFields();
                this.setState({ loading: false, errorMessage: 'Title created successfully.', isFailed: false });
            } else if(res.status === 400) {
                this.setState({ loading: false, errorMessage: `Error: ${res.data.description}`, isFailed: true });
            } else {
                this.setState({ loading: false, errorMessage: 'Title creation failed!', isFailed: true });
            }
        }).catch(() => {
            this.setState({ loading: false, errorMessage: 'Title creation failed!', isFailed: true });
        });
    }
    cleanFields = () => {
        this.setState({
            errorMessage: '',
            title: '',
            contentType: '',
            productionYear: '',
            productionStudioId: '',
            brandTitleName: '',
            boxOffice: '',
            brandProdYear: '',
            seasonNumber: '',
            episodeNumber: '',
            seasonId: '',
            episodeId: '',

            seasonChecked: true,
            episodeChecked: true,
            brandChecked: true,
            loading: false,
            isFailed: false
        });
    }
    handleSelect = (e) => {
        this.setState({
            contentType: e.target.value
        });
        if (e.target.value === 'Season') {
            this.setState({
                seasonChecked: false,
                episodeChecked: true,
                brandChecked: false,
                episodeId: '',
                episodeNumber: ''
            });
        } else if (e.target.value === 'Episode') {
            this.setState({
                seasonChecked: false,
                episodeChecked: false,
                brandChecked: false
            });
        } else if (e.target.value === 'Brand') {
            this.setState({
                seasonChecked: true,
                episodeChecked: true,
                brandChecked: true,
                episodeId: '',
                episodeNumber: '',
                seasonId: '',
                seasonNumber: ''

            });
        } else if (e.target.value === 'Event') {
            this.setState({
                seasonChecked: false,
                episodeChecked: false,
                brandChecked: false
            });
        } else {
            this.setState({
                seasonChecked: true,
                episodeChecked: true,
                brandChecked: true,
                brandTitleName: '',
                brandProdYear: '',
                episodeId: '',
                episodeNumber: '',
                seasonId: '',
                seasonNumber: ''

            });
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.display} toggle={this.toggle} id="titleModalBox" className={this.props.className + ' lgModal'} size="lg" fade={false} backdrop={true}>
                <AvForm onValidSubmit={this.onSubmit} id="titleCreateForm" ref={c => (this.form = c)}>
                    <ModalHeader toggle={this.props.toggle}>Create Title</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="4">
                                <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                            </Col>
                            <Col>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                                            <AvField name="title" errorMessage="Field can not be empty!" id="title" value={this.state.title} required placeholder="Enter Title" onChange={this.handleChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Label for="contentType">Content Type<span style={{ color: 'red' }}>*</span></Label>
                                            <AvField type="select"
                                                name="cont"
                                                required
                                                value={this.state.contentType}
                                                onChange={this.handleSelect}
                                                errorMessage="Field can not be empty!">
                                                <option value={''}>Select Content Type</option>
                                                <option value="Movie">Movie</option>
                                                <option value="Brand">Brand</option>
                                                <option value="Episode">Episode</option>
                                                <option value="Season">Season</option>
                                                <option value="Event">Event</option>
                                            </AvField>
                                        </Col>
                                        <Col>
                                            <Label for="titleProductionStudio">Production Studio<span style={{ color: 'red' }}>*</span></Label>
                                            <AvField name="productionStudioId" errorMessage="Field can not be empty!" id="titleProductionStudio" value={this.state.productionStudioId} required placeholder="Enter Studio" onChange={this.handleChange} />
                                        </Col>
                                    </Row>
                                    {
                                        !this.state.brandChecked ?
                                            <Row>
                                                <Col>
                                                    <Label for="titleBrandName">Brand <span style={{ color: 'red' }}>*</span></Label>
                                                    <AvField type="text" name="brandTitleName" disabled={this.state.brandChecked} value={this.state.brandTitleName} id="titleBrandName" placeholder={'Enter Brand Name'} errorMessage="Field can not be empty!" onChange={this.handleChange}
                                                        required
                                                    />
                                                </Col>
                                                <Col>
                                                    <Label for="titleBrandProductionYear">Brand Production Year <span style={{ color: 'red' }}>*</span></Label>
                                                    <AvField name="brandProdYear" id="titleBrandProductionYear" errorMessage="Please enter a valid year!" validate={{
                                                        required: { errorMessage: 'Field cannot be empty!' },
                                                        pattern: { value: '^[0-9]+$' },
                                                        minLength: { value: 4 },
                                                        maxLength: { value: 4 }
                                                    }} placeholder="Enter Brand Production Year" disabled={this.state.brandChecked} value={this.state.brandProdYear} onChange={this.handleChange} />
                                                </Col>
                                            </Row>
                                            : null
                                    }
                                    {
                                        !this.state.seasonChecked ?
                                            <Row>
                                                <Col>
                                                    <Label for="titleSeasonNumber">Season <span style={{ color: 'red' }}>*</span></Label>
                                                    <AvField type="text" name="seasonNumber" disabled={this.state.seasonChecked} value={this.state.seasonNumber} id="titleSeasonNumber" placeholder={'Enter Season Number'} errorMessage="Field can not be empty!" onChange={this.handleChange}
                                                        required
                                                    />
                                                </Col>
                                                {
                                                    !this.state.episodeChecked ?
                                                        <Col>
                                                            <Label for="titleEpisodeNumber">Episode</Label>
                                                            <Input type="text" name="episodeNumber" value={this.state.episodeNumber} disabled={this.state.episodeChecked} id="titleEpisodeNumber" placeholder={'Enter Episode Number'} onChange={this.handleChange} />
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
                                                    <Input type="text" name="seasonId" value={this.state.seasonId} disabled={this.state.seasonChecked} id="titleSeasonID" placeholder={'Enter Season ID'} onChange={this.handleChange} />
                                                </Col>
                                                {
                                                    !this.state.episodeChecked ?
                                                        <Col>
                                                            <Label for="titleEpisodeID">Episode ID</Label>
                                                            <Input type="text" name="episodeId" value={this.state.episodeId} disabled={this.state.episodeChecked} id="titleEpisodeID" placeholder={'Enter Episode ID'} onChange={this.handleChange} />
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
                                            }} placeholder="Enter Production Year" value={this.state.productionYear} onChange={this.handleChange} />
                                        </Col>
                                        <Col>
                                            <Label for="titleBoxOffice">Box Office</Label>
                                            <AvField name="boxOffice" id="titleBoxOffice" type="text" onChange={this.handleChange} value={this.state.boxOffice} placeholder="Enter Box Office" validate={{
                                                pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                            }} />
                                        </Col>
                                    </Row>
                                    {
                                        this.state.loading ?
                                            <Progress striped color="success" value="100">Creating...</Progress>
                                            : null
                                    }
                                </Container>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {

                            this.state.errorMessage &&
                            <div className="nx-stylish list-group">
                                <h5 style={{ marginTop: '25px' }}><Alert color={this.state.isFailed ? 'danger' : 'success'}>{this.state.errorMessage}</Alert></h5>
                            </div>
                        }

                        <Button id="titleCancelBtn" onClick={this.toggle} color="primary">Cancel</Button>
                        <Button id="titleSaveBtn" color="primary">Save</Button>
                    </ModalFooter>

                </AvForm>
            </Modal >
        );
    }
}

TitleCreate.propTypes = {
    toggle: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    className: PropTypes.string
};

export default TitleCreate;