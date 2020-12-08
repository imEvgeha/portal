import React, {Component, Fragment} from 'react';
import {Col, Label, Row} from 'reactstrap';
import {AvField} from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Select from 'react-select';
import {debounce} from 'lodash';
import {editorialMetadataService} from '../../../../../constants/metadata/editorialMetadataService';
import {MASTER_RECORD_ERROR} from './Constants';
import {resolutionFormat} from '../../../../../constants/resolutionFormat';
import {
    EDITORIAL_METADATA_PREFIX,
    EDITORIAL_METADATA_SYNOPSIS,
    EDITORIAL_METADATA_TITLE,
} from '../../../../../constants/metadata/metadataComponent';
import {configFields, searchPerson} from '../../../service/ConfigService';
import {EPISODE, SEASON} from '../../../../../constants/metadata/contentType';
import Info from '@atlaskit/icon/glyph/info';

import PersonList from '../coretitlemetadata/PersonList';
import {
    CREW_LIST_LABEL,
    CAST_LIST_LABEL,
    CAST_LABEL,
    CREW_LABEL,
    CAST_HTML_FOR,
    CREW_HTML_FOR,
    CAST_HEADER,
    CREW_HEADER,
} from '../../../../../constants/metadata/constant-variables';
import {
    CAST,
    getFilteredCrewList,
    getFilteredCastList,
    getFormatTypeName,
    CREW,
} from '../../../../../constants/metadata/configAPI';

import constants from '../../../MetadataConstants';
import {Can} from '../../../../../../../ability';
import {loadOptionsPerson} from '../utils/utils';

const mapStateToProps = state => {
    return {
        configLanguage: state.titleReducer.configData.find(e => e.key === configFields.LANGUAGE),
        configLocale: state.titleReducer.configData.find(e => e.key === configFields.LOCALE),
        configGenre: state.titleReducer.configData.find(e => e.key === configFields.GENRE),
        configCategories: state.titleReducer.configData.find(e => e.key === configFields.CATEGORY),
    };
};

class EditorialMetadataEditMode extends Component {
    constructor(props) {
        super(props);
        const {data} = this.props;
        const genres = (data || {}).genres || [];
        const propsCategory = (data || {}).category || [];

        const category = propsCategory.map(e => {
            return {value: e.name, label: e.name};
        });

        this.state = {
            genres,
            showGenreError: false,
            category,
            showCategoryError: false,
        };
    }

    delayedHandleChange = debounce(eventData => this.props.handleChange(eventData, this.props.data), 500);

    handleChange = e => {
        let eventData = {id: e.id, target: e.target};
        this.delayedHandleChange(eventData);
    };

    handleGenre = e => {
        if (e.length > 10) {
            this.setState({
                showGenreError: true,
            });
            e.pop();
        } else {
            if (this.state.showGenreError) {
                this.setState({
                    showGenreError: false,
                });
            }
            this.setState({
                genres: e,
            });
        }
        this.props.handleGenreEditChange(this.props.data, e);
    };

    handleCategory = category => {
        if (category.length > 12) {
            this.setState({
                showCategoryError: true,
            });
            category.pop();
        } else {
            if (this.state.showGenreError) {
                this.setState({
                    showCategoryError: false,
                });
            }
            this.setState({category});
        }
        this.props.handleCategoryEditChange(this.props.data, category);
    };

    shouldComponentUpdate(nextProps) {
        const differentTitleContentType = this.props.titleContentType !== nextProps.titleContentType;
        const differentData = this.props.data !== nextProps.data;
        const differentUpdatedData =
            this.props.updatedEditorialMetadata.filter(e => e.id === this.props.data.id) !==
            nextProps.updatedEditorialMetadata.filter(e => e.id === nextProps.data.id);
        return differentData || differentTitleContentType || differentUpdatedData;
    }

    handleFieldLength = name => {
        return name ? name.length : 0;
    };

    getNameWithPrefix(name) {
        return EDITORIAL_METADATA_PREFIX + name;
    }

    getSynopsisPrefix(name) {
        return EDITORIAL_METADATA_PREFIX + EDITORIAL_METADATA_SYNOPSIS + name;
    }

    getEditorialTitlePrefix(name) {
        return EDITORIAL_METADATA_PREFIX + EDITORIAL_METADATA_TITLE + name;
    }

    prepareFieldsForUpdate = () => {
        if (!this.props.data.title) {
            this.props.data.title = {};
        }
        if (!this.props.data.synopsis) {
            this.props.data.synopsis = {};
        }
    };

    handleEditorialRemovePerson = (person, castCrew) => {
        let newCastCrewList = [];
        if (castCrew) {
            newCastCrewList = castCrew.filter(e => e.id !== person.id);
        }
        this.props.handleEditorialCastCrew(newCastCrewList, this.props.data);
    };

    handleEditorialAddPerson = (person, castCrew) => {
        let newCastCrewList = [person];
        if (castCrew) {
            newCastCrewList = [...castCrew, person];
        }
        this.props.handleEditorialCastCrew(newCastCrewList, this.props.data);
    };
    castAndCrewReorder = (orderedArray, type, castCrew) => {
        let castList;
        let crewList;
        if (type === CAST) {
            crewList = getFilteredCrewList(castCrew, false);
            castList = orderedArray;
        } else {
            castList = getFilteredCastList(castCrew, false, true);
            crewList = orderedArray;
        }

        const castAndCrewList = [...castList, ...crewList];
        this.props.handleEditorialCastCrew(castAndCrewList, this.props.data);
    };

    checkForAutoDecorateValidation = fieldsArray => {
        let invalidElements = fieldsArray.filter(item => item === null || item === '');
        return !invalidElements.length;
    };

    raiseValidationError = (isMaster, fields) => {
        if (isMaster) {
            if (!this.checkForAutoDecorateValidation(fields))
                this.props.setValidationError(MASTER_RECORD_ERROR, 'push');
            else this.props.setValidationError(MASTER_RECORD_ERROR, 'pop');
        }
    };

    render() {
        const {handleDelete, data: currentMetadata} = this.props;
        const isMaster = !!this.props.data.hasGeneratedChildren;
        const isDecorated = !!this.props.data.parentEmetId;

        this.prepareFieldsForUpdate();
        const updateData = this.props.updatedEditorialMetadata.find(e => e.id === this.props.data.id);
        const {
            locale,
            language,
            format,
            service,
            episodic,
            synopsis,
            title,
            copyright,
            awards,
            sasktelInventoryId,
            sasktelLineupId,
            castCrew,
            shortTitleTemplate,
        } = updateData || this.props.data;

        this.raiseValidationError(isMaster, [
            shortTitleTemplate,
            title.title,
            synopsis.description,
            synopsis.shortDescription,
        ]);

        const {seriesName, seasonNumber, episodeNumber} = episodic || {};

        const {
            MAX_TITLE_LENGTH,
            MAX_MEDIUM_TITLE_LENGTH,
            MAX_BRIEF_TITLE_LENGTH,
            MAX_SORT_TITLE_LENGTH,
            MAX_SYNOPSIS_LENGTH,
            MAX_COPYRIGHT_LENGTH,
        } = constants;

        return (
            <div id="editorialMetadataEdit">
                <Can I="delete" a="Metadata">
                    <Row style={{padding: '0 30px', marginBottom: '24px', display: 'flex', justifyContent: 'flex-end'}}>
                        <span
                            style={{color: 'red', cursor: 'pointer'}}
                            onClick={() => handleDelete(currentMetadata.id)}
                        >
                            Delete Editorial Metadata
                        </span>
                    </Row>
                </Can>
                {isMaster && (
                    <Row style={{padding: '15px'}}>
                        <Col className="info-master" md={12}>
                            <Info />
                            You are about to edit a Master Editorial Record. All linked records will be updated
                            accordingly.
                        </Col>
                    </Row>
                )}
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>Locale</b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('locale')}
                            id="editorialLocal"
                            onChange={e => this.props.handleChange(e, this.props.data)}
                            value={locale}
                            disabled={isMaster || isDecorated}
                        >
                            {this.props.configLocale &&
                                this.props.configLocale.value.map((e, index) => {
                                    return (
                                        <option key={index} value={e.countryCode}>
                                            {e.countryName}
                                        </option>
                                    );
                                })}
                        </AvField>
                    </Col>
                    <Col>
                        <b>Language</b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('language')}
                            id="editorialLanguage"
                            onChange={e => this.props.handleChange(e, this.props.data)}
                            value={language}
                            disabled={isMaster || isDecorated}
                        >
                            {this.props.configLanguage &&
                                this.props.configLanguage.value.map((e, index) => {
                                    return (
                                        <option key={index} value={e.languageCode}>
                                            {e.languageName}
                                        </option>
                                    );
                                })}
                        </AvField>
                    </Col>
                    <Col>
                        <b>Format</b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('format')}
                            id="editorialFormat"
                            onChange={e => this.props.handleChange(e, this.props.data)}
                            value={format}
                            disabled={isMaster || isDecorated}
                        >
                            <option value="">Select Format</option>
                            {resolutionFormat &&
                                resolutionFormat.map((item, i) => {
                                    return (
                                        <option key={i} value={item}>
                                            {item}
                                        </option>
                                    );
                                })}
                        </AvField>
                    </Col>
                    <Col>
                        <b>Service</b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('service')}
                            id="editorialService"
                            onChange={e => this.props.handleChange(e, this.props.data)}
                            value={service}
                            disabled={isMaster || isDecorated}
                        >
                            <option value="">Select Service</option>
                            {editorialMetadataService &&
                                editorialMetadataService.map((item, i) => {
                                    return (
                                        <option key={i} value={item}>
                                            {item}
                                        </option>
                                    );
                                })}
                        </AvField>
                    </Col>
                </Row>

                {(this.props.titleContentType === EPISODE.apiName ||
                    this.props.titleContentType === SEASON.apiName) && (
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Series Name</b>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                id="editorialSeriesName"
                                name={this.getNameWithPrefix('seriesName')}
                                onChange={this.handleChange}
                                validate={{
                                    maxLength: {value: 200, errorMessage: 'Too long Series Name. Max 200 symbols.'},
                                }}
                                value={seriesName}
                            />
                            <span
                                style={{
                                    float: 'right',
                                    fontSize: '13px',
                                    color: seriesName
                                        ? this.handleFieldLength(seriesName) === 200
                                            ? 'red'
                                            : '#111'
                                        : '#111',
                                }}
                            >
                                {seriesName ? this.handleFieldLength(seriesName) : 0}/200 char
                            </span>
                        </Col>
                        <Col md={2}>
                            <b>Season Number</b>
                        </Col>
                        <Col>
                            <AvField
                                type="number"
                                id="editorialSeasonNumber"
                                name={this.getNameWithPrefix('seasonNumber')}
                                onChange={this.handleChange}
                                validate={{
                                    pattern: {value: '^[0-9]+$', errorMessage: 'Please enter a number'},
                                    maxLength: {value: 3, errorMessage: 'Max 3 digits'},
                                }}
                                value={seasonNumber}
                            />
                        </Col>
                        {this.props.titleContentType === EPISODE.apiName && (
                            <Col md={2}>
                                <b>Episode Number</b>
                            </Col>
                        )}
                        {this.props.titleContentType === EPISODE.apiName && (
                            <Col>
                                <AvField
                                    type="number"
                                    id="editorialEpisodeNumber"
                                    name={this.getNameWithPrefix('episodeNumber')}
                                    onChange={this.handleChange}
                                    validate={{
                                        pattern: {value: '^[0-9]+$', errorMessage: 'Please enter a number'},
                                        maxLength: {value: 3, errorMessage: 'Max 3 digits'},
                                    }}
                                    value={episodeNumber}
                                />
                            </Col>
                        )}
                    </Row>
                )}
                {isMaster && (
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <AvField
                                value={true}
                                type="checkbox"
                                name="decorateEditorialMetadata"
                                label="Auto-Decorate"
                                disabled
                            />
                        </Col>
                    </Row>
                )}

                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>
                            Metadata Status<span style={{color: 'red'}}>*</span>:
                        </b>
                    </Col>
                    <Col>
                        <Select
                            name="metadataStatus"
                            value={
                                this.props.data.metadataStatus
                                    ? {
                                          label: this.props.data.metadataStatus,
                                          value: this.props.data.metadataStatus,
                                      }
                                    : {
                                          label: 'pending',
                                          value: 'pending',
                                      }
                            }
                            onChange={value => this.props.handleUpdatingMetadataStatus(value)}
                            placeholder="Select Metadata Status"
                            options={[
                                {label: 'pending', value: 'pending'},
                                {label: 'complete', value: 'complete'},
                            ]}
                        />
                    </Col>
                </Row>

                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Genres:</b>
                    </Col>
                    <Col>
                        <Select
                            name={this.getNameWithPrefix('edit-genres')}
                            value={this.state.genres.map(e => {
                                return {id: e.id, genre: e.genre, value: e.genre, label: e.genre};
                            })}
                            onChange={e => this.handleGenre(e)}
                            isMulti
                            placeholder="Select Genre"
                            options={
                                this.props.configGenre
                                    ? this.props.configGenre.value
                                          .filter(e => e.name !== null)
                                          .map(e => {
                                              return {id: e.id, genre: e.name, value: e.name, label: e.name};
                                          })
                                    : []
                            }
                        />
                        {this.state.showGenreError && <Label style={{color: 'red'}}>Max 10 genres</Label>}
                    </Col>
                </Row>

                {isMaster && (
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b className="required">Auto-Decorate Title</b>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                id="editorialAutoDecorateTitle"
                                name={this.getNameWithPrefix('shortTitleTemplate')}
                                onChange={this.handleChange}
                                validate={{
                                    maxLength: {
                                        value: MAX_TITLE_LENGTH,
                                        errorMessage: `Too long Auto-Decorate Title. Max ${MAX_TITLE_LENGTH} symbols.`,
                                    },
                                }}
                                value={shortTitleTemplate}
                                required
                                errorMessage="Field cannot be empty!"
                            />
                            <span
                                style={{
                                    float: 'right',
                                    fontSize: '13px',
                                    color: title
                                        ? this.handleFieldLength(title.title) === MAX_TITLE_LENGTH
                                            ? 'red'
                                            : '#111'
                                        : '#111',
                                }}
                            >
                                {title ? this.handleFieldLength(title.title) : 0}/{MAX_TITLE_LENGTH} char
                            </span>
                        </Col>
                    </Row>
                )}

                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Categories:</b>
                    </Col>
                    <Col>
                        <Select
                            name="category"
                            value={this.state.category}
                            onChange={e => this.handleCategory(e)}
                            isMulti
                            placeholder="Select Category"
                            options={
                                this.props.configCategories
                                    ? this.props.configCategories.value
                                          .filter(e => e.value !== null)
                                          .map(e => {
                                              return {value: e.value, label: e.value};
                                          })
                                    : []
                            }
                        />
                        {this.state.showCategoryError && <Label style={{color: 'red'}}>Max 12 categories</Label>}
                    </Col>
                </Row>

                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b className={`${isMaster ? 'required' : ''}`}>Display Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialDisplayTitle"
                            name={this.getEditorialTitlePrefix('title')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_TITLE_LENGTH,
                                    errorMessage: `Too long Display Title. Max ${MAX_TITLE_LENGTH} symbols.`,
                                },
                            }}
                            value={title.title}
                            required={isMaster}
                            errorMessage="Field cannot be empty!"
                        />
                        <span
                            style={{
                                float: 'right',
                                fontSize: '13px',
                                color: title
                                    ? this.handleFieldLength(title.title) === MAX_TITLE_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                            }}
                        >
                            {title ? this.handleFieldLength(title.title) : 0}/{MAX_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Brief Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialBriefTitle"
                            name={this.getEditorialTitlePrefix('shortTitle')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_BRIEF_TITLE_LENGTH,
                                    errorMessage: `Too long Brief Title. Max ${MAX_BRIEF_TITLE_LENGTH} symbols.`,
                                },
                            }}
                            value={title.shortTitle}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: title
                                    ? this.handleFieldLength(title.shortTitle) === MAX_BRIEF_TITLE_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {title ? this.handleFieldLength(title.shortTitle) : 0}/{MAX_BRIEF_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Medium Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialMediumTitle"
                            name={this.getEditorialTitlePrefix('mediumTitle')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_MEDIUM_TITLE_LENGTH,
                                    errorMessage: `Too long Medium Title. Max ${MAX_MEDIUM_TITLE_LENGTH} symbols.`,
                                },
                            }}
                            value={title.mediumTitle}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: title
                                    ? this.handleFieldLength(title.mediumTitle) === MAX_MEDIUM_TITLE_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {title ? this.handleFieldLength(title.mediumTitle) : 0}/{MAX_MEDIUM_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Long Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialLongTitle"
                            name={this.getEditorialTitlePrefix('longTitle')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_TITLE_LENGTH,
                                    errorMessage: `Too long Long Title. Max ${MAX_TITLE_LENGTH} symbols.`,
                                },
                            }}
                            value={title.longTitle}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: title
                                    ? this.handleFieldLength(title.longTitle) === MAX_TITLE_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {title ? this.handleFieldLength(title.longTitle) : 0}/{MAX_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Sort Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialSortTitle"
                            name={this.getEditorialTitlePrefix('sortTitle')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_SORT_TITLE_LENGTH,
                                    errorMessage: `Too long Sort Title. Max ${MAX_SORT_TITLE_LENGTH} symbols.`,
                                },
                            }}
                            value={title.sortTitle}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: title
                                    ? this.handleFieldLength(title.sortTitle) === MAX_SORT_TITLE_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {title ? this.handleFieldLength(title.sortTitle) : 0}/{MAX_SORT_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>

                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b className={`${isMaster ? 'required' : ''}`}>Short Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialShortSynopsis"
                            name={this.getSynopsisPrefix('description')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_SYNOPSIS_LENGTH,
                                    errorMessage: `Too long Short Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.`,
                                },
                            }}
                            value={synopsis.description}
                            required={isMaster}
                            errorMessage="Field cannot be empty!"
                        />
                        <span
                            style={{
                                float: 'right',
                                color: synopsis
                                    ? this.handleFieldLength(synopsis.description) === MAX_SYNOPSIS_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {synopsis ? this.handleFieldLength(synopsis.description) : 0}/{MAX_SYNOPSIS_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b className={`${isMaster ? 'required' : ''}`}>Medium Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialMediumSynopsis"
                            name={this.getSynopsisPrefix('shortDescription')}
                            cols={20}
                            rows={5}
                            style={{resize: 'none'}}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_SYNOPSIS_LENGTH,
                                    errorMessage: `Too long Medium Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.`,
                                },
                            }}
                            value={synopsis.shortDescription}
                            required={isMaster}
                            errorMessage="Field cannot be empty!"
                        />
                        <span
                            style={{
                                float: 'right',
                                color: synopsis
                                    ? this.handleFieldLength(synopsis.shortDescription) === MAX_SYNOPSIS_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {synopsis ? this.handleFieldLength(synopsis.shortDescription) : 0}/{MAX_SYNOPSIS_LENGTH}{' '}
                            char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Long Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialLongSynopsis"
                            name={this.getSynopsisPrefix('longDescription')}
                            onChange={this.handleChange}
                            cols={20}
                            rows={5}
                            style={{resize: 'none'}}
                            validate={{
                                maxLength: {
                                    value: MAX_SYNOPSIS_LENGTH,
                                    errorMessage: `Too long Long Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.`,
                                },
                            }}
                            value={synopsis.longDescription}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: synopsis
                                    ? this.handleFieldLength(synopsis.longDescription) === MAX_SYNOPSIS_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {synopsis ? this.handleFieldLength(synopsis.longDescription) : 0}/{MAX_SYNOPSIS_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col>
                        <PersonList
                            personLabel={CAST_LABEL}
                            personHtmlFor={CAST_HTML_FOR}
                            personListLabel={CAST_LIST_LABEL}
                            personHeader={CAST_HEADER}
                            type={CAST}
                            persons={getFilteredCastList(castCrew, false, true)}
                            filterPersonList={getFilteredCastList}
                            removePerson={person => this.handleEditorialRemovePerson(person, castCrew)}
                            loadOptionsPerson={loadOptionsPerson}
                            addPerson={person => this.handleEditorialAddPerson(person, castCrew)}
                            getFormatTypeName={getFormatTypeName}
                            showPersonType={true}
                            isMultiColumn={true}
                            parentId={this.props.data.id}
                            handleAddCharacterName={this.props.handleAddEditorialCharacterNameEdit}
                            data={this.props.data}
                            onReOrder={newArray => this.castAndCrewReorder(newArray, CAST, castCrew)}
                        />
                    </Col>
                    <Col>
                        <PersonList
                            personLabel={CREW_LABEL}
                            personHtmlFor={CREW_HTML_FOR}
                            personListLabel={CREW_LIST_LABEL}
                            personHeader={CREW_HEADER}
                            type={CREW}
                            persons={getFilteredCrewList(castCrew, false)}
                            filterPersonList={getFilteredCrewList}
                            removePerson={person => this.handleEditorialRemovePerson(person, castCrew)}
                            loadOptionsPerson={loadOptionsPerson}
                            addPerson={person => this.handleEditorialAddPerson(person, castCrew)}
                            getFormatTypeName={getFormatTypeName}
                            showPersonType={true}
                            isMultiColumn={false}
                            onReOrder={newArray => this.castAndCrewReorder(newArray, CREW, castCrew)}
                        />
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Copyright</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialCopyright"
                            name={this.getNameWithPrefix('copyright')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: MAX_COPYRIGHT_LENGTH,
                                    errorMessage: `Too long Copyright. Max ${MAX_COPYRIGHT_LENGTH} symbols.`,
                                },
                            }}
                            value={copyright}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: copyright
                                    ? this.handleFieldLength(copyright) === MAX_COPYRIGHT_LENGTH
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {copyright ? this.handleFieldLength(copyright) : 0}/{MAX_COPYRIGHT_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Awards</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialAwards"
                            name={this.getNameWithPrefix('awards')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {value: 500, errorMessage: 'Too long Awards. Max 500 symbols.'},
                            }}
                            value={awards}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: awards ? (this.handleFieldLength(awards) === 500 ? 'red' : '#111') : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {awards ? this.handleFieldLength(awards) : 0}/500 char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Sasktel Inventory ID</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialSasktelInventoryID"
                            name={this.getNameWithPrefix('sasktelInventoryId')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {
                                    value: 200,
                                    errorMessage: 'Too long Sasktel Inventory ID. Max 200 symbols.',
                                },
                            }}
                            value={sasktelInventoryId}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: sasktelInventoryId
                                    ? this.handleFieldLength(sasktelInventoryId) === 200
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {sasktelInventoryId ? this.handleFieldLength(sasktelInventoryId) : 0}/200 char
                        </span>
                    </Col>
                </Row>
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Sasktel Lineup ID</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="sasktelLineupId"
                            name={this.getNameWithPrefix('sasktelLineupId')}
                            onChange={this.handleChange}
                            validate={{
                                maxLength: {value: 200, errorMessage: 'Too long Sasktel Lineup ID. Max 200 symbols.'},
                            }}
                            value={sasktelLineupId}
                        />
                        <span
                            style={{
                                float: 'right',
                                color: sasktelLineupId
                                    ? this.handleFieldLength(sasktelLineupId) === 200
                                        ? 'red'
                                        : '#111'
                                    : '#111',
                                fontSize: '13px',
                            }}
                        >
                            {sasktelLineupId ? this.handleFieldLength(sasktelLineupId) : 0}/200 char
                        </span>
                    </Col>
                </Row>
            </div>
        );
    }
}

EditorialMetadataEditMode.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleGenreEditChange: PropTypes.func.isRequired,
    data: PropTypes.object,
    titleContentType: PropTypes.string,
    updatedEditorialMetadata: PropTypes.array,
    configLanguage: PropTypes.object,
    configLocale: PropTypes.object,
    configGenre: PropTypes.object,
    configCategories: PropTypes.object,
    handleEditorialCastCrew: PropTypes.func,
    handleAddEditorialCharacterNameEdit: PropTypes.func,
    handleCategoryEditChange: PropTypes.func.isRequired,
    handleUpdatingMetadataStatus: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(EditorialMetadataEditMode);
