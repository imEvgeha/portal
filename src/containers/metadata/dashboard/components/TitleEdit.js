import React, { Component, Fragment } from 'react';
import t from 'prop-types';
import { BREADCRUMB_METADATA_DASHBOARD_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH, BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH } from '../../../../constants/metadata/metadata-breadcrumb-paths';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';
import EditPage from './EditPage';
import TerritoryMetadata from './territorymetadata/TerritoryMetadata';
import { titleService } from '../../service/TitleService';
import { Button, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import moment from 'moment';
import NexusBreadcrumb from '../../../NexusBreadcrumb';
import EditorialMetadata from './editorialmetadata/EditorialMetadata';
import {EDITORIAL_METADATA_PREFIX, EDITORIAL_METADATA_SYNOPSIS, EDITORIAL_METADATA_TITLE} from '../../../../constants/metadata/metadataComponent';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const CURRENT_TAB = 0;
const CREATE_TAB = 'CREATE_TAB';
const CAST = 'CAST';
const CREW = 'CREW';

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
            editorialMetadataForCreate: {},
            isCastModalOpen: false,
            isCrewModalOpen: false,
            ratingSystem: '',
            ratingValue: '',
            cast: [],
            crew: [],
            castCrewInputValue: '',
            crewInputValue: '',
            advisoriesFreeText: '',
            advisoryCode: ''
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

    handleOnChangeTitleDuration = (duration) => {
        this.setState({
            ...this.state.editedForm,
            duration: duration
        });
    }


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

    handleOnExternalIds = (e) => {
        const newExternalIds = {
            ...this.state.editedForm.externalIds,
            [e.target.name]: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                externalIds: newExternalIds
            }
        });
    }

    addAdvisoryCodes = (advisory) => {
        if(advisory === '') {
            return;
        } else {
            let advisoriesCode = [this.state.advisoryCode];
            if(!this.state.editedForm.advisories) {
                advisoriesCode = [this.state.advisoryCode];
            }else {
                advisoriesCode = [this.state.advisoryCode, ...this.state.editedForm.advisories.advisoriesCode];
            }

            let updatedAdvisory = {
                ...this.state.editedForm.advisories,
                advisoriesCode: advisoriesCode
            };
            let updateEditForm = {
                ...this.state.editedForm,
                advisories: updatedAdvisory
            };
            this.setState({
                editedForm: updateEditForm
            });
        }
    }
    removeAdvisoryCodes = (removeAdvisory) => {
            let advisoriesCode = this.state.editedForm.advisories.advisoriesCode.filter(rating => rating !== removeAdvisory);

            let updatedAdvisory = {
                ...this.state.editedForm.advisories,
                advisoriesCode: advisoriesCode
            };
            let updateEditForm = {
                ...this.state.editedForm,
                advisories: updatedAdvisory
            };
            this.setState({
                editedForm: updateEditForm
            });
    }
    handleOnAdvisoriesCodeUpdate = (value) => {
        if (value === '') {
            return;
        } else {
            this.setState({
                advisoryCode: value
            });
        }
    }

    handleOnAdvisories = (e) => {
        const newAdvisory = {
            ...this.state.editedForm.advisories,
            [e.target.name]: e.target.value
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                advisories: newAdvisory
            }
        });

    }

    readOnly = () => {
        return <TitleReadOnlyMode data={this.state.titleForm} />;
    };

    editMode = () => {
        return <TitleEditMode
            isCastModalOpen={this.state.isCastModalOpen}
            isCrewModalOpen={this.state.isCrewModalOpen}
            renderModal={this.renderModal}
            castCrewInputValue={this.state.castCrewInputValue}
            updateCastCrewValue={this.updateCastCrewValue}
            ratingValue={this.state.ratingValue}
            removeRating={this.removeRating}
            removeCastCrew={this.removeCastCrew}
            ratingSystem={this.state.ratingSystem}
            updateValue={this.updateValue}
            ratings={this.state.editedForm.ratings}
            advisoryCodeList={this.state.editedForm.advisories}
            removeAdvisoryCodes={this.removeAdvisoryCodes}
            addCastCrew={this.addCastCrew}
            handleOnAdvisories={this.handleOnAdvisories}
            handleChangeEpisodic={this.handleChangeEpisodic}
            handleOnExternalIds={this.handleOnExternalIds}
            handleChangeSeries={this.handleChangeSeries}
            keyPressed={this.handleKeyDown}
            _handleKeyPress={this._handleKeyPress}
            _handleAddAdvisoryCode={this._handleAddAdvisoryCode}
            handleOnAdvisoriesCodeUpdate={this.handleOnAdvisoriesCodeUpdate}
            advisoryCode={this.state.advisoryCode}
            data={this.state.titleForm}
            editedTitle={this.state.editedForm}
            episodic={this.state.titleForm.episodic}
            handleOnChangeTitleDuration={this.handleOnChangeTitleDuration}
            handleOnChangeEdit={this.handleOnChangeEdit} />;
    };

    removeBooleanQuotes = (newAdditionalFields, fieldName) => {
        if (newAdditionalFields[fieldName]) {
            if (newAdditionalFields[fieldName] === 'true') {
                newAdditionalFields[fieldName] = true;
            } else if (newAdditionalFields[fieldName] === 'false') {
                newAdditionalFields[fieldName] = false;
            }
        }
    }

    handleTitleOnSave = () => {
        if (this.state.titleForm !== this.state.editedForm) {
            this.setState({
                isLoading: true
            });
            let newAdditionalFields = this.getAdditionalFieldsaWithoutEmptyField();
            this.removeBooleanQuotes(newAdditionalFields, 'seasonPremiere');
            this.removeBooleanQuotes(newAdditionalFields, 'animated');
            this.removeBooleanQuotes(newAdditionalFields, 'seasonFinale');
            titleService.updateTitle(newAdditionalFields).then(() => {
                this.setState({
                    isLoading: false,
                    titleForm: this.state.editedForm,
                    isEditMode: !this.state.isEditMode,
                    territoryMetadataActiveTab: CURRENT_TAB,
                    editorialMetadataActiveTab: CURRENT_TAB
                });

            }).catch(() => {
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
                    areTerritoryMetadataFieldsRequired: false
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

    getAdditionalFieldsaWithoutEmptyField() {
        let additionalFields = {};
        for (let fields in this.state.editedForm) {
            if (fields === 'externalIds') {
                additionalFields[fields] = this.getAdditionalFieldsWithoutEmptyFields(fields);
            }
            else if (fields === 'advisories') {
                additionalFields[fields] = this.getAdditionalFieldsWithoutEmptyFields(fields);
            }
            else if (this.state.editedForm[fields]) {
                additionalFields[fields] = this.state.editedForm[fields];
            } else {
                additionalFields[fields] = null;
            }
        }
        return additionalFields;
    }

    getAdditionalFieldsWithoutEmptyFields(subField) {
        let subObject = {};
        let doAddSubObject = false;
        for (let field in this.state.editedForm[subField]) {
            if (this.state.editedForm[subField][field]) {
                subObject[field] = this.state.editedForm[subField][field];
                doAddSubObject = true;
            } else {
                subField[field] = null;
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

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    /* Title core additional fields */
    renderModal = modalName => {
        this.cleanCastInput();
        if (modalName === CAST) {
            this.setState({
                isCastModalOpen: !this.state.isCastModalOpen
            });
        } else if (modalName === CREW) {
            this.setState({
                isCrewModalOpen: !this.state.isCrewModalOpen
            });
        } else {
            this.setState({
                isCrewModalOpen: false,
                isCastModalOpen: false
            });
        }
    };

    addRating = rating => {
        if (rating === '') {
            return;
        } else {
            let newRatingObject = {
                rating: this.state.ratingValue,
                ratingSystem: this.state.ratingSystem
            };
            let ratingArray = [newRatingObject];
            if(!this.state.editedForm.ratings) {
                ratingArray = [newRatingObject];
            } else {
                ratingArray = [newRatingObject, ...this.state.editedForm.ratings];
            }

            let updateEditForm = {
                ...this.state.editedForm,
                ratings: ratingArray
            };

            this.setState({
                editedForm: updateEditForm
            });


        }

    };

    updateValue = value => {
        if (value === '') return;
        this.setState({
            ratingValue: value
        });
    };

    removeRating = removeRating => {
        let rating = this.state.editedForm.ratings.filter(rating => rating !== removeRating);

        let updateEditForm = {
            ...this.state.editedForm,
            ratings: rating
        };
        this.setState({
            editedForm: updateEditForm
        });

    };

    addCastCrew = (personType) => {
        if (this.state.castCrewInputValue) {
            let newCastObject = {
                displayName: this.state.castCrewInputValue,
                personType: personType
            };
            let castCrewArray = [newCastObject];
            if (!this.state.editedForm.castCrew) {
                castCrewArray = [newCastObject];
            } else {
                castCrewArray = [newCastObject, ...this.state.editedForm.castCrew];
            }

            let updateEditForm = {
                ...this.state.editedForm,
                castCrew: castCrewArray
            };

            this.setState({
                editedForm: updateEditForm
            });
            this.cleanCastInput();
        } else return;
    };

    updateCastCrewValue = value => {
        if (value === '') return;
        this.setState({
            castCrewInputValue: value
        });
    };

    removeCastCrew = removeCastCrew => {
        let cast = this.state.editedForm.castCrew.filter(cast => cast !== removeCastCrew);

        let updateEditForm = {
            ...this.state.editedForm,
            castCrew: cast
        };
        this.setState({
           editedForm: updateEditForm
        });
    };

    cleanCastInput = () => {
        this.setState({
            castCrewInputValue: ''
        });
    }

    _handleKeyPress = e => {
        if (e.keyCode === 13) {
            //Key code for Enter
            this.addRating(this.state.ratingValue);
            this.setState({
                ratingValue: ''
            });
        }
    };

    _handleAddAdvisoryCode = e => {
        if(e.keyCode === 13) {
            this.addAdvisoryCodes(this.state.advisoryCode);
            this.setState({
                advisoryCode: ''
            });
        }
    }

    render() {
        return (
            <EditPage>

                <AvForm id="titleDetail" onValidSubmit={this.handleOnSave} ref={c => (this.form = c)} onKeyPress={this.onKeyPress}>
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
                        createTerritoryTab={CREATE_TAB}
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