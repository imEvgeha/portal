import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {AvForm} from 'availity-reactstrap-validation';
import {Col, Row} from 'reactstrap';
import Button from '@atlaskit/button';
import './TitleEdit.scss';
import TitleReadOnlyMode from './TitleReadOnlyMode';
import TitleEditMode from './TitleEditMode';
import EditPage from './EditPage';
import TerritoryMetadata from './territorymetadata/TerritoryMetadata';
import {titleService} from '../../service/TitleService';
import EditorialMetadata from './editorialmetadata/EditorialMetadata';
import {
    EDITORIAL_METADATA_PREFIX,
    EDITORIAL_METADATA_SYNOPSIS,
    EDITORIAL_METADATA_TITLE,
    EPISODIC_FIELDS
} from '../../../../constants/metadata/metadataComponent';
import {configService} from '../../service/ConfigService';
import {COUNTRY} from '../../../../constants/metadata/constant-variables';
import {Can} from '../../../../../../ability';
import {CAST, getFilteredCastList, getFilteredCrewList} from '../../../../constants/metadata/configAPI';
import {getRepositoryName} from '../../../../../avails/utils';
import TitleSystems from '../../../../constants/metadata/systems';
import PublishVzMovida from './publish/PublishVzMovida';

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
    episodic: null
};

const {MOVIDA, VZ} = TitleSystems;

class TitleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isEditMode: false,
            territoryMetadataActiveTab: CURRENT_TAB,
            editorialMetadataActiveTab: CURRENT_TAB,
            titleRankingActiveTab: CURRENT_TAB,
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
            ratingForCreate: {}
        };
    }

    componentDidMount() {
        configService.initConfigMapping();
        const titleId = this.props.match.params.id;
        this.loadTitle(titleId);
        this.loadTerritoryMetadata(titleId);
        this.loadEditorialMetadata(titleId);
    }

    loadTitle(titleId) {
        titleService.getTitleById(titleId).then((response) => {
            const titleForm = response.data;
            this.setState({ titleForm, editedForm: titleForm });
            this.loadParentTitle(titleForm);
        }).catch(() => {
            console.error('Unable to load Title Data');
        });
    }

    loadParentTitle(titleFormData) {
        if (titleFormData.parentIds) {
            let parent = titleFormData.parentIds.find((e) => e.contentType === 'SERIES');
            if (parent) {
                const parentId = parent.id;
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
        }
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

    handleCategoryOnChangeEdit = (category) => {
        const editedForm = {
            ...this.state.editedForm,
            category: category.map(e => e.value)
        };

        this.setState((state) => {
            const editedForm = {...state.editedForm, category: category.map(e => e.value)};
            return {editedForm};
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
        const newLegacyIds = { ...this.state.editedForm.legacyIds };
        for (const field in legacyId) {
            const inner = { ...newLegacyIds[field] };
            for (const innerField in legacyId[field]) {
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

    handleRatingEditChange = (newValue, prevValue) => {
        let newRatings = [newValue];
        const {editedForm = {}} = this.state;
        const {ratings = []} = editedForm || {};

        if (ratings && ratings.length > 0) {
            // Get index of the rating to be changed if it already exists
            const index = ratings.findIndex(({ratingSystem, rating}) => (
                ratingSystem === prevValue.ratingSystem && rating === prevValue.rating
            ));
            const clonedRatings = ratings.slice();

            if (newValue === null) { // If null is received that means rating should be deleted
                clonedRatings.splice(index, 1);
                newRatings = clonedRatings;
            } else if (index >= 0) { // Apply the newValue of the existing rating
                newRatings = clonedRatings;
                newRatings[index] = newValue;
            } else { // Add new rating
                newRatings = ratings.concat(newRatings);
            }
        }

        this.setState(prevState => ({
            editedForm: {
                ...prevState.editedForm,
                ratings: newRatings
            }
        }));
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
        const castCrew = this.state.editedForm.castCrew;
        this.state.editedForm.castCrew.splice(id, 1, newData);
        const editedForm = {
            ...this.state.editedForm,
            castCrew
        };
        this.setState({
            editedForm
        });
    }

    handleAddEditorialCharacterName = (id, newData) => {
        const castCrew = this.state.editorialMetadataForCreate.castCrew;
        this.state.editorialMetadataForCreate.castCrew.splice(id, 1, newData);
        const editorialMetadataForCreate = {
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
        const newCastCrew =  edited.castCrew;
        edited.castCrew.splice(id, 1, newData);
        edited.castCrew = newCastCrew;
        this.updateEditedEditorialMetadata(edited, parentId);
    }

    editMode = () => {
        return (
            <TitleEditMode
                handleAddCharacterName={this.handleAddCharacterName}
                castAndCrewReorder={this.reOrderedCastCrewArray}
                titleRankingActiveTab={this.state.titleRankingActiveTab}
                toggleTitleRating={this.toggleTitleRating}
                addTitleRatingTab={this.addTitleRatingTab}
                areRatingFieldsRequired={this.state.areRatingFieldsRequired}
                createRatingTab={CREATE_TAB}
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
                handleOnChangeEdit={this.handleOnChangeEdit}
                handleCategoryOnChangeEdit={this.handleCategoryOnChangeEdit}
            />
);
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
            const newAdvisoryCodes = [];
            if (this.state.ratingForCreate.advisoriesCode) {
                for (let i = 0; i < this.state.ratingForCreate.advisoriesCode.length; i++) {
                    newAdvisoryCodes.push(this.state.ratingForCreate.advisoriesCode[i]);
                }
            }

            const newRating = JSON.parse(JSON.stringify(this.state.ratingForCreate));
            newRating.advisoriesCode = newAdvisoryCodes;

            if (newAdditionalFields.ratings === null) {
                newAdditionalFields.ratings = [newRating];
            } else {
                newAdditionalFields.ratings.push(newRating);
            }
        }
    }

    titleUpdate = (title, syncToVZ, syncToMovida, switchEditMode) => {
        return titleService.updateTitle(title, syncToVZ, syncToMovida).then((response) => {
            this.setState({
                titleForm: response.data,
                editedForm: response.data,
                ratingForCreate: {},
                territoryMetadataActiveTab: CURRENT_TAB,
                editorialMetadataActiveTab: CURRENT_TAB,
                titleRankingActiveTab: CURRENT_TAB,
            });

            this.loadParentTitle(response.data);

        }).catch(() => {
            console.error('Unable to load Title Data');
        });
    };

    handleTitleOnSave = () => {
        if (this.state.titleForm !== this.state.editedForm || Object.keys(this.state.ratingForCreate).length !== 0) {
            const newAdditionalFields = this.getAdditionalFieldsWithoutEmptyField();
            this.removeBooleanQuotes(newAdditionalFields, 'seasonPremiere');
            this.removeBooleanQuotes(newAdditionalFields, 'animated');
            this.removeBooleanQuotes(newAdditionalFields, 'seasonFinale');

            this.addRatingForCreateIfExist(newAdditionalFields);
            return this.titleUpdate(newAdditionalFields);
        } else {
            this.setState({
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
            const newOne = this.state.updatedTerritories.filter((el) => el.id !== data.id);
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
            const newOne = this.state.updatedTerritories.filter((el) => el.id !== data.id);
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
        const newTerritory = {...this.state.territories, territoryType: COUNTRY};
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
        const promises = [];
        this.state.updatedTerritories.forEach(t => {
            const dataFormatted = {
                ...t,
                theatricalReleaseDate: t.theatricalReleaseDate || null,
                homeVideoReleaseDate: t.homeVideoReleaseDate || null,
                availAnnounceDate: t.availAnnounceDate || null,
                originalAirDate: t.originalAirDate || null,
                estReleaseDate: t.estReleaseDate || null,
            };
            promises.push(titleService.updateTerritoryMetadata(dataFormatted).then((response) => {
                    const list = [].concat(this.state.territory);
                    const foundIndex = list.findIndex(x => x.id === response.data.id);
                    list[foundIndex] = response.data;
                    this.setState({
                        territory: list
                    });
                }).catch(() => {
                    console.error('Unable to edit Title Data');
                })
            );
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

            promises.push(titleService.addTerritoryMetadata(newTerritory).then((response) => {
                    this.cleanTerritoryMetadata();
                    this.setState({
                        territory: [response.data, ...this.state.territory],
                        territoryMetadataActiveTab: CURRENT_TAB,
                    });
                }).catch(() => {
                    console.error('Unable to add Territory Metadata');
                })
            );
        } else {
            this.cleanTerritoryMetadata();
        }
        return promises;
    };

    /**
     * Editorial Metadata document
     */
    handleEditorialMetadataEditChange = (e, data) => {
        let targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const isSynopsis = targetName.startsWith(EDITORIAL_METADATA_SYNOPSIS);
        const isEditorialTitle = targetName.startsWith(EDITORIAL_METADATA_TITLE);
        const isEpisodic = EPISODIC_FIELDS.includes(targetName);
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
        } else if (isEpisodic){
            this.updateEditorialMetadataInnerObject(edited, 'episodic', targetName, e.target.value);
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

    handleEditorialMetadataCategoryEditChange = (data, category) => {
        let edited = this.state.updatedEditorialMetadata.find(e => e.id === data.id);
        if (!edited) {
            edited = JSON.parse(JSON.stringify(data));
        }

        edited.category = category.map(e => e.value);

        this.updateEditedEditorialMetadata(edited, data.id);
    };

    updateEditedEditorialMetadata = (edited, id) => {
        const newOne = this.state.updatedEditorialMetadata.filter((el) => el.id !== id);
        newOne.push(edited);
        this.setState({
            updatedEditorialMetadata: newOne
        });
    };

    updateEditorialMetadataInnerObject = (edited, objectName, objectField, objectFieldValue) => {
        if (edited[objectName]) {
            edited[objectName][objectField] = objectFieldValue;
        } else {
            const newObject = {};
            newObject[objectField] = objectFieldValue;
            edited[objectName] = newObject;
        }
    };

    handleEditorialMetadataChange = (e) => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                [targetName]: e.target.value
            }
        });
    };

    handleEditorialMetadataGenreChange = (e) => {
        const newEditorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            genres: e.map(i => { return { id: i.id, genre: i.genre }; })
        };

        this.setState({
            editorialMetadataForCreate: newEditorialMetadataForCreate
        });
    };

    handleEditorialMetadataCategoryChange = (category) => {
        const newEditorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            category: category.map(e => e.value)
        };

        this.setState({
            editorialMetadataForCreate: newEditorialMetadataForCreate
        });
    };

    handleSynopsisEditorialMetadataChange = (e) => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
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
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
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

    handleEpisodicEditorialMetadataChange = (e) => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const newEpisodic = {
            ...this.state.editorialMetadataForCreate.episodic,
            [targetName]: e.target.value
        };
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                episodic: newEpisodic
            }
        });
    };

    cleanEditorialMetadata = () => {
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
        const promises = [];
        this.state.updatedEditorialMetadata.forEach(e => {
                promises.push(titleService.updateEditorialMetadata(e).then((response) => {
                    const list = [].concat(this.state.editorialMetadata);
                    const foundIndex = list.findIndex(x => x.id === response.data.id);
                    list[foundIndex] = response.data;
                    this.setState({
                        editorialMetadata: list
                    });
                }).catch(() => {
                    console.error('Unable to edit Editorial Metadata');
                })
            );
        });
        this.setState({
            updatedEditorialMetadata: []
        });

        if (this.state.editorialMetadataForCreate.locale && this.state.editorialMetadataForCreate.language) {
            const newEditorialMetadata = this.getEditorialMetadataWithoutEmptyField();
            newEditorialMetadata.parentId = this.props.match.params.id;
                promises.push(titleService.addEditorialMetadata(newEditorialMetadata).then((response) => {
                    this.cleanEditorialMetadata();
                    this.setState({
                        editorialMetadata: [response.data, ...this.state.editorialMetadata],
                        editorialMetadataActiveTab: CURRENT_TAB
                    });
                }).catch(() => {
                    console.error('Unable to add Editorial Metadata');
                })
            );
        } else {
            this.cleanEditorialMetadata();
        }
        return promises;
    };

    handleEditorialCastCrew = (castCrew, originalData) => {
        let edited = this.state.updatedEditorialMetadata.find(e => e.id === originalData.id);
        if (!edited) {
            edited = JSON.parse(JSON.stringify(originalData));
        }
        const newEditorial = {
            ...edited,
            castCrew
        };

        this.updateEditedEditorialMetadata(newEditorial, originalData.id);
    }

    handleEditorialCastCrewCreate = (castCrew, originalData) => {
        const newEditorial = {
            ...originalData,
            castCrew
        };
        this.setState({
            editorialMetadataForCreate: newEditorial
        });
    }

    getEditorialMetadataWithoutEmptyField() {
        const editorial = {};
        for (const editorialField in this.state.editorialMetadataForCreate) {
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
        const subObject = {};
        let doAddSubObject = false;
        for (const field in this.state.editorialMetadataForCreate[subField]) {
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
        const additionalFields = {};
        for (const fields in this.state.editedForm) {
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
        const subObject = {};
        let doAddSubObject = false;
        for (const field in this.state.editedForm[subField]) {
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
        this.setState({
            isLoading: true
        });

        let promises = [];
        promises.push(this.handleTitleOnSave());
        promises.push( this.handleTerritoryMetadataOnSave());
        promises.push(this.handleEditorialMetadataOnSave());
        promises = promises.filter(item => item).flat();

        Promise.all(promises)
            .then(responses => {
                this.setState({
                    isLoading: false,
                    isEditMode: !this.state.isEditMode,
                    areEditorialMetadataFieldsRequired: false,
                    areTerritoryMetadataFieldsRequired: false,
                    areRatingFieldsRequired: false
                });
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

        const updateEditForm = {
            ...this.state.editedForm,
            castCrew: castCrewArray
        };
        this.setState({
            editedForm: updateEditForm
        });
    };

    removeCastCrew = removeCastCrew => {
        const cast = this.state.editedForm.castCrew.filter(cast => {
            return cast.id !== removeCastCrew.id;
        });
        const updateEditForm = {
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
        
        const castAndCrewList = [...castList, ...crewList];
        const reOrderedCastCrewList = {
            ...this.state.editedForm,
            castCrew: castAndCrewList
        };
        this.setState({
            editedForm: reOrderedCastCrewList
        });
    };

    onSyncPublishClick = (name) => {
        const syncToVz = name === VZ;
        const syncToMovida = name === MOVIDA;
        this.titleUpdate(this.state.titleForm, syncToVz, syncToMovida, false);
    };

    render() {
        const {titleForm, territory, editorialMetadata} = this.state;
        const {id = ''} = titleForm || {};
        return (
            <EditPage>

                <AvForm id="titleDetail" onValidSubmit={this.handleOnSave} onKeyPress={this.onKeyPress}>
                    <Row>
                        <Col className="clearfix" style={{ marginRight: '20px', marginBottom: '10px' }}>
                            {
                                this.state.isEditMode ? (
                                    <>
                                        <Button className="float-right" id="btnSave" isLoading={this.state.isLoading} onClick={this.handleOnSave} appearance="primary">Save</Button>
                                        <Button className="float-right" id="btnCancel" onClick={this.handleSwitchMode} appearance="danger">Cancel</Button>
                                    </>
                                  )
                                    : (
                                        <Col>
                                            <div className='nexus-c-title-edit__sync-container'>
                                                {getRepositoryName(id) === TitleSystems.NEXUS && (
                                                    <>
                                                        <PublishVzMovida
                                                            coreTitle={titleForm}
                                                            editorialMetadataList={editorialMetadata}
                                                            territoryMetadataList={territory}
                                                            onSyncPublishClick={this.onSyncPublishClick}
                                                        />
                                                        <Can I="update" a="Metadata">
                                                            <Button className="float-right" id="btnEdit" onClick={this.handleSwitchMode}>Edit</Button>
                                                        </Can>
                                                    </>
                                                )}
                                            </div>
                                        </Col>
                                  )
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
                        editorialMetadata={editorialMetadata}
                        handleChange={this.handleEditorialMetadataChange}
                        handleGenreChange={this.handleEditorialMetadataGenreChange}
                        handleTitleChange={this.handleTitleEditorialMetadataChange}
                        handleSynopsisChange={this.handleSynopsisEditorialMetadataChange}
                        handleEditChange={this.handleEditorialMetadataEditChange}
                        handleGenreEditChange={this.handleEditorialMetadataGenreEditChange}
                        isEditMode={this.state.isEditMode}
                        handleEditorialCastCrew={this.handleEditorialCastCrew}
                        handleEditorialCastCrewCreate={this.handleEditorialCastCrewCreate}
                        titleContentType={titleForm.contentType}
                        editorialMetadataForCreate={this.state.editorialMetadataForCreate}
                        updatedEditorialMetadata={this.state.updatedEditorialMetadata}
                        handleEpisodicChange={this.handleEpisodicEditorialMetadataChange}
                        handleCategoryChange={this.handleEditorialMetadataCategoryChange}
                        handleCategoryEditChange={this.handleEditorialMetadataCategoryEditChange}
                        coreTitleData={this.state.titleForm}
                        editorialTitleData={this.state.editorialMetadata}
                    />

                    <TerritoryMetadata
                        isLocalRequired={this.state.areTerritoryMetadataFieldsRequired}
                        validSubmit={this.handleOnSave}
                        toggle={this.toggleTerritoryMetadata}
                        activeTab={this.state.territoryMetadataActiveTab}
                        addTerritoryMetadata={this.addTerritoryMetadata}
                        createTerritoryTab={CREATE_TAB}
                        handleSubmit={this.handleTerritoryMetadataSubmit}
                        territory={territory}
                        territories={this.state.territories}
                        handleChange={this.handleTerritoryMetadataChange}
                        handleChangeDate={this.handleTerritoryMetadataDateChange}
                        handleEditChange={this.handleTerritoryMetadataEditChange}
                        handleEditChangeDate={this.handleTerritoryMetadataEditDateChange}
                        isEditMode={this.state.isEditMode}
                    />
                </AvForm>
            </EditPage>
        );
    }
}

TitleEdit.propTypes = {
    match: PropTypes.object.isRequired
};

export default TitleEdit;
