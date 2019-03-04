import React from 'react';
import { ModalFooter, ModalHeader, Modal, Button, ModalBody, Alert, Row, Col, Label, Container, Progress, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import '../Title.scss';
import { titleService } from '../../service/TitleService';
import connect from 'react-redux/es/connect/connect';

class TitleCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',

            isFailed: false,
            loading: false,
            seasonChecked: true,
            episodeChecked: true,
            brandChecked: true,

            isBrandCompleted: false,
            isBrandYearCompleted: false,
            isReleaseYearRequired: true,
            isSeasonNumberRequired: false,
            isEpisodeNumberRequired: false,

            titleForm: {
                title: '',
                contentType: '',
                releaseYear: '',
                productionStudioId: '',
                boxOffice: '',
                episodic: {
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

    toggle = () => {
        this.cleanFields();
        this.props.toggle();
        this.setState({
            errorMessage: '',
            seasonChecked: true,
            episodeChecked: true,
            brandChecked: true,
            isReleaseYearRequired: true,
            isBrandCompleted: false,
            isBrandYearCompleted: false,
        });
    }
    handleChange = (e) => {
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                [e.target.name]: e.target.value
            }
        });
    }

    handleChangeEpisodic = (e) => {
        const newEpisodic = {
            ...this.state.titleForm.episodic,
            [e.target.name]: e.target.value
        };
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                episodic: newEpisodic
            }
        });
    }

    handleChangeSeasonNumber = (e) => {
        const newEpisodic = {
            ...this.state.titleForm.episodic,
            seasonNumber: e.target.value
        };
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                episodic: newEpisodic
            }
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isBrandYearCompleted: true,
                isBrandCompleted: true
            });
        } else {
            this.setState({
                isBrandYearCompleted: false,
                isBrandCompleted: false
            });
        }
    }

    onSubmit = () => {
        this.setState({ loading: true, errorMessage: '' });
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                boxOffice: this.state.titleForm.boxOffice ? parseInt(this.state.titleForm.boxOffice) : ''
            }
        });

        let title = this.getTitleWithoutEmptyField();
        titleService.createTitle(title).then(() => {
            this.form && this.form.reset();
            this.cleanFields();
            this.setState({ loading: false, errorMessage: 'Title created successfully.', isFailed: false });
            
            setTimeout(() => {
                this.toggle();
            }, 2000);
        }).catch(() => {
            this.setState({ loading: false, errorMessage: 'Title creation failed!', isFailed: true });
        });

    }

    getTitleWithoutEmptyField() {
        let title = {};
        for(let titleField in this.state.titleForm) {
            if(titleField === 'episodic') {
                title[titleField] = this.getEpisodicWithoutEmptyFields();
            }
            else if(this.state.titleForm[titleField]) {
                title[titleField] = this.state.titleForm[titleField];
            } else {
                title[titleField] = null;
            }
        }

        return title;
    }

    getEpisodicWithoutEmptyFields() {
        let episodic = {};
        let doAddEpisodic = false;
        for(let episodicField in this.state.titleForm.episodic) {
            if(this.state.titleForm.episodic[episodicField]) {
                episodic[episodicField] = this.state.titleForm.episodic[episodicField];
                doAddEpisodic = true;
            } else {
                episodic[episodicField] = null;
            }
        }

        return doAddEpisodic ? episodic : null;
    }

    cleanFields = () => {
        this.setState({
            titleForm: {
                title: '',
                contentType: '',
                releaseYear: '',
                productionStudioId: '',
                boxOffice: '',
                episodic: {
                    brandTitleName: '',
                    episodeId: '',
                    episodeNumber: '',
                    episodeCount: '',
                    seasonId: '',
                    seasonNumber: ''
                },
            },
            seasonChecked: true,
            episodeChecked: true,
            brandChecked: true,
            loading: false,
            isFailed: false,
            isReleaseYearRequired: true,
            isBrandCompleted: false,
            isBrandYearCompleted: false,
            isEpisodeNumberRequired: false,
        });
    }
    handleChangeBrand = (e) => {
        const newEpisodic = {
            ...this.state.titleForm.episodic,
            brandTitleName: e.target.value
        };
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                episodic: newEpisodic
            }
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isBrandYearCompleted: true,
                isSeasonNumberRequired: true,
            });
        } else {
            this.setState({
                isBrandYearCompleted: false,
                isSeasonNumberRequired: false
            });
        }
    }
    handleSelect = (e) => {
        if (e.target.value === 'Season') {
            this.setState({
                seasonChecked: false,
                episodeChecked: true,
                brandChecked: false,
                isReleaseYearRequired: false,
                isBrandCompleted: true,
                isBrandYearCompleted: true,
                isSeasonNumberRequired: true,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                    episodic: {
                        ...this.state.titleForm.episodic,
                        episodeId: '',
                        episodeNumber: '',
                        episodeCount: '',
                    }
                }
            });
        } else if (e.target.value === 'Episode') {
            this.setState({
                seasonChecked: false,
                episodeChecked: false,
                brandChecked: false,
                isReleaseYearRequired: true,
                isBrandCompleted: true,
                isBrandYearCompleted: true,
                isEpisodeNumberRequired: true,
                isSeasonNumberRequired: true,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value
                }
            });
        } else if (e.target.value === 'Brand') {
            this.setState({
                seasonChecked: true,
                episodeChecked: true,
                brandChecked: true,
                isReleaseYearRequired: false,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                    episodic: {
                        ...this.state.titleForm.episodic,
                        seasonNumber: '',
                        episodeId: '',
                        episodeNumber: '',
                        episodeCount: '',
                        seasonId: '',
                    }
                }

            });
        } else if (e.target.value === 'Event' || e.target.value === 'Sports') {
            this.setState({
                seasonChecked: false,
                episodeChecked: false,
                brandChecked: false,
                isReleaseYearRequired: true,
                isEpisodeNumberRequired: false,
                isSeasonNumberRequired: false,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value
                }
            });
        } else {
            this.setState({
                seasonChecked: true,
                episodeChecked: true,
                brandChecked: true,
                isReleaseYearRequired: true,
                isBrandCompleted: true,
                isBrandYearCompleted: true,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                    episodic: {
                        brandTitleName: '',
                        episodeId: '',
                        episodeNumber: '',
                        episodeCount: '',
                        seasonId: '',
                        seasonNumber: '',
                    }
                }
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
                                            <AvField name="title" errorMessage="Please enter a valid title!" id="title" value={this.state.titleForm.title} placeholder="Enter Title" onChange={this.handleChange} validate={{
                                                required: { errorMessage: 'Field cannot be empty!' },
                                                maxLength: { value: 200 }
                                            }} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Label for="contentType">Content Type<span style={{ color: 'red' }}>*</span></Label>
                                            <AvField type="select"
                                                name="contentType"
                                                required
                                                value={this.state.titleForm.contentType}
                                                onChange={this.handleSelect}
                                                errorMessage="Field cannot be empty!">
                                                <option value={''}>Select Content Type</option>
                                                <option value="Movie">Movie</option>
                                                <option value="Brand">Brand</option>
                                                <option value="Episode">Episode</option>
                                                <option value="Season">Season</option>
                                                <option value="Event">Event</option>
                                                <option value="Sports">Sports</option>
                                            </AvField>
                                        </Col>
                                        <Col>
                                            <Label for="titleProductionStudio">Production Studio</Label>
                                            <AvField name="productionStudioId" errorMessage="Please enter a valid production studio!" id="titleProductionStudio" value={this.state.titleForm.productionStudioId} placeholder="Enter Studio" onChange={this.handleChange} />
                                        </Col>
                                    </Row>
                                    {
                                        !this.state.brandChecked ?
                                            <Row>
                                                <Col>
                                                    <Label for="titleBrandName">Brand {this.state.isBrandYearCompleted || this.state.isBrandCompleted ? <span style={{ color: 'red' }}>*</span> : null}</Label>
                                                    <AvField type="text" name="brandTitleName" disabled={this.state.brandChecked} value={this.state.titleForm.episodic.brandTitleName} id="titleBrandName" placeholder={'Enter Brand Name'} errorMessage="Field cannot be empty!"
                                                        onChange={this.handleChangeBrand} required={this.state.isBrandCompleted}
                                                    />
                                                </Col>
                                            </Row>
                                            : null
                                    }
                                    {
                                        !this.state.seasonChecked ?
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="titleSeasonNumber">Season{this.state.isSeasonNumberRequired ? <span style={{ color: 'red' }}>*</span> : null}</Label>
                                                        <AvField type="number" name="seasonNumber" disabled={this.state.seasonChecked} value={this.state.titleForm.episodic.seasonNumber} id="titleSeasonNumber" placeholder={'Enter Season Number'} errorMessage="Please enter a valid season number!" onChange={this.handleChangeSeasonNumber}
                                                            validate={{
                                                                maxLength: { value: 3 },
                                                                required: { value: this.state.isSeasonNumberRequired, errorMessage: 'Field cannot be empty!'}
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                {
                                                    !this.state.episodeChecked ?
                                                        <React.Fragment>
                                                            <Col md={3}>
                                                                <FormGroup>
                                                                    <Label for="titleEpisodeNumber">Episode{this.state.isEpisodeNumberRequired ? <span style={{ color: 'red' }}>*</span> : null}</Label>
                                                                    <AvField type="number" name="episodeNumber" value={this.state.titleForm.episodic.episodeNumber} disabled={this.state.episodeChecked} id="titleEpisodeNumber" errorMessage="Please enter a valid episode number!" placeholder={'Enter Episode Number'} onChange={this.handleChangeEpisodic} 
                                                                    validate={{
                                                                        maxLength: { value: 3 },
                                                                        required: { value: this.state.isEpisodeNumberRequired, errorMessage: 'Field cannot be empty!'}
                                                                    }}/>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={3}>
                                                                <FormGroup>
                                                                    <Label for="titleEpisodeCount">Episode Count</Label>
                                                                    <AvField type="text" name="episodeCount" value={this.state.titleForm.episodic.episodeCount} disabled={this.state.episodeChecked} id="titleEpisodeCount" errorMessage="Please enter a valid episode count!" placeholder={'Enter Episode Count'} onChange={this.handleChangeEpisodic} />
                                                                </FormGroup>
                                                            </Col>
                                                        </React.Fragment>
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
                                                    <AvField type="text" name="seasonId" value={this.state.titleForm.episodic.seasonId} disabled={this.state.seasonChecked} id="titleSeasonID" errorMessage="Please enter a valid season id" placeholder={'Enter Season ID'} onChange={this.handleChangeEpisodic} />
                                                </Col>
                                                {
                                                    !this.state.episodeChecked ?
                                                        <Col>
                                                            <Label for="titleEpisodeID">Episode ID</Label>
                                                            <AvField type="text" name="episodeId" value={this.state.titleForm.episodic.episodeId} disabled={this.state.episodeChecked} id="titleEpisodeID" errorMessage="Please enter a valid episode id" placeholder={'Enter Episode ID'} onChange={this.handleChangeEpisodic} />
                                                        </Col>
                                                        : null
                                                }
                                            </Row>
                                            : null
                                    }
                                    <Row style={{ marginTop: '15px' }}>
                                        <Col>
                                            <Label for="titleReleaseYear">Release Year{!this.state.isReleaseYearRequired ? null : <span style={{ color: 'red' }}>*</span>}</Label>
                                            <AvField name="releaseYear" errorMessage="Please enter a valid year!" id="titleReleaseYear" validate={{
                                                required: { value: this.state.isReleaseYearRequired, errorMessage: 'Field cannot be empty!' },
                                                pattern: { value: '^[0-9]+$' },
                                                minLength: { value: 4 },
                                                maxLength: { value: 4 }
                                            }} placeholder="Enter Release Year" value={this.state.titleForm.releaseYear} onChange={this.handleChange} />
                                        </Col>
                                        <Col>
                                            <Label for="titleBoxOffice">Box Office</Label>
                                            <AvField name="boxOffice" id="titleBoxOffice" type="number" onChange={this.handleChange} value={this.state.titleForm.boxOffice} placeholder="Enter Box Office"
                                                validate={{
                                                    pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' }, 
                                                }}
                                            />
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
    className: PropTypes.string,
    territoryMetadata: PropTypes.object
};


const mapStateToProps = state => {
    return {
        territoryMetadata: state.territoryMetadata,
    };
};

export default connect(mapStateToProps, null)(TitleCreate);