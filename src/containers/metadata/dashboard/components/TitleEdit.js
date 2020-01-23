import React, {Component, Fragment} from 'react';
import t from 'prop-types';
import {
    BREADCRUMB_METADATA_DASHBOARD_PATH,
    BREADCRUMB_METADATA_SEARCH_RESULTS_PATH,
    BREADCRUMB_METADATA_TITLE_DETAIL_NO_PATH
} from '../../../../constants/metadata/metadata-breadcrumb-paths';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';
import EditPage from './EditPage';
import TerritoryMetadata from './territorymetadata/TerritoryMetadata';
import {titleService} from '../../service/TitleService';
import {Button, Col, Row} from 'reactstrap';
import {default as AtlaskitButton} from '@atlaskit/button';
import {AvForm} from 'availity-reactstrap-validation';
import moment from 'moment';
import NexusBreadcrumb from '../../../NexusBreadcrumb';
import EditorialMetadata from './editorialmetadata/EditorialMetadata';
import {
    EDITORIAL_METADATA_PREFIX,
    EDITORIAL_METADATA_SYNOPSIS,
    EDITORIAL_METADATA_TITLE
} from '../../../../constants/metadata/metadataComponent';
import {configService} from '../../service/ConfigService';
import {COUNTRY} from '../../../../constants/metadata/constant-variables';
import {Can} from '../../../../ability';
import {CAST, getFilteredCastList, getFilteredCrewList} from '../../../../constants/metadata/configAPI';

const CURRENT_TAB = 0;
const CREATE_TAB = 'CREATE_TAB';

const emptyTerritory = {
    locale: null,
    availAnnounceDate: null,
    theatricalReleaseDate: null,
    homeVideoReleaseDate: null,
    boxOffice: null,
    releaseYear: null,
    estReleaseDate: null,
    originalAirDate: null
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
            titleRankingActiveTab: CURRENT_TAB,
            invalidBoxOffice: false,
            areTerritoryMetadataFieldsRequired: false,
            areEditorialMetadataFieldsRequired: false,
            areRatingFieldsRequired: false,
            titleForm: {},
            editedForm: {},
            territories: {},
            territory: [],
            updatedTerritories: [],
            editorialMetadata: [],
            updatedEditorialMetadata: [],
            editorialMetadataForCreate: {},
            ratingForCreate: {},
            advisoriesCode: null
        };
    }

    componentDidMount() {
        configService.initConfigMapping();
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
            if (titleForm.parentIds) {
                let parent = titleForm.parentIds.find((e) => e.contentType === 'SERIES');
                if (parent) {
                    this.loadParentTitle(parent.id);
                }
            }
        }).catch(() => {
            console.error('Unable to load Title Data');
        });
    }

    loadParentTitle(parentId) {
        titleService.getTitleById(parentId).then((response) => {
            const parentTitleForm = response.data;
            let newEpisodic = Object.assign(this.state.titleForm.episodic, { seriesTitleName: parentTitleForm.title });
            let newTitleForm = Object.assign(this.state.titleForm, { episodic: newEpisodic });
            this.setState({
                titleForm: newTitleForm,
                editedForm: newTitleForm
            });
        }).catch(() => {
            console.error('Unable to load Parent Title Data');
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
        titleService.getEditorialMetadataByTitleId(titleId).then((response) => {
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
        this.setState({
            isEditMode: !this.state.isEditMode,
            territoryMetadataActiveTab: CURRENT_TAB,
            editorialMetadataActiveTab: CURRENT_TAB,
            titleRankingActiveTab: CURRENT_TAB,
            territories: emptyTerritory,
            editorialMetadataForCreate: emptyEditorial,
            updatedEditorialMetadata: []
        });
    };

    handleOnChangeEdit = (e) => {
        const editedForm = {
            ...this.state.editedForm,
            [e.target.name]: e.target.value
        };

        this.setState({
            editedForm: editedForm
        });
    };

    handleOnChangeTitleDuration = (duration) => {
        this.setState({
            ...this.state.editedForm,
            duration: duration
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
    };

    /**
     * Handle LegacyIds objects, where keys are movida, vz {movida: {}, vz:{}}
     * @param legacyId
     */
    handleOnLegacyIds = (legacyId) => {
        let newLegacyIds = { ...this.state.editedForm.legacyIds };
        for (let field in legacyId) {
            let inner = { ...newLegacyIds[field] };
            for (let innerField in legacyId[field]) {
                inner[innerField] = legacyId[field][innerField];
            }
            newLegacyIds[field] = inner;
        }
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                legacyIds: newLegacyIds
            }
        });
    };

    handleRatingCreateChange = (rating) => {
        this.setState({
            ratingForCreate: rating
        });
    };

    handleRatingEditChange = (e, data) => {
        let newRatings = [e];
        if (this.state.editedForm.ratings && this.state.editedForm.ratings.length > 0) {
            let index = this.state.editedForm.ratings.findIndex(e => e.ratingSystem === data.ratingSystem && e.rating === data.rating);
            if (index >= 0) {
                newRatings = this.state.editedForm.ratings.slice();
                newRatings[index] = e;
            } else {
                newRatings = this.state.editedForm.ratings.concat(newRatings);
            }
        }

        this.setState({
            editedForm: {
                ...this.state.editedForm,
                ratings: newRatings
            }
        });
    };

    handleAdvisoryCodeChange = (advisoriesCode) => {
        let newRatingForCreate = {
            ...this.state.ratingForCreate,
            advisoriesCode: advisoriesCode
        };
        this.setState({
            ratingForCreate: newRatingForCreate
        });
    };

    toggleTitleRating = (tab) => {
        this.setState({
            titleRankingActiveTab: tab,
            areRatingFieldsRequired: false
        });
    };

    addTitleRatingTab = (tab) => {
        this.setState({
            titleRankingActiveTab: tab,
            areRatingFieldsRequired: true
        });
    };

    readOnly = () => {
        return <TitleReadOnlyMode data={this.state.titleForm} toggleTitleRating={this.toggleTitleRating} activeTab={this.state.titleRankingActiveTab} />;
    };

    handleAddCharacterName = (id, newData) => {
        let castCrew = this.state.editedForm.castCrew;
        this.state.editedForm.castCrew.splice(id, 1, newData);
        let editedForm = {
            ...this.state.editedForm,
            castCrew
        };
        this.setState({
            editedForm
        });
    }

    handleAddEditorialCharacterName = (id, newData) => {
        let castCrew = this.state.editorialMetadataForCreate.castCrew;
        this.state.editorialMetadataForCreate.castCrew.splice(id, 1, newData);
        let editorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            castCrew
        };

        this.setState({
            editorialMetadataForCreate
        });
    }

    handleAddEditorialCharacterNameEdit = (data, parentId, id, newData) => {
        let edited = this.state.updatedEditorialMetadata.find(e => e.id === parentId);
        if (!edited) {
            edited = JSON.parse(JSON.stringify(data));
        }
        let newCastCrew =  edited.castCrew;
        edited.castCrew.splice(id, 1, newData);
        edited.castCrew = newCastCrew;
        this.updateEditedEditorialMetadata(edited, parentId);
    }

    editMode = () => {
        return <TitleEditMode
            handleAddCharacterName={this.handleAddCharacterName}
            castAndCrewReorder={this.reOrderedCastCrewArray}
            titleRankingActiveTab={this.state.titleRankingActiveTab}
            toggleTitleRating={this.toggleTitleRating}
            addTitleRatingTab={this.addTitleRatingTab}
            areRatingFieldsRequired={this.state.areRatingFieldsRequired}
            createRatingTab={CREATE_TAB}
            handleAdvisoryCodeChange={this.handleAdvisoryCodeChange}
            ratingObjectForCreate={this.state.ratingForCreate}
            handleRatingEditChange={this.handleRatingEditChange}
            handleRatingCreateChange={this.handleRatingCreateChange}

            removeCastCrew={this.removeCastCrew}
            addCastCrew={this.addCastCrew}

            handleChangeEpisodic={this.handleChangeEpisodic}
            handleOnExternalIds={this.handleOnExternalIds}
            handleOnLegacyIds={this.handleOnLegacyIds}
            handleChangeSeries={this.handleChangeSeries}

            keyPressed={this.handleKeyDown}

            data={this.state.titleForm}
            episodic={this.state.titleForm.episodic}
            editedTitle={this.state.editedForm}

            ratings={this.state.editedForm.ratings}

            handleOnChangeTitleDuration={this.handleOnChangeTitleDuration}
            handleOnChangeEdit={this.handleOnChangeEdit}
        />;
    };

    removeBooleanQuotes = (newAdditionalFields, fieldName) => {
        if (newAdditionalFields[fieldName]) {
            if (newAdditionalFields[fieldName] === 'true') {
                newAdditionalFields[fieldName] = true;
            } else if (newAdditionalFields[fieldName] === 'false') {
                newAdditionalFields[fieldName] = false;
            }
        }
    };

    addRatingForCreateIfExist = (newAdditionalFields) => {
        if (Object.keys(this.state.ratingForCreate).length !== 0) {
            let newAdvisoryCodes = [];
            if (this.state.ratingForCreate.advisoriesCode) {
                for (let i = 0; i < this.state.ratingForCreate.advisoriesCode.length; i++) {
                    newAdvisoryCodes.push(this.state.ratingForCreate.advisoriesCode[i]);
                }
            }

            let newRating = JSON.parse(JSON.stringify(this.state.ratingForCreate));
            newRating.advisoriesCode = newAdvisoryCodes;

            if (newAdditionalFields.ratings === null) {
                newAdditionalFields.ratings = [newRating];
            } else {
                newAdditionalFields.ratings.push(newRating);
            }
        }
    }

    titleUpdate = (title, syncToVZ, syncToMovida, switchEditMode) => {
        titleService.updateTitle(title, syncToVZ, syncToMovida).then((response) => {
            this.setState({
                isLoading: false,
                titleForm: response.data,
                editedForm: response.data,
                ratingForCreate: {},
                isEditMode: switchEditMode && !this.state.isEditMode,
                territoryMetadataActiveTab: CURRENT_TAB,
                editorialMetadataActiveTab: CURRENT_TAB,
                titleRankingActiveTab: CURRENT_TAB,
            });
        }).catch(() => {
            console.error('Unable to load Title Data');
        });
    };

    handleTitleOnSave = () => {
        if (this.state.titleForm !== this.state.editedForm || Object.keys(this.state.ratingForCreate).length !== 0) {
            this.setState({
                isLoading: true
            });
            let newAdditionalFields = this.getAdditionalFieldsWithoutEmptyField();
            this.removeBooleanQuotes(newAdditionalFields, 'seasonPremiere');
            this.removeBooleanQuotes(newAdditionalFields, 'animated');
            this.removeBooleanQuotes(newAdditionalFields, 'seasonFinale');

            this.addRatingForCreateIfExist(newAdditionalFields);
            this.titleUpdate(newAdditionalFields);
        } else {
            this.setState({
                isEditMode: !this.state.isEditMode,
                territoryMetadataActiveTab: CURRENT_TAB,
                editorialMetadataActiveTab: CURRENT_TAB,
                titleRankingActiveTab: CURRENT_TAB,
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

    handleTerritoryMetadataEditDateChange = (name, id, value, data) => {
        let edited = this.state.updatedTerritories.find(e => e.id === data.id);
        if (edited) {
            edited[name] = value;
            let newOne = this.state.updatedTerritories.filter((el) => el.id !== data.id);
            newOne.push(edited);
            this.setState({
                updatedTerritories: newOne
            });
        } else {
            edited = Object.assign({}, data);
            edited[name] = value;
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

    handleTerritoryMetadataDateChange = (name, date) => {
        this.setState(prevState => ({
            territories: {
                ...prevState.territories,
                [name]: date,
            }
        }));
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
        //Default value for TerritoryType. COUNTRY
        let newTerritory = {...this.state.territories, territoryType: COUNTRY};
        this.setState({
            territoryMetadataActiveTab: tab,
            areTerritoryMetadataFieldsRequired: true,
            territories: newTerritory
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
                theatricalReleaseDate: t.theatricalReleaseDate || null,
                homeVideoReleaseDate: t.homeVideoReleaseDate || null,
                availAnnounceDate: t.availAnnounceDate || null,
                originalAirDate: t.originalAirDate || null,
                estReleaseDate: t.estReleaseDate || null,
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
            const {territories = {}} = this.state || {};
            const {
                theatricalReleaseDate,
                homeVideoReleaseDate,
                availAnnounceDate,
                originalAirDate,
                estReleaseDate,
            } = territories || {};

            const newTerritory = {
                ...this.state.territories,
                theatricalReleaseDate: theatricalReleaseDate || null,
                homeVideoReleaseDate: homeVideoReleaseDate || null,
                availAnnounceDate: availAnnounceDate || null,
                originalAirDate: originalAirDate || null,
                estReleaseDate: estReleaseDate || null,
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
            edited = JSON.parse(JSON.stringify(data));
        }

        if (isSynopsis) {
            targetName = targetName.replace(EDITORIAL_METADATA_SYNOPSIS, '');
            this.updateEditorialMetadataInnerObject(edited, 'synopsis', targetName, e.target.value);
        } else if (isEditorialTitle) {
            targetName = targetName.replace(EDITORIAL_METADATA_TITLE, '');
            this.updateEditorialMetadataInnerObject(edited, 'title', targetName, e.target.value);
        } else {
            edited[targetName] = e.target.value;
        }

        this.updateEditedEditorialMetadata(edited, data.id);
    };

    handleEditorialMetadataGenreEditChange = (data, genres) => {
        let edited = this.state.updatedEditorialMetadata.find(e => e.id === data.id);
        if (!edited) {
            edited = JSON.parse(JSON.stringify(data));
        }

        edited.genres = genres;

        this.updateEditedEditorialMetadata(edited, data.id);
    };

    updateEditedEditorialMetadata = (edited, id) => {
        let newOne = this.state.updatedEditorialMetadata.filter((el) => el.id !== id);
        newOne.push(edited);
        this.setState({
            updatedEditorialMetadata: newOne
        });
    };

    updateEditorialMetadataInnerObject = (edited, objectName, objectField, objectFieldValue) => {
        if (edited[objectName]) {
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

    handleEditorialMetadataGenreChange = (e) => {
        let newEditorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            genres: e.map(i => { return { id: i.id, genre: i.genre }; })
        };

        this.setState({
            editorialMetadataForCreate: newEditorialMetadataForCreate
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

    handleEditorialCastCrew = (castCrew, originalData) => {
        let edited = this.state.updatedEditorialMetadata.find(e => e.id === originalData.id);
        if (!edited) {
            edited = JSON.parse(JSON.stringify(originalData));
        }
        let newEditorial = {
            ...edited,
            castCrew
        };

        this.updateEditedEditorialMetadata(newEditorial, originalData.id);
    }

    handleEditorialCastCrewCreate = (castCrew, originalData) => {
        let newEditorial = {
            ...originalData,
            castCrew
        };
        this.setState({
            editorialMetadataForCreate: newEditorial
        });
    }

    getEditorialMetadataWithoutEmptyField() {
        let editorial = {};
        for (let editorialField in this.state.editorialMetadataForCreate) {
            if (editorialField === 'title') {
                editorial[editorialField] = this.getEpisodicSubObjectWithoutEmptyFields('title');
            }
            else if (editorialField === 'synopsis') {
                editorial[editorialField] = this.getEpisodicSubObjectWithoutEmptyFields('synopsis');
            }
            else if (this.state.editorialMetadataForCreate[editorialField]) {
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
        for (let field in this.state.editorialMetadataForCreate[subField]) {
            if (this.state.editorialMetadataForCreate[subField][field]) {
                subObject[field] = this.state.editorialMetadataForCreate[subField][field];
                doAddSubObject = true;
            } else {
                subObject[field] = null;
            }
        }

        return doAddSubObject ? subObject : null;
    }

    getAdditionalFieldsWithoutEmptyField() {
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
            areRatingFieldsRequired: false
        });
    };

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    /**
     * Title core additional fields
     */

    addCastCrew = (person) => {
        let castCrewArray = [person];
        if (this.state.editedForm.castCrew) {
            castCrewArray = [...castCrewArray, ...this.state.editedForm.castCrew];
        }

        let updateEditForm = {
            ...this.state.editedForm,
            castCrew: castCrewArray
        };
        this.setState({
            editedForm: updateEditForm
        });
    };

    removeCastCrew = removeCastCrew => {
        let cast = this.state.editedForm.castCrew.filter(cast => {            
            return cast.id !== removeCastCrew.id;
        });
        let updateEditForm = {
            ...this.state.editedForm,
            castCrew: cast
        };
        this.setState({
            editedForm: updateEditForm
        });
    };

    reOrderedCastCrewArray = (orderedArray, type) => {
        let castList;
        let crewList;
        if(type === CAST) {
            crewList = getFilteredCrewList(this.state.editedForm.castCrew, false);
            castList = orderedArray;
        } else {
            castList = getFilteredCastList(this.state.editedForm.castCrew, false);
            crewList = orderedArray;
        }
        
        let castAndCrewList = [...castList, ...crewList];
        let reOrderedCastCrewList = {
            ...this.state.editedForm,
            castCrew: castAndCrewList
        };
        this.setState({
            editedForm: reOrderedCastCrewList
        });
    }

    renderSyncField = (name, titleModifiedAt, id, publishedAt) => {

        const lastUpdated = !publishedAt ? 'No record exist' : titleModifiedAt;
        const buttonName = !id || !publishedAt ? 'Publish' : 'Sync';
        const isDisabled = moment(publishedAt).isBefore(moment(titleModifiedAt));
        const indicator = isDisabled ? 'success' : 'error';
        return (<div className='nexus-c-title-edit__sync-container-field'>
            <span className={'nexus-c-title-edit__sync-indicator nexus-c-title-edit__sync-indicator--' + indicator}/>
            <div className='nexus-c-title-edit__sync-container-field-description'><b>{name}</b> Last updated: {lastUpdated}</div>
            <AtlaskitButton appearance='primary' isDisabled={isDisabled} onClick={() => this.onSyncPublishClick(name)}>{buttonName}</AtlaskitButton>
        </div>);
    };

    onSyncPublishClick = (name) => {
        const syncToVz = name.toLowerCase() === 'vz';
        const syncToMovida = name.toLowerCase() === 'movida';
        this.titleUpdate(this.state.titleForm, syncToVz, syncToMovida, false);
    };

    renderSyncVzMovidaFields = () => {
        const {legacyIds, modifiedAt} = this.state.titleForm;
        const {vz, movida} = legacyIds || {};
        const {vzId} = vz || {};
        const {movidaId} = movida || {};
        const vzPublishedAt = (vz || {}).publishedAt;
        const movidaPublishedAt = (movida || {}).publishedAt;

        return (
            <>
                {this.renderSyncField('VZ', modifiedAt, vzId, vzPublishedAt)}
                {this.renderSyncField('Movida', modifiedAt, movidaId, movidaPublishedAt)}
            </>
        );
    };

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
                                            <div className='nexus-c-title-edit__sync-container'>
                                            {/*{this.renderSyncVzMovidaFields()}*/}
                                            <Can I="update" a="Metadata">
                                                <Button className="float-right" id="btnEdit" onClick={this.handleSwitchMode}>Edit</Button>
                                            </Can>
                                            </div>
                                        </Col>
                                    </Fragment>
                            }
                        </Col>
                    </Row>
                    {
                        this.state.isEditMode ? this.editMode() : this.readOnly()
                    }
                    <EditorialMetadata
                        handleAddEditorialCharacterName={this.handleAddEditorialCharacterName}
                        handleAddEditorialCharacterNameEdit={this.handleAddEditorialCharacterNameEdit}
                        areFieldsRequired={this.state.areEditorialMetadataFieldsRequired}
                        validSubmit={this.handleOnSave}
                        toggle={this.toggleEditorialMetadata}
                        activeTab={this.state.editorialMetadataActiveTab}
                        addEditorialMetadata={this.addEditorialMetadata}
                        createEditorialTab={CREATE_TAB}
                        handleSubmit={this.handleEditorialMetadataSubmit}
                        editorialMetadata={this.state.editorialMetadata}
                        handleChange={this.handleEditorialMetadataChange}
                        handleGenreChange={this.handleEditorialMetadataGenreChange}
                        handleTitleChange={this.handleTitleEditorialMetadataChange}
                        handleSynopsisChange={this.handleSynopsisEditorialMetadataChange}
                        handleEditChange={this.handleEditorialMetadataEditChange}
                        handleGenreEditChange={this.handleEditorialMetadataGenreEditChange}
                        isEditMode={this.state.isEditMode}
                        handleEditorialCastCrew={this.handleEditorialCastCrew}
                        handleEditorialCastCrewCreate={this.handleEditorialCastCrewCreate}
                        titleContentType={this.state.titleForm.contentType}
                        editorialMetadataForCreate={this.state.editorialMetadataForCreate}
                        updatedEditorialMetadata={this.state.updatedEditorialMetadata}
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
                        territories={this.state.territories}
                        handleChange={this.handleTerritoryMetadataChange}
                        handleChangeDate={this.handleTerritoryMetadataDateChange}
                        handleEditChange={this.handleTerritoryMetadataEditChange}
                        handleEditChangeDate={this.handleTerritoryMetadataEditDateChange}
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