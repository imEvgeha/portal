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
import EditorialMetadata from './editorialmetadata/EditorialMetadata';
import {EDITORIAL_METADATA_PREFIX, EDITORIAL_METADATA_SYNOPSIS, EDITORIAL_METADATA_TITLE} from '../../../../constants/metadata/metadataComponent';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const CURRENT_TAB = 0;
const CREATE_TAB = 'CREATE_TAB';

const emptyTerritory = {
    locale: null,
    availAnnounceDate: null,
    theatricalReleaseDate: null,
    homeVideoReleaseDate: null,
    boxOffice: null,
    releaseYear: null
};

const emptyEditorial = {
    parentId: null,
    locale: null,
    language: null,
    service: null,
    format: null,
    title: null,
    synopsis: null,
    copyright: null,
    awards: null,
    seasonNumber: null,
    episodeNumber: null,
    seriesName: null,
};

class TitleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false,
            territoryMetadataActiveTab: CURRENT_TAB,
            editorialMetadataActiveTab: CURRENT_TAB,
            invalidBoxOffice: false,
            areTerritoryMetadataFieldsRequired: false,
            areEditorialMetadataFieldsRequired: false,
            titleForm: {},
            editedForm: {},
            territories: {},
            territory: [],
            updatedTerritories: [],
            editorialMetadata: [],
            updatedEditorialMetadata: [],
            editorialMetadataForCreate: {}
        };
    }

    componentDidMount() {
        if (NexusBreadcrumb.empty()) NexusBreadcrumb.set(BREADCRUMB_METADATA_DASHBOARD_PATH);
        NexusBreadcrumb.set([{ name: 'Dashboard', path: '/metadata', onClick: () => this.handleBackToDashboard() }, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH]);

        const titleId = this.props.match.params.id;
        this.loadTitle(titleId);
        this.loadTerritoryMetadata(titleId);
        this.loadEditorialMetadata(titleId);
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }

    loadTitle(titleId) {
        titleService.getTitleById(titleId).then((response) => {
            const titleForm = response.data;
            this.setState({ titleForm, editedForm: titleForm });
        }).catch(() => {
            console.error('Unable to load Title Data');
        });
    }

    loadTerritoryMetadata(titleId) {
        titleService.getTerritoryMetadataById(titleId).then((response) => {
            const territoryMetadata = response.data;
            this.setState({
                territory: territoryMetadata
            });
        }).catch(() => {
            console.error('Unable to load Territory Metadata');
        });
    }

    loadEditorialMetadata(titleId) {
        titleService.getEditorialMetadataById(titleId).then((response) => {
            const editorialMetadata = response.data;
            this.setState({
                editorialMetadata: editorialMetadata
            });
        }).catch(() => {
            console.error('Unable to load Editorial Metadata');
        });
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
    };

    /**
     * Title document
     */
    handleSwitchMode = () => {
        this.setState({ isEditMode: !this.state.isEditMode,
            territoryMetadataActiveTab: CURRENT_TAB,
            editorialMetadataActiveTab: CURRENT_TAB,
            territories: emptyTerritory,
            editorialMetadataForCreate: emptyEditorial
        });
    };



    handleOnChangeEdit = (e) => {
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                [e.target.name]: e.target.value
            }
        });
    };

    handleChangeSeries = (e) => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            seriesTitleName: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic
            }
        });
    };

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
    };

    readOnly = () => {
        return <TitleReadOnlyMode data={this.state.titleForm} />;
    };

    editMode = () => {
        return <TitleEditMode
            handleChangeEpisodic={this.handleChangeEpisodic}
            handleChangeSeries={this.handleChangeSeries}
            keyPressed={this.handleKeyDown}
            data={this.state.titleForm}
            episodic={this.state.titleForm.episodic}
            handleOnChangeEdit={this.handleOnChangeEdit} />;
    };

    handleTitleOnSave = () => {
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
                    territoryMetadataActiveTab: CURRENT_TAB,
                    editorialMetadataActiveTab: CURRENT_TAB
                });

            }).catch((err) => {
                errorModal.open('Error', () => { }, { description: err.message, closable: true });
                console.error('Unable to load Title Data');
            });

        } else {
            this.setState({
                isEditMode: !this.state.isEditMode,
                territoryMetadataActiveTab: CURRENT_TAB,
                editorialMetadataActiveTab: CURRENT_TAB
            });
        }
    };

    /**
     * Territory Metadata document
     */
    handleTerritoryMetadataEditChange = (e, data) => {
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
    };

    handleTerritoryMetadataChange = (e) => {
        this.setState({
            territories: {
                ...this.state.territories,
                [e.target.name]: e.target.value
            }
        });
    };

    cleanTerritoryMetadata = () => {
        this.form && this.form.reset();
        this.setState({
            territories: emptyTerritory
        });
    };

    toggleTerritoryMetadata = (tab) => {
        this.setState({
            territoryMetadataActiveTab: tab,
            areTerritoryMetadataFieldsRequired: false,
        });
    };

    addTerritoryMetadata = (tab) => {
        this.setState({
            territoryMetadataActiveTab: tab,
            areTerritoryMetadataFieldsRequired: true
        });

    };

    handleTerritoryMetadataSubmit = () => {
        this.setState({
            territoryMetadataActiveTab: CURRENT_TAB
        });
    };

    handleTerritoryMetadataOnSave = () => {
        this.state.updatedTerritories.forEach(t => {
            const dataFormatted = {
                ...t,
                theatricalReleaseDate: t.theatricalReleaseDate ? moment(t.theatricalReleaseDate).format(DATE_FORMAT) : null,
                homeVideoReleaseDate: t.homeVideoReleaseDate ? moment(t.homeVideoReleaseDate).format(DATE_FORMAT) : null,
                availAnnounceDate: t.availAnnounceDate ? moment(t.availAnnounceDate).format(DATE_FORMAT) : null,
            };
            titleService.updateTerritoryMetadata(dataFormatted).then((response) => {
                let list = [].concat(this.state.territory);
                let foundIndex = list.findIndex(x => x.id === response.data.id);
                list[foundIndex] = response.data;
                this.setState({
                    territory: list
                });
            }).catch(() => {
                console.error('Unable to edit Title Data');
            });
        });
        this.setState({
            updatedTerritories: []
        });

        if (this.state.territories.locale) {
            const newTerritory = {
                ...this.state.territories,
                theatricalReleaseDate: this.state.territories.theatricalReleaseDate ? moment(this.state.territories.theatricalReleaseDate).format(DATE_FORMAT) : null,
                homeVideoReleaseDate: this.state.territories.homeVideoReleaseDate ? moment(this.state.territories.homeVideoReleaseDate).format(DATE_FORMAT) : null,
                availAnnounceDate: this.state.territories.availAnnounceDate ? moment(this.state.territories.availAnnounceDate).format(DATE_FORMAT) : null,
                parentId: this.props.match.params.id
            };
            titleService.addTerritoryMetadata(newTerritory).then((response) => {
                this.cleanTerritoryMetadata();
                this.setState({
                    territory: [response.data, ...this.state.territory],
                    territoryMetadataActiveTab: CURRENT_TAB,
                });
            }).catch(() => {
                console.error('Unable to add Territory Metadata');
            });
        } else {
            this.cleanTerritoryMetadata();
        }
    };


    /**
     * Editorial Metadata document
     */
    handleEditorialMetadataEditChange = (e, data) => {

        let targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        let isSynopsis = targetName.startsWith(EDITORIAL_METADATA_SYNOPSIS);
        let isEditorialTitle = targetName.startsWith(EDITORIAL_METADATA_TITLE);

        let edited = this.state.updatedEditorialMetadata.find(e => e.id === data.id);
        if (!edited) {
            edited = Object.assign({}, data);
        }

        if(isSynopsis) {
            targetName = targetName.replace(EDITORIAL_METADATA_SYNOPSIS, '');
            this.updateEditorialMetadataInnerObject(edited, 'synopsis', targetName, e.target.value);
        } else if(isEditorialTitle) {
            targetName = targetName.replace(EDITORIAL_METADATA_TITLE, '');
            this.updateEditorialMetadataInnerObject(edited, 'title', targetName, e.target.value);
        } else {
            edited[targetName] = e.target.value;
        }

        let newOne = this.state.updatedEditorialMetadata.filter((el) => el.id !== data.id);
        newOne.push(edited);
        this.setState({
            updatedEditorialMetadata: newOne
        });
    };

    updateEditorialMetadataInnerObject = (edited, objectName, objectField, objectFieldValue) => {
        if(edited[objectName]) {
            edited[objectName][objectField] = objectFieldValue;
        } else {
            let newObject = {};
            newObject[objectField] = objectFieldValue;
            edited[objectName] = newObject;
        }
    };

    handleEditorialMetadataChange = (e) => {
        let targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                [targetName]: e.target.value
            }
        });
    };

    handleSynopsisEditorialMetadataChange = (e) => {
        let targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const newSynopsis = {
            ...this.state.editorialMetadataForCreate.synopsis,
            [targetName]: e.target.value
        };
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                synopsis: newSynopsis
            }
        });
    };

    handleTitleEditorialMetadataChange = (e) => {
        let targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const newTitle = {
            ...this.state.editorialMetadataForCreate.title,
            [targetName]: e.target.value
        };
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                title: newTitle
            }
        });
    };

    cleanEditorialMetadata = () => {
        this.form && this.form.reset();
        this.setState({
            editorialMetadataForCreate: emptyEditorial
        });
    };

    toggleEditorialMetadata = (tab) => {
        this.setState({
            editorialMetadataActiveTab: tab,
            areEditorialMetadataFieldsRequired: false
        });
    };

    addEditorialMetadata = (tab) => {
        this.setState({
            editorialMetadataActiveTab: tab,
            areEditorialMetadataFieldsRequired: true
        });
    };

    handleEditorialMetadataSubmit = () => {
        this.setState({
            editorialMetadataActiveTab: CURRENT_TAB
        });
    };

    handleEditorialMetadataOnSave = () => {
        this.state.updatedEditorialMetadata.forEach(e => {
            titleService.updateEditorialMetadata(e).then((response) => {
                let list = [].concat(this.state.editorialMetadata);
                let foundIndex = list.findIndex(x => x.id === response.data.id);
                list[foundIndex] = response.data;
                this.setState({
                    editorialMetadata: list
                });
            }).catch(() => {
                console.error('Unable to edit Editorial Metadata');
            });
        });
        this.setState({
            updatedEditorialMetadata: []
        });

        if (this.state.editorialMetadataForCreate.locale && this.state.editorialMetadataForCreate.language) {
            let newEditorialMetadata = this.getEditorialMetadataWithoutEmptyField();
            newEditorialMetadata.parentId = this.props.match.params.id;
            titleService.addEditorialMetadata(newEditorialMetadata).then((response) => {
                this.cleanEditorialMetadata();
                this.setState({
                    editorialMetadata: [response.data, ...this.state.editorialMetadata],
                    editorialMetadataActiveTab: CURRENT_TAB
                });
            }).catch(() => {
                console.error('Unable to add Editorial Metadata');
            });
        } else {
            this.cleanEditorialMetadata();
        }
    };

    getEditorialMetadataWithoutEmptyField() {
        let editorial = {};
        for(let editorialField in this.state.editorialMetadataForCreate) {
            if(editorialField === 'title') {
                editorial[editorialField] = this.getEpisodicSubObjectWithoutEmptyFields('title');
            }
            else if(editorialField === 'synopsis') {
                editorial[editorialField] = this.getEpisodicSubObjectWithoutEmptyFields('synopsis');
            }
            else if(this.state.editorialMetadataForCreate[editorialField]) {
                editorial[editorialField] = this.state.editorialMetadataForCreate[editorialField];
            } else {
                editorial[editorialField] = null;
            }
        }

        return editorial;
    }

    getEpisodicSubObjectWithoutEmptyFields(subField) {
        let subObject = {};
        let doAddSubObject = false;
        for(let field in this.state.editorialMetadataForCreate[subField]) {
            if(this.state.editorialMetadataForCreate[subField][field]) {
                subObject[field] = this.state.editorialMetadataForCreate[subField][field];
                doAddSubObject = true;
            } else {
                subObject[field] = null;
            }
        }

        return doAddSubObject ? subObject : null;
    }

    /**
     * Common
     */
    handleOnSave = () => {
        this.handleTitleOnSave();
        this.handleTerritoryMetadataOnSave();
        this.handleEditorialMetadataOnSave();
        this.setState({
            areEditorialMetadataFieldsRequired: false,
            areTerritoryMetadataFieldsRequired: false,
        });
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
                    <EditorialMetadata
                        areFieldsRequired={this.state.areEditorialMetadataFieldsRequired}
                        validSubmit={this.handleOnSave}
                        toggle={this.toggleEditorialMetadata}
                        activeTab={this.state.editorialMetadataActiveTab}
                        addEditorialMetadata={this.addEditorialMetadata}
                        createEditorialTab={CREATE_TAB}
                        handleSubmit={this.handleEditorialMetadataSubmit}
                        editorialMetadata={this.state.editorialMetadata}
                        handleChange={this.handleEditorialMetadataChange}
                        handleTitleChange={this.handleTitleEditorialMetadataChange}
                        handleSynopsisChange={this.handleSynopsisEditorialMetadataChange}
                        handleEditChange={this.handleEditorialMetadataEditChange}
                        isEditMode={this.state.isEditMode}
                        titleContentType={this.state.titleForm.contentType}
                        editorialMetadataForCreate={this.state.editorialMetadataForCreate}
                    />

                    <TerritoryMetadata
                        isLocalRequired={this.state.areTerritoryMetadataFieldsRequired}
                        validSubmit={this.handleOnSave}
                        toggle={this.toggleTerritoryMetadata}
                        activeTab={this.state.territoryMetadataActiveTab}
                        addTerritoryMetadata={this.addTerritoryMetadata}
                        CREATE_TAB={CREATE_TAB}
                        handleSubmit={this.handleTerritoryMetadataSubmit}
                        territory={this.state.territory}
                        handleChange={this.handleTerritoryMetadataChange}
                        handleEditChange={this.handleTerritoryMetadataEditChange}
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