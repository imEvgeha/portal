import React from 'react';
import {SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {Alert, Container, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Button, {LoadingButton} from '@atlaskit/button';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {Checkbox} from '@atlaskit/checkbox';
import '../Title.scss';
import {titleService} from '../../service/TitleService';
import {publisherService} from '../../service/PublisherService';
import {
    ADVERTISEMENT,
    EPISODE,
    EVENT,
    MOVIE,
    SEASON,
    SERIES,
    SPECIAL,
    SPORTS,
} from '@vubiquity-nexus/portal-ui/lib/constants/contentType';
import {Button as PrimeReactButton} from 'primereact/button';
import constants from '../../MetadataConstants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import titleConstants from '../../../../../avails/title-matching/components/create-title-form/CreateTitleFormConstants';
import {getDomainName} from '@vubiquity-nexus/portal-utils/lib/Common';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import withRouter from '@vubiquity-nexus/portal-ui/lib/hocs/withRouter';

const onViewTitleClick = (response, realm) => {
    const {id} = response || {};
    const url = `${getDomainName()}/${realm}/metadata/detail/${id}`;
    window.open(url, '_blank');
};

class TitleCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            seasonChecked: true,
            episodeChecked: true,
            seriesChecked: true,
            isSeriesCompleted: false,
            isReleaseYearRequired: true,
            isSeasonNumberRequired: false,
            isEpisodeNumberRequired: false,
            isSyncVZ: false,
            isCreatingTitle: false,
            copyCastCrewFromSeason: false,
            isSyncMovida: false,
            titleForm: {
                title: '',
                contentType: '',
                releaseYear: '',
                episodic: {
                    seriesTitleName: '',
                    episodeNumber: '',
                    seasonNumber: '',
                },
            },
        };
    }

    toggle = () => {
        this.cleanFields();
        this.props.toggle();
        this.setState({
            errorMessage: '',
            seasonChecked: true,
            episodeChecked: true,
            seriesChecked: true,
            isReleaseYearRequired: true,
            isSeriesCompleted: false,
        });
    };

    handleChange = e => {
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                [e.target.name]: e.target.value,
            },
        });
    };

    handleChangeEpisodic = e => {
        const newEpisodic = {
            ...this.state.titleForm.episodic,
            [e.target.name]: e.target.value,
        };
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                episodic: newEpisodic,
            },
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isSeriesCompleted: true,
                isSeasonNumberRequired: true,
            });
        } else {
            this.setState({
                isSeriesCompleted: false,
                isSeasonNumberRequired: false,
            });
        }
    };

    handleChangeSeasonNumber = e => {
        const newEpisodic = {
            ...this.state.titleForm.episodic,
            seasonNumber: e.target.value,
        };
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                episodic: newEpisodic,
            },
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isSeriesCompleted: true,
                isEpisodeNumberRequired: true,
            });
        } else {
            this.setState({
                isSeriesCompleted: false,
                isEpisodeNumberRequired: false,
            });
        }
    };

    onSubmit = () => {
        this.setState({errorMessage: ''});
        const title = this.getTitleWithoutEmptyField();
        const {isSyncVZ, isSyncMovida, copyCastCrewFromSeason} = this.state;
        const params = {copyCastCrewFromSeason: copyCastCrewFromSeason};
        this.setState({isCreatingTitle: true});
        titleService
            .createTitleV2(title, params)
            .then(response => {
                if (isSyncVZ || isSyncMovida) {
                    // call registerTitle API
                    publisherService
                        .registerTitle(response.id, isSyncVZ, isSyncMovida)
                        .then(response => {
                            this.props.addToast({
                                severity: 'success',
                                content: () => {
                                    return (
                                        <ToastBody
                                            summary={SUCCESS_TITLE}
                                            detail={titleConstants.NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE}
                                            severity="success"
                                        >
                                            <PrimeReactButton
                                                label="View Title"
                                                className="p-button-link p-toast-button-link"
                                                onClick={() =>
                                                    onViewTitleClick(response, this.props.router.params.realm)
                                                }
                                            />
                                        </ToastBody>
                                    );
                                },
                            });
                        })
                        .catch(() => {
                            this.setState({
                                isCreatingTitle: false,
                                errorMessage: get(
                                    e,
                                    'response.data.description',
                                    titleConstants.NEW_TITLE_TOAST_ERROR_PUBLISHING_MESSAGE
                                ),
                            });
                        });
                }
                this.form && this.form.reset();
                this.setState({isCreatingTitle: false});
                this.cleanFields();
                this.toggle();
                this.props.addToast({
                    severity: 'success',
                    content: () => {
                        return (
                            <ToastBody
                                summary={SUCCESS_TITLE}
                                detail={titleConstants.NEW_TITLE_TOAST_SUCCESS_MESSAGE}
                                severity="success"
                            >
                                <PrimeReactButton
                                    label="View Title"
                                    className="p-button-link p-toast-button-link"
                                    onClick={() => onViewTitleClick(response, this.props.router.params.realm)}
                                />
                            </ToastBody>
                        );
                    },
                });
            })
            .catch(e => {
                this.setState({
                    isCreatingTitle: false,
                    errorMessage: get(e, 'response.data.description', 'Title creation failed!'),
                });
            });
    };

    getTitleWithoutEmptyField() {
        const title = {};
        for (const titleField in this.state.titleForm) {
            if (titleField === 'episodic') {
                title[titleField] = this.getEpisodicWithoutEmptyFields();
            } else if (this.state.titleForm[titleField]) {
                title[titleField] = this.state.titleForm[titleField];
            } else {
                title[titleField] = null;
            }
        }

        return title;
    }

    getEpisodicWithoutEmptyFields() {
        const episodic = {};
        let doAddEpisodic = false;
        for (const episodicField in this.state.titleForm.episodic) {
            if (this.state.titleForm.episodic[episodicField]) {
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
                episodic: {
                    seriesTitleName: '',
                    episodeNumber: '',
                    seasonNumber: '',
                },
            },
            seasonChecked: true,
            episodeChecked: true,
            seriesChecked: true,
            isReleaseYearRequired: true,
            isSeriesCompleted: false,
            isEpisodeNumberRequired: false,
            errorMessage: '',
        });
    };

    handleChangeSeries = e => {
        const newEpisodic = {
            ...this.state.titleForm.episodic,
            seriesTitleName: e.target.value,
        };
        this.setState({
            titleForm: {
                ...this.state.titleForm,
                episodic: newEpisodic,
            },
        });
        if (e.target.value.length !== 0) {
            this.setState({
                isSeasonNumberRequired: true,
                isEpisodeNumberRequired: true,
            });
        } else {
            this.setState({
                isSeasonNumberRequired: false,
                isEpisodeNumberRequired: false,
            });
        }
    };

    handleSelect = e => {
        if (e.target.value === SEASON.apiName) {
            this.setState({
                seasonChecked: false,
                episodeChecked: true,
                seriesChecked: false,
                isReleaseYearRequired: true,
                isSeriesCompleted: true,
                isSeasonNumberRequired: true,
                copyCastCrewFromSeason: false,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                    episodic: {
                        ...this.state.titleForm.episodic,
                        episodeNumber: '',
                    },
                },
            });
        } else if (e.target.value === EPISODE.apiName) {
            this.setState({
                seasonChecked: false,
                episodeChecked: false,
                seriesChecked: false,
                isReleaseYearRequired: true,
                isSeriesCompleted: true,
                isEpisodeNumberRequired: true,
                isSeasonNumberRequired: true,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                },
            });
        } else if (e.target.value === SERIES.apiName) {
            this.setState({
                seasonChecked: true,
                episodeChecked: true,
                seriesChecked: true,
                isReleaseYearRequired: false,
                copyCastCrewFromSeason: false,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                    episodic: {
                        ...this.state.titleForm.episodic,
                        seasonNumber: '',
                        episodeNumber: '',
                    },
                },
            });
        } else if (e.target.value === EVENT.apiName || e.target.value === SPORTS.apiName) {
            this.setState({
                seasonChecked: false,
                episodeChecked: false,
                isSeriesCompleted: false,
                seriesChecked: false,
                isReleaseYearRequired: true,
                copyCastCrewFromSeason: false,
                isEpisodeNumberRequired: false,
                isSeasonNumberRequired: false,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                },
            });
        } else {
            this.setState({
                seasonChecked: true,
                episodeChecked: true,
                seriesChecked: true,
                isReleaseYearRequired: true,
                copyCastCrewFromSeason: false,
                isSeriesCompleted: true,
                titleForm: {
                    ...this.state.titleForm,
                    contentType: e.target.value,
                    episodic: {
                        seriesTitleName: '',
                        episodeNumber: '',
                        seasonNumber: '',
                    },
                },
            });
        }
    };

    renderSyncCheckBoxes = () => {
        const {isSyncVZ, isSyncMovida} = this.state;
        return (
            <div className="row">
                <div className="col">
                    <Checkbox
                        id="syncVZ"
                        label="Publish to VZ and Movida Int'l"
                        onChange={event => this.setState({isSyncVZ: event.currentTarget.checked})}
                        isChecked={isSyncVZ}
                    />
                    <Checkbox
                        id="syncMovida"
                        label="Publish to Movida"
                        onChange={event => this.setState({isSyncMovida: event.currentTarget.checked})}
                        isChecked={isSyncMovida}
                    />
                </div>
            </div>
        );
    };

    render() {
        const {MAX_TITLE_LENGTH, MAX_SEASON_LENGTH, MAX_EPISODE_LENGTH, MAX_RELEASE_YEAR_LENGTH} = constants;
        return (
            <Modal
                isOpen={this.props.display}
                toggle={this.toggle}
                id="titleModalBox"
                className={this.props.className}
                fade={false}
                backdrop={true}
            >
                <AvForm onValidSubmit={this.onSubmit} id="titleCreateForm" ref={c => (this.form = c)}>
                    <ModalHeader toggle={this.props.toggle}>Create Title</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col">
                                <Container>
                                    <div className="row">
                                        <div className="col">
                                            {/* eslint-disable-next-line react/no-adjacent-inline-elements */}
                                            <Label for="title">
                                                Title<span style={{color: 'red'}}>*</span>
                                            </Label>
                                            <AvField
                                                name="title"
                                                errorMessage="Please enter a valid title!"
                                                id="title"
                                                value={this.state.titleForm.title}
                                                placeholder="Enter Title"
                                                onChange={this.handleChange}
                                                validate={{
                                                    required: {errorMessage: 'Field cannot be empty!'},
                                                    maxLength: {value: MAX_TITLE_LENGTH},
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            {/* eslint-disable-next-line react/no-adjacent-inline-elements */}
                                            <Label for="contentType">
                                                Content Type<span style={{color: 'red'}}>*</span>
                                            </Label>
                                            <AvField
                                                type="select"
                                                name="contentType"
                                                required
                                                value={this.state.titleForm.contentType}
                                                onChange={this.handleSelect}
                                                errorMessage="Field cannot be empty!"
                                            >
                                                <option value="">Select Content Type</option>
                                                <option value={MOVIE.apiName}>{MOVIE.name}</option>
                                                <option value={SERIES.apiName}>{SERIES.name}</option>
                                                <option value={SEASON.apiName}>{SEASON.name}</option>
                                                <option value={EPISODE.apiName}>{EPISODE.name}</option>
                                                <option value={EVENT.apiName}>{EVENT.name}</option>
                                                <option value={SPORTS.apiName}>{SPORTS.name}</option>
                                                <option value={ADVERTISEMENT.apiName}>{ADVERTISEMENT.name}</option>
                                                <option value={SPECIAL.apiName}>{SPECIAL.name}</option>
                                            </AvField>
                                        </div>
                                    </div>
                                    {!this.state.seriesChecked ? (
                                        <div className="row">
                                            <div className="col">
                                                <Label for="titleSeriesName">
                                                    Series
                                                    {this.state.isSeriesCompleted ? (
                                                        <span style={{color: 'red'}}>*</span>
                                                    ) : null}
                                                </Label>
                                                <AvField
                                                    type="text"
                                                    name="seriesTitleName"
                                                    disabled={this.state.seriesChecked}
                                                    value={this.state.titleForm.episodic.seriesTitleName}
                                                    id="titleSeriesName"
                                                    placeholder="Enter Series Name"
                                                    errorMessage="Field cannot be empty!"
                                                    onChange={this.handleChangeSeries}
                                                    required={this.state.isSeriesCompleted}
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                    {!this.state.seasonChecked ? (
                                        <div className="row">
                                            <div className="col">
                                                <FormGroup>
                                                    <Label for="titleSeasonNumber">
                                                        Season
                                                        {this.state.isSeasonNumberRequired ? (
                                                            <span style={{color: 'red'}}>*</span>
                                                        ) : null}
                                                    </Label>
                                                    <AvField
                                                        type="number"
                                                        name="seasonNumber"
                                                        disabled={this.state.seasonChecked}
                                                        value={this.state.titleForm.episodic.seasonNumber}
                                                        id="titleSeasonNumber"
                                                        placeholder="Enter Season Number"
                                                        errorMessage="Please enter a valid season number!"
                                                        onChange={this.handleChangeSeasonNumber}
                                                        validate={{
                                                            maxLength: {value: MAX_SEASON_LENGTH},
                                                            required: {
                                                                value: this.state.isSeasonNumberRequired,
                                                                errorMessage: 'Field cannot be empty!',
                                                            },
                                                        }}
                                                    />
                                                </FormGroup>
                                            </div>
                                            {!this.state.episodeChecked ? (
                                                <div className="col">
                                                    <FormGroup>
                                                        <Label for="titleEpisodeNumber">
                                                            Episode
                                                            {this.state.isEpisodeNumberRequired ? (
                                                                <span style={{color: 'red'}}>*</span>
                                                            ) : null}
                                                        </Label>
                                                        <AvField
                                                            type="number"
                                                            name="episodeNumber"
                                                            value={this.state.titleForm.episodic.episodeNumber}
                                                            disabled={this.state.episodeChecked}
                                                            id="titleEpisodeNumber"
                                                            errorMessage="Please enter a valid episode number!"
                                                            placeholder="Enter Episode Number"
                                                            onChange={this.handleChangeEpisodic}
                                                            validate={{
                                                                maxLength: {value: MAX_EPISODE_LENGTH},
                                                                required: {
                                                                    value: this.state.isEpisodeNumberRequired,
                                                                    errorMessage: 'Field cannot be empty!',
                                                                },
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    {!this.state.episodeChecked && (
                                        <div className="row">
                                            <div className="col">
                                                <Checkbox
                                                    id="addCrew"
                                                    label="Add Cast Crew from Season to episode"
                                                    onChange={event =>
                                                        this.setState({
                                                            copyCastCrewFromSeason: event.currentTarget.checked,
                                                        })
                                                    }
                                                    isChecked={this.state.copyCastCrewFromSeason}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="row" style={{marginTop: '15px'}}>
                                        <div className="col">
                                            <Label for="titleReleaseYear">
                                                Release Year
                                                {!this.state.isReleaseYearRequired ? null : (
                                                    <span style={{color: 'red'}}>*</span>
                                                )}
                                            </Label>
                                            <AvField
                                                name="releaseYear"
                                                errorMessage="Please enter a valid year!"
                                                id="titleReleaseYear"
                                                validate={{
                                                    required: {
                                                        value: this.state.isReleaseYearRequired,
                                                        errorMessage: 'Field cannot be empty!',
                                                    },
                                                    pattern: {value: '^[0-9]+$'},
                                                    minLength: {value: MAX_RELEASE_YEAR_LENGTH},
                                                    maxLength: {value: MAX_RELEASE_YEAR_LENGTH},
                                                }}
                                                placeholder="Enter Release Year"
                                                value={this.state.titleForm.releaseYear}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    {this.renderSyncCheckBoxes()}
                                </Container>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.errorMessage && (
                            <div className="nx-stylish list-group">
                                <Alert color="danger">{this.state.errorMessage}</Alert>
                            </div>
                        )}
                        <Button
                            id="titleCancelBtn"
                            onClick={this.toggle}
                            appearance="primary"
                            isDisabled={this.state.isCreatingTitle}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            id="titleSaveBtn"
                            onClick={this.onSubmit}
                            appearance="primary"
                            isLoading={this.state.isCreatingTitle}
                        >
                            Save
                        </LoadingButton>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

TitleCreate.propTypes = {
    toggle: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    className: PropTypes.string,
    tenantCode: PropTypes.string,
    addToast: PropTypes.func,
    router: PropTypes.object,
};

TitleCreate.defaultProps = {
    router: {},
    tenantCode: undefined,
    addToast: () => null,
};

export default withRouter(withToasts(TitleCreate));
