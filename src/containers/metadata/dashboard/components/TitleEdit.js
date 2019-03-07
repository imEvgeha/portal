import React, { Component, Fragment } from 'react';
import t from 'prop-types';
import { BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH } from '../../../../constants/metadata/metadata-breadcrumb-paths';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';
import EditPage from './EditPage';
import TerritoryMetadata from './territorymetadata/TerritoryMetadata';
import { titleService } from '../../service/TitleService';
import { errorModal } from '../../../../components/modal/ErrorModal';
import { Button, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import moment from 'moment';
import NexusBreadcrumb from '../../../NexusBreadcrumb';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const CURRENT_TAB = 0;
const CREATE_TAB = 'CREATE_TAB';


class TitleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false,
            activeTab: CURRENT_TAB,
            invalidBoxOffice: false,
            isLocalRequired: false,
            titleForm: {},
            editedForm: {},
            territories: {},
            territory: [],
            updatedTerritories: [],

        };
    }
    componentDidMount() {
        if (NexusBreadcrumb.empty()) NexusBreadcrumb.set(BREADCRUMB_METADATA_DASHBOARD_PATH);
        NexusBreadcrumb.set([{ name: 'Dashboard', path: '/metadata', onClick: () => this.handleBackToDashboard() }, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH]);
        const titleId = this.props.match.params.id;
        titleService.getTitleById(titleId).then((response) => {
            const titleForm = response.data;
            this.setState({ titleForm, editedForm: titleForm });
        }).catch((err) => {
            errorModal.open('Error', () => { }, { description: err.message, closable: true });
            console.error('Unable to load Title Data');
        });
        titleService.getTerritoryMetadataById(titleId).then((response) => {
            const territory = response.data;
            this.setState({
                territory: territory
            });
        }).catch((err) => {
            errorModal.open('Error', () => { }, { description: err.message, closable: true });
            console.error('Unable to load Title Data');
        });


    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }
    handleBackToDashboard() {
        NexusBreadcrumb.set(BREADCRUMB_METADATA_DASHBOARD_PATH);
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 27) { //Key code for Escape
            this.setState({
                isEditMode: false
            });
        }
    }

    handleSwitchMode = () => {
        this.setState({ isEditMode: !this.state.isEditMode, activeTab: CURRENT_TAB });
    }

    handleOnChangeEdit = (e) => {
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
                isBrandProdYearCompleted: false,
                brandTitleName: null
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
                isBrandCompleted: false,
                brandProdYear: null
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

    handleOnSave = () => {
        if (this.state.titleForm !== this.state.editedForm) {
            const updatedTitle = this.state.editedForm;
            this.setState({
                isLoading: true
            });
            titleService.updateTitle(updatedTitle).then(() => {
                this.setState({
                    isLoading: false,
                    titleForm: this.state.editedForm,
                    isEditMode: !this.state.isEditMode,
                    activeTab: CURRENT_TAB
                });

            }).catch((err) => {
                errorModal.open('Error', () => { }, { description: err.message, closable: true });
                console.error('Unable to load Title Data');
            });

        } else {
            this.setState({
                isEditMode: !this.state.isEditMode,
                activeTab: CURRENT_TAB
            });
        }

        this.state.updatedTerritories.forEach(t => {
            const dataFormated = {
                ...t,
                theatricalReleaseDate: t.theatricalReleaseDate ? moment(t.theatricalReleaseDate).format(DATE_FORMAT) : null,
                homeVideoReleaseDate: t.homeVideoReleaseDate ? moment(t.homeVideoReleaseDate).format(DATE_FORMAT) : null,
                availAnnounceDate: t.availAnnounceDate ? moment(t.availAnnounceDate).format(DATE_FORMAT) : null,
            };
            titleService.updateTerritoryMetadata(dataFormated).then((response) => {
                let list = [].concat(this.state.territory);
                let foundIndex = list.findIndex(x => x.id == response.data.id);
                list[foundIndex] = response.data;
                this.setState({
                    territory: list
                });
            }).catch((err) => {
                errorModal.open('Error', () => { }, { description: err.message, closable: true });
                console.error('Unable to edit Title Data');
            });
        });

        if (this.state.territories.locale) {
            const newTerritory = {
                ...this.state.territories,
                theatricalReleaseDate: this.state.territories.theatricalReleaseDate ? moment(this.state.territories.theatricalReleaseDate).format(DATE_FORMAT) : null,
                homeVideoReleaseDate: this.state.territories.homeVideoReleaseDate ? moment(this.state.territories.homeVideoReleaseDate).format(DATE_FORMAT) : null,
                availAnnounceDate: this.state.territories.availAnnounceDate ? moment(this.state.territories.availAnnounceDate).format(DATE_FORMAT) : null,
                parentId: this.props.match.params.id
            };
            titleService.addMetadata(newTerritory).then((response) => {             
                this.cleanTerritoryMetada();
                this.setState({
                    territory: [response.data, ...this.state.territory],
                    activeTab: CURRENT_TAB,
                    isLocalRequired: false
                });
            }).catch((err) => {
                errorModal.open('Error', () => { }, { description: err.response.data.description, closable: true });
                console.error('Unable to add Territory Metadata');
            });
        } else {
            this.cleanTerritoryMetada();
        }
    }

    handleEditChange = (e, data) => {
        let edited = this.state.updatedTerritories.find(e => e.id === data.id);
        if (edited) {
            edited[e.target.name] = e.target.value;
            let newOne = this.state.updatedTerritories.filter((el) => el.id !== data.id);
            newOne.push(edited);
            this.setState({
                updatedTerritories: newOne
            });
        } else {
            edited = Object.assign({}, data);
            edited[e.target.name] = e.target.value;
            this.setState({
                updatedTerritories: [edited, ...this.state.updatedTerritories]
            });
        }
    }

    handleChange = (e) => {
        this.setState({
            territories: {
                ...this.state.territories,
                [e.target.name]: e.target.value
            }
        });
    }
    cleanTerritoryMetada = () => {        
        this.form && this.form.reset();
        this.setState({
            territories: {
                locale: null,
                availAnnounceDate: null,
                theatricalReleaseDate: null,
                homeVideoReleaseDate: null,
                boxOffice: null,
                releaseYear: null
            }
        });
    }
    toggle = (tab) => {
        this.setState({
            activeTab: tab,
            isLocalRequired: false
        });
    }

    addTerritoryMetadata = (tab) => {
        this.setState({
            activeTab: tab,
            isLocalRequired: true
        });

    }
    handleSubmit = () => {
        this.setState({
            activeTab: CURRENT_TAB
        });
    }    

    readOnly = () => {
        return <TitleReadOnlyMode data={this.state.titleForm} />;
    };

    editMode = () => {
        return <TitleEditMode
            handleChangeEpisodic={this.handleChangeEpisodic}
            handleChangeBrandProdYear={this.handleChangeBrandProdYear}
            handleChangeBrand={this.handleChangeBrand}
            keyPressed={this.handleKeyDown}
            data={this.state.titleForm}
            episodic={this.state.titleForm.episodic}
            handleOnChangeEdit={this.handleOnChangeEdit} />;
    };

    render() {
        return (
            <EditPage>

                <AvForm id="titleDetail" onValidSubmit={this.handleOnSave} ref={c => (this.form = c)}>
                    <Row>
                        <Col className="clearfix" style={{ marginRight: '20px', marginBottom: '10px' }}>
                            {
                                this.state.isEditMode ?
                                    <Fragment>
                                        <Button className="float-right" id="btnSave" color="primary" style={{ marginRight: '10px' }}>Save</Button>
                                        <Button className="float-right" id="btnCancel" onClick={this.handleSwitchMode} outline color="danger" style={{ marginRight: '10px' }}>Cancel</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Col>
                                            <Button className="float-right" id="btnEdit" onClick={this.handleSwitchMode}>Edit</Button>
                                        </Col>
                                    </Fragment>
                            }
                        </Col>
                    </Row>
                    {
                        this.state.isEditMode ? this.editMode() : this.readOnly()
                    }

                    <TerritoryMetadata
                        isLocalRequired={this.state.isLocalRequired}
                        validSubmit={this.handleOnSave}
                        toggle={this.toggle}
                        activeTab={this.state.activeTab}
                        addTerritoryMetadata={this.addTerritoryMetadata}
                        CREATE_TAB={CREATE_TAB}
                        handleSubmit={this.handleSubmit}
                        territories={this.state.territories}
                        territory={this.state.territory}
                        handleChange={this.handleChange}
                        handleEditChange={this.handleEditChange}
                        isEditMode={this.state.isEditMode} />
                </AvForm>
            </EditPage>
        );
    }
}





TitleEdit.propTypes = {
    match: t.object.isRequired
};

export default TitleEdit;