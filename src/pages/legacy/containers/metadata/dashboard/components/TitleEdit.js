import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {get, cloneDeep} from 'lodash';
import {AvForm} from 'availity-reactstrap-validation';
import {Col, Label, Row} from 'reactstrap';
import Button from '@atlaskit/button';
import Flag, {FlagGroup} from '@atlaskit/flag';
import {colors} from '@atlaskit/theme';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import {
    SUCCESS_ICON,
    WARNING_ICON,
    ERROR_ICON,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
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
    EPISODIC_FIELDS,
} from '../../../../constants/metadata/metadataComponent';
import {configService} from '../../service/ConfigService';
import {COUNTRY} from '../../../../constants/metadata/constant-variables';
import {Can} from '@vubiquity-nexus/portal-utils/lib/ability';
import {CAST, getFilteredCastList, getFilteredCrewList} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {getRepositoryName} from '../../../../../avails/utils';
import TitleSystems from '../../../../constants/metadata/systems';
import PublishVzMovida from './publish/PublishVzMovida';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {isNexusTitle} from './utils/utils';
import {publisherService} from '../../service/PublisherService';
import {SYNC} from './publish/PublishConstants';

const ICONS = {
    SUCCESS_ICON: <Tick label={`${SUCCESS_ICON} icon`} primaryColor={colors.G300} />,
    ERROR_ICON: <Error label={`${ERROR_ICON} icon`} primaryColor={colors.R300} />,
};

const CURRENT_TAB = 0;
const CREATE_TAB = 'CREATE_TAB';

const TITLE_VALIDATION_ERROR = 'Title cannot be empty';
const YEAR_VALIDATION_ERROR = 'Release year cannot be empty';

const emptyTerritory = {
    locale: null,
    availAnnounceDate: null,
    theatricalReleaseDate: null,
    homeVideoReleaseDate: null,
    boxOffice: null,
    releaseYear: null,
    estReleaseDate: null,
    originalAirDate: null,
    metadataStatus: null,
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
    episodic: null,
    metadataStatus: null,
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
            prevTerritories: [],
            updatedTerritories: [],
            editorialMetadata: [],
            prevEditorialMetadata: [],
            updatedEditorialMetadata: [],
            editorialMetadataForCreate: {},
            editorialMetadataForCreateAutoDecorate: false,
            ratingForCreate: {},
            externalIDs: null,
            validationErrors: new Set(),
            isSyncingVZ: false,
            isSyncingMovida: false,
            flags: [],
            titleError: false,
            isPublishingVZ: false,
            isPublishingMovida: false,
        };
    }

    componentDidMount() {
        configService.initConfigMapping();
        const titleId = this.props.match.params.id;
        this.loadTitle(titleId);
        this.loadExternalIds(titleId);
        this.loadTerritoryMetadata(titleId);
        this.loadEditorialMetadata();
    }

    loadTitle(titleId) {
        titleService
            .getTitleById(titleId)
            .then(response => {
                const titleForm = response;
                this.setState({titleForm, editedForm: titleForm, titleError: false});
                this.loadParentTitle(titleForm);
            })
            .catch(() => {
                console.error('Unable to load Title Data');
                this.setState({titleError: true});
            });
    }

    loadExternalIds(titleId, titleSystem = null, isSync = false) {
        isNexusTitle(titleId) &&
            publisherService
                .getExternalIds(titleId)
                .then(response => {
                    this.setState(
                        {
                            externalIDs: response,
                        },
                        () => {
                            if (titleSystem) {
                                isSync ? this.checkSyncResult(titleSystem) : this.checkPublishResult(titleSystem);
                            }
                        }
                    );
                })
                .catch(() => {
                    console.error('Unable to load Extrernal IDs data');
                });
    }

    loadParentTitle(titleFormData) {
        if (titleFormData.parentIds) {
            let parent = titleFormData.parentIds.find(e => e.contentType === 'SERIES');
            if (parent) {
                const parentId = parent.id;
                titleService
                    .getTitleById(parentId)
                    .then(response => {
                        const parentTitleForm = response;
                        let newEpisodic = Object.assign(this.state.titleForm.episodic, {
                            seriesTitleName: parentTitleForm.title,
                        });
                        let newTitleForm = Object.assign(this.state.titleForm, {episodic: newEpisodic});
                        this.setState({
                            titleForm: newTitleForm,
                            editedForm: newTitleForm,
                        });
                    })
                    .catch(() => {
                        console.error('Unable to load Parent Title Data');
                    });
            }
        }
    }

    loadTerritoryMetadata(titleId) {
        titleService
            .getTerritoryMetadataById(titleId)
            .then(response => {
                const territoryMetadata = response;
                this.setState({
                    territory: territoryMetadata,
                    prevTerritories: territoryMetadata,
                });
            })
            .catch(() => {
                console.error('Unable to load Territory Metadata');
            });
    }

    loadEditorialMetadata() {
        const titleId = this.props.match.params.id;
        titleService
            .getEditorialMetadataByTitleId(titleId)
            .then(response => {
                const editorialMetadata = response;
                this.setState({
                    editorialMetadata: editorialMetadata,
                    prevEditorialMetadata: editorialMetadata,
                });
            })
            .catch(() => {
                console.error('Unable to load Editorial Metadata');
            });
    }

    handleKeyDown = e => {
        if (e.keyCode === 27) {
            //Key code for Escape
            this.setState({
                isEditMode: false,
            });
        }
    };

    /**
     * Title document
     */
    handleSwitchMode = () => {
        this.setState(prevState => ({
            isEditMode: !prevState.isEditMode,
            editedForm: prevState.titleForm,
            territoryMetadataActiveTab: CURRENT_TAB,
            editorialMetadataActiveTab: CURRENT_TAB,
            titleRankingActiveTab: CURRENT_TAB,
            territories: emptyTerritory,
            editorialMetadataForCreate: emptyEditorial,
            updatedEditorialMetadata: [],
            updatedTerritories: [],
            editorialMetadata: prevState.prevEditorialMetadata,
            territory: prevState.prevTerritories,
        }));
    };

    setValidationError = (msg, action) => {
        let newErrorSet = new Set(this.state.validationErrors);
        if (action === 'push' && !newErrorSet.has(msg)) {
            newErrorSet.add(msg);
            this.setState({validationErrors: newErrorSet});
        } else if (action === 'pop') {
            if (newErrorSet.delete(msg)) {
                this.setState({validationErrors: newErrorSet});
            }
        }
    };

    handleOnChangeEdit = e => {
        if (e.target.name === 'title') {
            if (e.target.value === '') {
                this.setValidationError(TITLE_VALIDATION_ERROR, 'push');
            } else {
                this.setValidationError(TITLE_VALIDATION_ERROR, 'pop');
            }
        } else if (e.target.name === 'releaseYear') {
            if (e.target.value === '') {
                this.setValidationError(YEAR_VALIDATION_ERROR, 'push');
            } else {
                this.setValidationError(YEAR_VALIDATION_ERROR, 'pop');
            }
        }
        const editedForm = {
            ...this.state.editedForm,
            [e.target.name]: e.target.value,
        };

        this.setState({
            editedForm,
        });
    };

    handleCategoryOnChangeEdit = category => {
        const editedForm = {
            ...this.state.editedForm,
            category: category.map(e => e.value),
        };

        this.setState(state => {
            const editedForm = {...state.editedForm, category: category.map(e => e.value)};
            return {editedForm};
        });
    };

    handleLicensorsOnChange = licensors => {
        this.setState(prevState => ({
            editedForm: {...prevState.editedForm, licensors},
        }));
    };

    handleChangeSeries = e => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            seriesTitleName: e.target.value,
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic,
            },
        });
    };

    handleChangeEpisodic = e => {
        const newEpisodic = {
            ...this.state.editedForm.episodic,
            [e.target.name]: e.target.value,
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                episodic: newEpisodic,
            },
        });
    };

    handleOnExternalIds = e => {
        const newExternalIds = {
            ...this.state.editedForm.externalIds,
            [e.target.name]: e.target.value,
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                externalIds: newExternalIds,
            },
        });
    };

    handleOnMsvIds = data => {
        const newExternalIds = {
            ...this.state.editedForm.externalIds,
            msvAssociationId: data,
        };
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                externalIds: newExternalIds,
            },
        });
    };

    /**
     * Handle LegacyIds objects, where keys are movida, vz {movida: {}, vz:{}}
     * @param legacyId
     */
    handleOnLegacyIds = legacyId => {
        const newLegacyIds = {...this.state.editedForm.legacyIds};
        for (const field in legacyId) {
            const inner = {...newLegacyIds[field]};
            for (const innerField in legacyId[field]) {
                inner[innerField] = legacyId[field][innerField];
            }
            newLegacyIds[field] = inner;
        }
        this.setState({
            editedForm: {
                ...this.state.editedForm,
                legacyIds: newLegacyIds,
            },
        });
    };

    handleRatingCreateChange = rating => {
        this.setState({
            ratingForCreate: rating,
        });
    };

    handleRatingEditChange = (newValue, prevValue) => {
        let newRatings = [newValue];
        const {editedForm = {}} = this.state;
        const {ratings = []} = editedForm || {};

        if (ratings && ratings.length > 0) {
            // Get index of the rating to be changed if it already exists
            const index = ratings.findIndex(
                ({ratingSystem, rating}) => ratingSystem === prevValue.ratingSystem && rating === prevValue.rating
            );
            const clonedRatings = ratings.slice();

            if (newValue === null) {
                // If null is received that means rating should be deleted
                clonedRatings.splice(index, 1);
                newRatings = clonedRatings;
            } else if (index >= 0) {
                // Apply the newValue of the existing rating
                newRatings = clonedRatings;
                newRatings[index] = newValue;
            } else {
                // Add new rating
                newRatings = ratings.concat(newRatings);
            }
        }

        this.setState(prevState => ({
            editedForm: {
                ...prevState.editedForm,
                ratings: newRatings,
            },
        }));
    };

    toggleTitleRating = tab => {
        this.setState({
            titleRankingActiveTab: tab,
            areRatingFieldsRequired: false,
        });
    };

    addTitleRatingTab = tab => {
        this.setState({
            titleRankingActiveTab: tab,
            areRatingFieldsRequired: true,
        });
    };

    readOnly = () => {
        return (
            <TitleReadOnlyMode
                data={this.state.titleForm}
                toggleTitleRating={this.toggleTitleRating}
                activeTab={this.state.titleRankingActiveTab}
                externalIDs={this.state.externalIDs}
            />
        );
    };

    handleAddCharacterName = (id, newData) => {
        const castCrew = this.state.editedForm.castCrew;
        this.state.editedForm.castCrew.splice(id, 1, newData);
        const editedForm = {
            ...this.state.editedForm,
            castCrew,
        };
        this.setState({
            editedForm,
        });
    };

    handleAddEditorialCharacterName = (id, newData) => {
        const castCrew = this.state.editorialMetadataForCreate.castCrew;
        this.state.editorialMetadataForCreate.castCrew.splice(id, 1, newData);
        const editorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            castCrew,
        };

        this.setState({
            editorialMetadataForCreate,
        });
    };

    handleAddEditorialCharacterNameEdit = (data, parentId, id, newData) => {
        let edited = this.state.updatedEditorialMetadata.find(e => e.id === parentId);
        if (!edited) {
            edited = JSON.parse(JSON.stringify(data));
        }
        const newCastCrew = edited.castCrew;
        edited.castCrew.splice(id, 1, newData);
        edited.castCrew = newCastCrew;
        this.updateEditedEditorialMetadata(edited, parentId);
    };

    editMode = () => {
        return (
            <TitleEditMode
                externalIDs={this.state.externalIDs}
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
                handleOnMsvIds={this.handleOnMsvIds}
                handleChangeSeries={this.handleChangeSeries}
                keyPressed={this.handleKeyDown}
                data={this.state.titleForm}
                episodic={this.state.titleForm.episodic}
                editedTitle={this.state.editedForm}
                ratings={this.state.editedForm.ratings}
                handleOnChangeEdit={this.handleOnChangeEdit}
                handleCategoryOnChangeEdit={this.handleCategoryOnChangeEdit}
                setValidationError={this.setValidationError}
                handleLicensorsOnChange={this.handleLicensorsOnChange}
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

    addRatingForCreateIfExist = newAdditionalFields => {
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
    };

    titleUpdate = (title, syncToVZ, syncToMovida, switchEditMode) => {
        return titleService
            .updateTitle(title, syncToVZ, syncToMovida)
            .then(response => {
                this.setState({
                    titleForm: response,
                    editedForm: response,
                    ratingForCreate: {},
                    territoryMetadataActiveTab: CURRENT_TAB,
                    editorialMetadataActiveTab: CURRENT_TAB,
                    titleRankingActiveTab: CURRENT_TAB,
                });

                this.loadParentTitle(response);
                return true;
            })
            .catch(() => {
                console.error('Unable to load Title Data');
                return false;
            });
    };

    handleToastDismiss = id => {
        if (this.state.flags && this.state.flags[0].props.id === id) {
            this.setState(prevState => {
                return {
                    flags: prevState.flags.slice(1),
                };
            });
        }
    };

    addToastToFlags = isSuccess => {
        const icon = isSuccess ? ICONS.SUCCESS_ICON : ICONS.ERROR_ICON;
        const label = isSuccess ? 'Sync Title Success' : 'Sync Title Failed';
        const uniqueId = Date.now();
        this.setState(prevState => {
            const updatedFlags = prevState.flags.slice();
            updatedFlags.push(<Flag id={uniqueId} key={uniqueId} title={label} icon={icon} />);
            return {
                flags: updatedFlags,
            };
        });
        setTimeout(() => {
            this.setState(prevState => {
                const id = prevState.flags.length > 0 ? prevState.flags[0].props.id : null;
                const updatedFlags = id === uniqueId ? prevState.flags.slice(1) : prevState.flags;
                return {
                    flags: updatedFlags,
                };
            });
        }, 3000);
    };

    checkSyncResult = titleSystem => {
        this.state.externalIDs.forEach(externalId => {
            if (externalId.externalSystem === titleSystem) {
                get(externalId, 'errors.length', 0) === 0 ? this.addToastToFlags(true) : this.addToastToFlags(false);
            }
        });
    };

    checkPublishResult = titleSystem => {
        this.state.externalIDs.forEach(externalId => {
            if (externalId.externalSystem === titleSystem) {
                get(externalId, 'errors.length', 0) === 0
                    ? this.props.addToast({
                          title: 'Publish Title Success',
                          icon: SUCCESS_ICON,
                          isWithOverlay: false,
                      })
                    : this.props.addToast({
                          title: 'Publish Title Failed',
                          icon: ERROR_ICON,
                          isWithOverlay: false,
                      });
            }
        });
    };

    titleSync = (titleId, syncToVZ, syncToMovida) => {
        const syncProp = syncToVZ ? 'isSyncingVZ' : 'isSyncingMovida';
        return publisherService
            .syncTitle(titleId, syncToVZ, syncToMovida)
            .then(response => {
                const titleSystem = syncToVZ ? 'vz' : 'movida';
                this.loadExternalIds(titleId, titleSystem, true);
                this.setState({
                    [syncProp]: false,
                });
                return true;
            })
            .catch(() => {
                this.setState({
                    [syncProp]: false,
                });
                this.addToastToFlags(false);
                return false;
            });
    };

    titlePublish = (titleId, syncToVZ, syncToMovida, publishProp) => {
        return publisherService
            .registerTitle(titleId, syncToVZ, syncToMovida)
            .then(response => {
                const titleSystem = publishProp.includes('VZ') ? 'vz' : 'movida';
                this.loadExternalIds(titleId, titleSystem, false);
                publishProp &&
                    this.setState({
                        [publishProp]: false,
                    });
                return true;
            })
            .catch(() => {
                this.props.addToast({
                    title: 'Publish Title Failed',
                    icon: ERROR_ICON,
                    isWithOverlay: false,
                });
                publishProp &&
                    this.setState({
                        [publishProp]: false,
                    });
                return false;
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
            const newOne = this.state.updatedTerritories.filter(el => el.id !== data.id);
            newOne.push(edited);
            this.setState({
                updatedTerritories: newOne,
            });
        } else {
            edited = Object.assign({}, data);
            edited[e.target.name] = e.target.value;
            this.setState({
                updatedTerritories: [edited, ...this.state.updatedTerritories],
            });
        }
    };

    handleTerritoryMetadataEditDateChange = (name, id, value, data) => {
        let edited = this.state.updatedTerritories.find(e => e.id === data.id);
        if (edited) {
            edited[name] = value;
            const newOne = this.state.updatedTerritories.filter(el => el.id !== data.id);
            newOne.push(edited);
            this.setState({
                updatedTerritories: newOne,
            });
        } else {
            edited = Object.assign({}, data);
            edited[name] = value;
            this.setState({
                updatedTerritories: [edited, ...this.state.updatedTerritories],
            });
        }
    };

    handleTerritoryMetadataChange = e => {
        this.setState({
            territories: {
                ...this.state.territories,
                [e.target.name]: e.target.value,
            },
        });
    };

    handleTerritoryMetadataStatusChange = value => {
        this.setState(prevState => ({
            territories: {
                ...prevState.territories,
                metadataStatus: value.value,
            },
        }));
    };

    handleTerritoryMetadataDateChange = (name, date) => {
        this.setState(prevState => ({
            territories: {
                ...prevState.territories,
                [name]: date,
            },
        }));
    };

    cleanTerritoryMetadata = () => {
        this.setState({
            territories: emptyTerritory,
        });
    };

    toggleTerritoryMetadata = tab => {
        this.setState({
            territoryMetadataActiveTab: tab,
            areTerritoryMetadataFieldsRequired: false,
        });
    };

    addTerritoryMetadata = tab => {
        //Default value for TerritoryType. COUNTRY
        const newTerritory = {...this.state.territories, territoryType: COUNTRY};
        this.setState({
            territoryMetadataActiveTab: tab,
            areTerritoryMetadataFieldsRequired: true,
            territories: newTerritory,
        });
    };

    handleTerritoryMetadataSubmit = () => {
        this.setState({
            territoryMetadataActiveTab: CURRENT_TAB,
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
            promises.push(
                titleService
                    .updateTerritoryMetadata(dataFormatted)
                    .then(response => {
                        const list = [].concat(this.state.territory);
                        const foundIndex = list.findIndex(x => x.id === response.id);
                        list[foundIndex] = response;

                        // Filter out deleted territories
                        const appliedTerritories = list.filter(({metadataStatus}) => metadataStatus !== 'deleted');

                        this.setState({
                            territory: appliedTerritories,
                            prevTerritories: appliedTerritories,
                        });
                        return true;
                    })
                    .catch(() => {
                        console.error('Unable to edit Title Data');
                        return false;
                    })
            );
        });
        this.setState({
            updatedTerritories: [],
        });

        if (this.state.territories.locale) {
            const {territories = {}} = this.state || {};
            const {theatricalReleaseDate, homeVideoReleaseDate, availAnnounceDate, originalAirDate, estReleaseDate} =
                territories || {};

            const newTerritory = {
                ...this.state.territories,
                theatricalReleaseDate: theatricalReleaseDate || null,
                homeVideoReleaseDate: homeVideoReleaseDate || null,
                availAnnounceDate: availAnnounceDate || null,
                originalAirDate: originalAirDate || null,
                estReleaseDate: estReleaseDate || null,
                parentId: this.props.match.params.id,
            };

            promises.push(
                titleService
                    .addTerritoryMetadata(newTerritory)
                    .then(response => {
                        this.cleanTerritoryMetadata();
                        this.setState({
                            territory: [response, ...this.state.territory],
                            prevTerritories: [response, ...this.state.territory],
                            territoryMetadataActiveTab: CURRENT_TAB,
                        });
                        return true;
                    })
                    .catch(() => {
                        console.error('Unable to add Territory Metadata');
                        return false;
                    })
            );
        } else {
            this.cleanTerritoryMetadata();
        }
        return promises;
    };

    /* delete Territory metadata */
    handleTerritoryMetaDataDelete = id => {
        let toBeDeleted = this.state.territory.find(e => e.id === id);
        if (toBeDeleted) {
            let newData = this.state.territory.filter(e => e.id !== id);
            toBeDeleted.metadataStatus = 'deleted';
            this.setState({
                territory: newData,
                territoryMetadataActiveTab: CURRENT_TAB,
                updatedTerritories: [toBeDeleted, ...this.state.updatedTerritories],
            });
        }
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
        } else if (isEpisodic) {
            this.updateEditorialMetadataInnerObject(edited, 'episodic', targetName, e.target.value);
        } else {
            edited[targetName] = e.target.value || null;
        }

        this.updateEditedEditorialMetadata(edited, data.id);
    };

    /* delete editorial metadata */
    handleEditorialMetaDataDelete = id => {
        let toBeDeleted = this.state.editorialMetadata.find(e => e.id === id);
        if (toBeDeleted) {
            let newData = this.state.editorialMetadata.filter(e => e.id !== id);
            this.setState({
                editorialMetadata: newData,
                editorialMetadataActiveTab: CURRENT_TAB,
            });
            toBeDeleted.metadataStatus = 'deleted';
            this.updateEditedEditorialMetadata(toBeDeleted, id);
        }
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
        const newOne = this.state.updatedEditorialMetadata.filter(el => el.id !== id);
        newOne.push(edited);
        this.setState({
            updatedEditorialMetadata: newOne,
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

    handleEditorialMetadataChange = e => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                [targetName]: e.target.value,
            },
        });
    };

    handleEditorialMetadataAutoDecorateChange = e => {
        this.setState({
            editorialMetadataForCreateAutoDecorate: e.target.checked,
        });
    };

    handleEditorialMetadataGenreChange = e => {
        const newEditorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            genres: e.map(i => {
                return {id: i.id, genre: i.genre};
            }),
        };
        this.setState({
            editorialMetadataForCreate: newEditorialMetadataForCreate,
        });
    };

    handleEditorialMetadataCategoryChange = category => {
        const newEditorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            category: category.map(e => e.value),
        };
        this.setState({
            editorialMetadataForCreate: newEditorialMetadataForCreate,
        });
    };

    handleSynopsisEditorialMetadataChange = e => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const newSynopsis = {
            ...this.state.editorialMetadataForCreate.synopsis,
            [targetName]: e.target.value,
        };
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                synopsis: newSynopsis,
            },
        });
    };

    handleTitleEditorialMetadataChange = e => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const newTitle = {
            ...this.state.editorialMetadataForCreate.title,
            [targetName]: e.target.value,
        };
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                title: newTitle,
            },
        });
    };

    handleEpisodicEditorialMetadataChange = e => {
        const targetName = e.target.name.replace(EDITORIAL_METADATA_PREFIX, '');
        const newEpisodic = {
            ...this.state.editorialMetadataForCreate.episodic,
            [targetName]: e.target.value,
        };
        this.setState({
            editorialMetadataForCreate: {
                ...this.state.editorialMetadataForCreate,
                episodic: newEpisodic,
            },
        });
    };

    handleEditorialMetadataStatusChange = value => {
        const newEditorialMetadataForCreate = {
            ...this.state.editorialMetadataForCreate,
            metadataStatus: value.value,
        };
        this.setState({
            editorialMetadataForCreate: newEditorialMetadataForCreate,
        });
    };

    handleUpdatingEditorialMetadataStatus = (value, data) => {
        const newOne = this.state.updatedEditorialMetadata.filter(el => el.id !== data.id);
        newOne.push({
            ...data,
            metadataStatus: value.value,
        });
        this.setState({
            updatedEditorialMetadata: newOne || [],
        });
    };

    cleanEditorialMetadata = () => {
        this.setState({
            editorialMetadataForCreate: emptyEditorial,
            editorialMetadataForCreateAutoDecorate: false,
        });
    };

    cleanField = field => {
        let updatedEditorialMetadata = this.state.editorialMetadataForCreate;
        updatedEditorialMetadata[field] = null;

        this.setState({
            editorialMetadataForCreate: updatedEditorialMetadata,
        });
    };

    toggleEditorialMetadata = tab => {
        this.setState({
            editorialMetadataActiveTab: tab,
            areEditorialMetadataFieldsRequired: false,
        });
    };

    addEditorialMetadata = tab => {
        this.setState({
            editorialMetadataActiveTab: tab,
            areEditorialMetadataFieldsRequired: true,
        });
    };

    handleEditorialMetadataSubmit = () => {
        this.setState({
            editorialMetadataActiveTab: CURRENT_TAB,
        });
    };

    getNewCreatedEditorialMetadata = newEditorialMetadata => {
        if (newEditorialMetadata.category) {
            newEditorialMetadata.category = this.getCategoryField(newEditorialMetadata.category);
        }
        return [
            {
                itemIndex: '1',
                body: {
                    editorialMetadata: newEditorialMetadata,
                    decorateEditorialMetadata: this.state.editorialMetadataForCreateAutoDecorate,
                },
            },
        ];
    };

    getUpdatedEditorialMetadata = () => {
        return this.state.updatedEditorialMetadata.map(e => {
            const body = e;
            if (body.category) {
                body.category = this.getCategoryField(body.category);
            }
            return {
                itemIndex: null,
                body,
            };
        });
    };

    handleRegenerateDecoratedMetadata = () => {
        const {editorialMetadata} = this.state;

        // Find the master/parent EMet for which to regenerate metadata
        const masterEmet = editorialMetadata.find(({hasGeneratedChildren}, index) => {
            return hasGeneratedChildren && editorialMetadata[index];
        });

        // Calls the API to update decorated EMets based on the master
        titleService.regenerateAutoDecoratedMetadata(masterEmet.id).then(response => {
            this.loadEditorialMetadata();
            const failed = get(response, ['data', '0', 'response', 'failed'], []);
            const {addToast} = this.props;

            // If some EMets failed to regenerate/update, toast the error messages
            if (failed.length) {
                const message = failed.map(e => e.description).join(' ');
                addToast({
                    title: 'Regenerating Editorial Metadata Failed',
                    description: message,
                    icon: WARNING_ICON,
                    isWithOverlay: true,
                });
                return false;
            } else {
                addToast({
                    title: 'Success',
                    description: 'Editorial Metadata Successfully Regenerated!',
                    icon: SUCCESS_ICON,
                    isWithOverlay: true,
                    isAutoDismiss: true,
                });
                return true;
            }
        });
    };

    handleEditorialMetadataOnSave = () => {
        const autoDecorate = this.state.editorialMetadataForCreate && this.state.editorialMetadataForCreateAutoDecorate;
        {
            autoDecorate &&
                this.props.addToast({
                    title: 'Creating Decorated Records',
                    icon: WARNING_ICON,
                    isWithOverlay: false,
                });
        }
        const promises = [];
        this.state.updatedEditorialMetadata &&
            this.state.updatedEditorialMetadata.length > 0 &&
            promises.push(
                titleService
                    .updateEditorialMetadata(this.getUpdatedEditorialMetadata())
                    .then(response => {
                        this.loadEditorialMetadata();
                        if (response[0].response.failed && response[0].response.failed.length > 0) {
                            const message = response[0].response.failed.map(e => e.description).join(' ');
                            this.props.addToast({
                                title: 'Update Editorial Metadata Failed',
                                description: message,
                                icon: WARNING_ICON,
                                isWithOverlay: true,
                            });
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .catch(() => {
                        console.error('Unable to edit Editorial Metadata');
                        return false;
                    })
            );
        this.setState({
            updatedEditorialMetadata: [],
        });

        if (
            this.state.editorialMetadataForCreate.locale &&
            this.state.editorialMetadataForCreate.language &&
            this.state.editorialMetadataForCreate.metadataStatus
        ) {
            const newEditorialMetadata = this.getEditorialMetadataWithoutEmptyField();
            newEditorialMetadata.parentId = this.props.match.params.id;
            promises.push(
                titleService
                    .addEditorialMetadata(this.getNewCreatedEditorialMetadata(newEditorialMetadata))
                    .then(response => {
                        this.cleanEditorialMetadata();
                        this.setState({
                            editorialMetadata: [response, ...this.state.editorialMetadata],
                            prevEditorialMetadata: [response, ...this.state.editorialMetadata],
                            editorialMetadataActiveTab: CURRENT_TAB,
                        });
                        this.loadEditorialMetadata();
                        if (response[0].response.failed && response[0].response.failed.length > 0) {
                            const message = response[0].response.failed.map(e => e.description).join(' ');
                            this.props.addToast({
                                title: 'Create Editorial Metadata Failed',
                                description: message,
                                icon: WARNING_ICON,
                                isWithOverlay: true,
                            });
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .catch(() => {
                        console.error('Unable to add Editorial Metadata');
                        return false;
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
            castCrew,
        };

        this.updateEditedEditorialMetadata(newEditorial, originalData.id);
    };

    handleEditorialCastCrewCreate = (castCrew, originalData) => {
        const newEditorial = {
            ...originalData,
            castCrew,
        };
        this.setState({
            editorialMetadataForCreate: newEditorial,
        });
    };

    getEditorialMetadataWithoutEmptyField() {
        const editorial = {};
        for (const editorialField in this.state.editorialMetadataForCreate) {
            if (editorialField === 'title') {
                editorial[editorialField] = this.getEpisodicSubObjectWithoutEmptyFields('title');
            } else if (editorialField === 'synopsis') {
                editorial[editorialField] = this.getEpisodicSubObjectWithoutEmptyFields('synopsis');
            } else if (this.state.editorialMetadataForCreate[editorialField]) {
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

    getCategoryField(categories) {
        return categories
            ? categories.map((x, index) => {
                  return x && x.name
                      ? x
                      : {
                            name: x,
                            order: index,
                        };
              })
            : [];
    }

    getAdditionalFieldsWithoutEmptyField() {
        const additionalFields = {};
        for (const fields in this.state.editedForm) {
            if (fields === 'externalIds') {
                additionalFields[fields] = this.getAdditionalFieldsWithoutEmptyFields(fields);
            } else if (fields === 'advisories') {
                additionalFields[fields] = this.getAdditionalFieldsWithoutEmptyFields(fields);
            } else if (fields === 'category') {
                additionalFields[fields] = this.getCategoryField(this.state.editedForm[fields]);
            } else if (this.state.editedForm[fields]) {
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
            isLoading: true,
        });

        let promises = [];
        promises.push(this.handleTitleOnSave());
        promises.push(this.handleTerritoryMetadataOnSave());
        promises.push(this.handleEditorialMetadataOnSave());
        promises = promises.filter(item => item).flat();

        Promise.all(promises).then(responses => {
            //if all promises completed successfully (all true, no false in array)
            if (responses.find(val => val === false) === undefined) {
                this.setState({
                    isLoading: false,
                    isEditMode: !this.state.isEditMode,
                    areEditorialMetadataFieldsRequired: false,
                    areTerritoryMetadataFieldsRequired: false,
                    areRatingFieldsRequired: false,
                });
            } else {
                this.setState({
                    isLoading: false,
                });
                console.error('Unable to Save');
            }
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

    sortCreditsOrder = castCrew => {
        return castCrew.sort((a, b) => a.creditsOrder - b.creditsOrder).map((c, i) => ({...c, creditsOrder: i + 1}));
    };

    addCastCrew = person => {
        person.creditsOrder = 1;
        let castCrewArray = [];
        if (this.state.editedForm.castCrew) {
            const existingCast = this.state.editedForm.castCrew.map(c => ({
                ...c,
                creditsOrder: c.creditsOrder + 1,
            }));
            castCrewArray = [person, ...existingCast];
        }
        const updateEditForm = {
            ...this.state.editedForm,
            castCrew: this.sortCreditsOrder(castCrewArray),
        };
        this.setState({
            editedForm: updateEditForm,
        });
    };

    removeCastCrew = removeCastCrew => {
        const cast = this.state.editedForm.castCrew.filter(cast => {
            if (cast.id === removeCastCrew.id) {
                return cast.personType !== removeCastCrew.personType;
            }
            return true;
        });
        const updateEditForm = {
            ...this.state.editedForm,
            castCrew: this.sortCreditsOrder(cast),
        };
        this.setState({
            editedForm: updateEditForm,
        });
    };

    reOrderedCastCrewArray = (orderedArray, type) => {
        let castList;
        let crewList;
        if (type === CAST) {
            crewList = getFilteredCrewList(this.state.editedForm.castCrew, false);
            castList = orderedArray;
        } else {
            castList = getFilteredCastList(this.state.editedForm.castCrew, false);
            crewList = orderedArray;
        }

        const reOrderedCastCrewList = {
            ...this.state.editedForm,
            castCrew: this.sortCreditsOrder([...castList, ...crewList]),
        };
        this.setState({
            editedForm: reOrderedCastCrewList,
        });
    };

    onSyncPublishClick = (name, buttonName) => {
        const syncToVz = name === VZ;
        const syncToMovida = name === MOVIDA;
        const syncProp = syncToVz ? 'isSyncingVZ' : 'isSyncingMovida';
        const publishToVZ = name === VZ;
        const publishProp = publishToVZ ? 'isPublishingVZ' : 'isPublishingMovida';
        if (buttonName === SYNC) {
            this.setState({
                [syncProp]: true,
            });
            this.titleSync(this.state.titleForm.id, syncToVz, syncToMovida);
        } else {
            this.setState({
                [publishProp]: true,
            });
            this.titlePublish(this.state.titleForm.id, syncToVz, syncToMovida, publishProp);
        }
    };

    render() {
        const {titleForm, territory, editorialMetadata} = this.state;
        const {id = ''} = titleForm || {};
        return (
            <EditPage>
                {this.state.titleError ? (
                    <div className="d-inline-flex justify-content-center w-100 position-absolute alert-danger">
                        <Label>Unable to load Title Data</Label>
                    </div>
                ) : (
                    <>
                        <AvForm id="titleDetail" onValidSubmit={this.handleOnSave} onKeyPress={this.onKeyPress}>
                            <Row>
                                <Col className="clearfix" style={{marginRight: '20px', marginBottom: '10px'}}>
                                    {this.state.isEditMode ? (
                                        <>
                                            <Button
                                                className="float-right"
                                                id="btnSave"
                                                isLoading={this.state.isLoading}
                                                onClick={this.handleOnSave}
                                                appearance="primary"
                                                isDisabled={this.state.validationErrors.size}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                className="float-right"
                                                id="btnCancel"
                                                onClick={this.handleSwitchMode}
                                                appearance="danger"
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Col>
                                            <div className="nexus-c-title-edit__sync-container">
                                                {getRepositoryName(id) === TitleSystems.NEXUS && (
                                                    <>
                                                        <PublishVzMovida
                                                            onSyncPublishClick={this.onSyncPublishClick}
                                                            externalIDs={this.state.externalIDs}
                                                            isSyncingVZ={this.state.isSyncingVZ}
                                                            isSyncingMovida={this.state.isSyncingMovida}
                                                            isPublishingVZ={this.state.isPublishingVZ}
                                                            isPublishingMovida={this.state.isPublishingMovida}
                                                        />
                                                        <Can I="update" a="Metadata">
                                                            <Button
                                                                className="float-right"
                                                                id="btnEdit"
                                                                onClick={this.handleSwitchMode}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Can>
                                                    </>
                                                )}
                                            </div>
                                        </Col>
                                    )}
                                </Col>
                            </Row>
                            {this.state.isEditMode ? this.editMode() : this.readOnly()}
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
                                handleAutoDecorateChange={this.handleEditorialMetadataAutoDecorateChange}
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
                                cleanField={this.cleanField}
                                handleRegenerateDecoratedMetadata={this.handleRegenerateDecoratedMetadata}
                                handleDeleteEditorialMetaData={this.handleEditorialMetaDataDelete}
                                setValidationError={this.setValidationError}
                                handleMetadataStatusChange={this.handleEditorialMetadataStatusChange}
                                handleUpdatingMetadataStatus={this.handleUpdatingEditorialMetadataStatus}
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
                                handleDeleteTerritoryMetaData={this.handleTerritoryMetaDataDelete}
                                handleMetadataStatusChange={this.handleTerritoryMetadataStatusChange}
                            />
                        </AvForm>
                        <FlagGroup onDismissed={this.handleToastDismiss}>{this.state.flags}</FlagGroup>
                    </>
                )}
            </EditPage>
        );
    }
}

TitleEdit.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withToasts(TitleEdit);
