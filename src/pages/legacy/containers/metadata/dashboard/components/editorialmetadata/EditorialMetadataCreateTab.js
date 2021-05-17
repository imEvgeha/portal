import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Col, Label, Row} from 'reactstrap'; // ?
import {AvField} from 'availity-reactstrap-validation'; // ?
import Select from 'react-select';
import {debounce} from 'lodash';
import {AUTODECORATE_ERROR} from './Constants';
import {editorialMetadataService} from '../../../../../constants/metadata/editorialMetadataService';
import {resolutionFormat} from '../../../../../constants/resolutionFormat';
import {EDITORIAL_METADATA_PREFIX} from '../../../../../constants/metadata/metadataComponent';
import {configFields, searchPerson} from '../../../service/ConfigService';
import {EVENT, SEASON} from '../../../../../constants/metadata/contentType';

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
    getFormatTypeName,
    CREW,
    getFilteredCastList,
} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import constants from '../../../MetadataConstants';
import {loadOptionsPerson} from '../utils/utils';

const US = 'US';
const EN = 'en';

const mapStateToProps = state => {
    return {
        configLanguage: state.titleReducer.configData.find(e => e.key === configFields.LANGUAGE),
        configLocale: state.titleReducer.configData.find(e => e.key === configFields.LOCALE),
        configGenre: state.titleReducer.configData.find(e => e.key === configFields.GENRE),
        configCategories: state.titleReducer.configData.find(e => e.key === configFields.CATEGORY),
    };
};

class EditorialMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGenreError: false,
            showCategoryError: false,
            autoDecorate: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const differentTitleContentType = this.props.titleContentType !== nextProps.titleContentType;
        const differentEditorialMetadataForCreate =
            this.props.editorialMetadataForCreate !== nextProps.editorialMetadataForCreate;
        const differentFieldsRequired = this.props.areFieldsRequired !== nextProps.areFieldsRequired;
        const differentState = this.state !== nextState;

        return (
            differentEditorialMetadataForCreate ||
            differentTitleContentType ||
            differentFieldsRequired ||
            differentState
        );
    }

    componentDidMount() {
        this.props.handleMetadataStatusChange({
            label: 'pending',
            value: 'pending',
        });
    }

    handleFieldLength = name => {
        return name ? name.length : 0;
    };

    getNameWithPrefix(name) {
        return EDITORIAL_METADATA_PREFIX + name;
    }

    handleGenreChange = e => {
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
        }
        this.props.handleGenreChange(e);
    };

    handleCategoryChange = category => {
        if (category.length > 12) {
            this.setState({
                showCategoryError: true,
            });
            category.pop();
        } else {
            if (this.state.showCategoryError) {
                this.setState({
                    showCategoryError: false,
                });
            }
        }
        this.props.handleCategoryChange(category);
    };

    handleEditorialRemovePerson = (person, castCrew) => {
        let newCastCrewList = [];
        if (castCrew) {
            newCastCrewList = castCrew.filter(e => {
                if (e.id === person.id) {
                    return e.personType !== person.personType;
                }
                return true;
            });
        }
        this.props.handleEditorialCastCrewCreate(newCastCrewList, this.props.editorialMetadataForCreate);
    };

    handleEditorialAddPerson = (person, castCrew) => {
        let newCastCrewList = [person];
        if (castCrew) {
            newCastCrewList = [...castCrew, person];
        }
        this.props.handleEditorialCastCrewCreate(newCastCrewList, this.props.editorialMetadataForCreate);
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
        this.props.handleEditorialCastCrewCreate(castAndCrewList, this.props.editorialMetadataForCreate);
    };

    onAutoDecorateClick = e => {
        this.setState(prevState => ({
            autoDecorate: !prevState.autoDecorate,
        }));
        this.props.cleanField('format');
        this.props.cleanField('service');
        this.props.handleAutoDecorateChange(e);
    };

    handleLocaleChange = e => {
        if (e.target.value !== US && this.state.autoDecorate) {
            this.setState({
                autoDecorate: false,
            });
        }
        this.props.handleChange(e);
    };

    handleLanguageChange = e => {
        if (e.target.value !== EN && this.state.autoDecorate) {
            this.setState({
                autoDecorate: false,
            });
        }
        this.props.handleChange(e);
    };

    delayedHandleChange = debounce((eventData, func) => func(eventData), 500);

    handleChange = (e, func) => {
        let eventData = {id: e.id, target: e.target};
        this.delayedHandleChange(eventData, func);
    };

    checkForAutoDecorateValidation = () => {
        let elements = [];
        elements.push(document.getElementById('editorialDisplayTitle'));
        elements.push(document.getElementById('editorialAutoDecorateTitle'));
        elements.push(document.getElementById('editorialShortSynopsis'));
        elements.push(document.getElementById('editorialMediumSynopsis'));
        let invalidElements = elements.filter(item => item && item.value === '');
        return !invalidElements.length;
    };

    raiseValidationError = () => {
        if (this.state.autoDecorate && !this.checkForAutoDecorateValidation()) {
            this.props.setValidationError(AUTODECORATE_ERROR, 'push');
        } else this.props.setValidationError(AUTODECORATE_ERROR, 'pop');
    };
    render() {
        this.raiseValidationError();

        const {
            synopsis,
            title,
            copyright,
            awards,
            seriesName,
            sasktelInventoryId,
            sasktelLineupId,
            castCrew,
            shortTitleTemplate,
        } = this.props.editorialMetadataForCreate;

        const {
            MAX_SEASON_LENGTH,
            MAX_TITLE_LENGTH,
            MAX_MEDIUM_TITLE_LENGTH,
            MAX_BRIEF_TITLE_LENGTH,
            MAX_SORT_TITLE_LENGTH,
            MAX_SYNOPSIS_LENGTH,
            MAX_COPYRIGHT_LENGTH,
            MAX_EPISODE_LENGTH,
        } = constants;
        return (
            <div id="editorialMetadataCreate">
                <Row style={{padding: '15px'}}>
                    <Col>
                        <b>
                            {' '}
                            Locale<span style={{color: 'red'}}>*</span>
                        </b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('locale')}
                            id="editorialLocal"
                            required={this.props.areFieldsRequired}
                            onChange={this.handleLocaleChange}
                            errorMessage="Field cannot be empty!"
                        >
                            <option value="">Select Locale</option>
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
                        <b>
                            {' '}
                            Language<span style={{color: 'red'}}>*</span>
                        </b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('language')}
                            id="editorialLanguage"
                            required={this.props.areFieldsRequired}
                            onChange={this.handleLanguageChange}
                            errorMessage="Field cannot be empty!"
                        >
                            <option value="">Select Language</option>
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
                            onChange={this.props.handleChange}
                            disabled={this.state.autoDecorate}
                            value={this.props.editorialMetadataForCreate.format}
                        >
                            <option value="">Select Format</option>
                            {!this.state.autoDecorate &&
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
                            onChange={this.props.handleChange}
                            disabled={this.state.autoDecorate}
                            value={this.props.editorialMetadataForCreate.service}
                        >
                            <option value="">Select Service</option>
                            {!this.state.autoDecorate &&
                                editorialMetadataService &&
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

                {(this.props.titleContentType === EVENT.apiName || this.props.titleContentType === SEASON.apiName) && (
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Series Name</b>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                id="editorialSeriesName"
                                name={this.getNameWithPrefix('seriesName')}
                                onChange={e => this.handleChange(e, this.props.handleEpisodicChange)}
                                validate={{
                                    maxLength: {value: 200, errorMessage: 'Too long Series Name. Max 200 symbols.'},
                                }}
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
                                onChange={this.props.handleEpisodicChange}
                                validate={{
                                    pattern: {value: '^[0-9]+$', errorMessage: 'Please enter a number'},
                                    maxLength: {
                                        value: MAX_SEASON_LENGTH,
                                        errorMessage: `Max ${MAX_SEASON_LENGTH} digits`,
                                    },
                                }}
                            />
                        </Col>
                        {this.props.titleContentType === EVENT.apiName && (
                            <Col md={2}>
                                <b>Episode Number</b>
                            </Col>
                        )}
                        {this.props.titleContentType === EVENT.apiName && (
                            <Col>
                                <AvField
                                    type="number"
                                    id="editorialEpisodeNumber"
                                    name={this.getNameWithPrefix('episodeNumber')}
                                    onChange={this.props.handleEpisodicChange}
                                    validate={{
                                        pattern: {value: '^[0-9]+$', errorMessage: 'Please enter a number'},
                                        maxLength: {
                                            value: MAX_EPISODE_LENGTH,
                                            errorMessage: `Max ${MAX_EPISODE_LENGTH} digits`,
                                        },
                                    }}
                                />
                            </Col>
                        )}
                    </Row>
                )}
                {!this.props.titleHasMaster &&
                    this.props.editorialMetadataForCreate.locale &&
                    this.props.editorialMetadataForCreate.locale === US &&
                    this.props.editorialMetadataForCreate.language &&
                    this.props.editorialMetadataForCreate.language === EN && (
                        <Row style={{padding: '15px'}}>
                            <Col md={2}>
                                <AvField
                                    value={this.state.autoDecorate}
                                    type="checkbox"
                                    name="decorateEditorialMetadata"
                                    onChange={this.onAutoDecorateClick}
                                    label="Auto-Decorate"
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
                                this.props.editorialMetadataForCreate.metadataStatus
                                    ? {
                                          label: this.props.editorialMetadataForCreate.metadataStatus,
                                          value: this.props.editorialMetadataForCreate.metadataStatus,
                                      }
                                    : {
                                          label: 'pending',
                                          value: 'pending',
                                      }
                            }
                            onChange={value => this.props.handleMetadataStatusChange(value)}
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
                            name={this.getNameWithPrefix('genres')}
                            value={
                                this.props.editorialMetadataForCreate.genres
                                    ? this.props.editorialMetadataForCreate.genres.map(e => {
                                          return {id: e.id, genre: e.genre, value: e.genre, label: e.genre};
                                      })
                                    : []
                            }
                            onChange={this.handleGenreChange}
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

                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Categories:</b>
                    </Col>
                    <Col>
                        <Select
                            name={this.getNameWithPrefix('category')}
                            value={this.state.category}
                            onChange={this.handleCategoryChange}
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
                        <b className={`${this.state.autoDecorate ? 'required' : ''}`}>Display Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialDisplayTitle"
                            name={this.getNameWithPrefix('title')}
                            onChange={e => this.handleChange(e, this.props.handleTitleChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_TITLE_LENGTH,
                                    errorMessage: `Too long Display Title. Max ${MAX_TITLE_LENGTH} symbols.`,
                                },
                            }}
                            required={this.state.autoDecorate}
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

                {this.state.autoDecorate && (
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b className="required">Auto-Decorate Title</b>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                id="editorialAutoDecorateTitle"
                                name={this.getNameWithPrefix('shortTitleTemplate')}
                                onChange={e => this.handleChange(e, this.props.handleChange)}
                                validate={{
                                    maxLength: {
                                        value: MAX_TITLE_LENGTH,
                                        errorMessage: `Too long Auto-Decorate Title. Max ${MAX_TITLE_LENGTH} symbols.`,
                                    },
                                }}
                                required
                                errorMessage="Field cannot be empty!"
                            />
                            <span
                                style={{
                                    float: 'right',
                                    fontSize: '13px',
                                    color: shortTitleTemplate
                                        ? this.handleFieldLength(shortTitleTemplate) === MAX_TITLE_LENGTH
                                            ? 'red'
                                            : '#111'
                                        : '#111',
                                }}
                            >
                                {shortTitleTemplate ? this.handleFieldLength(shortTitleTemplate) : 0}/{MAX_TITLE_LENGTH}{' '}
                                char
                            </span>
                        </Col>
                    </Row>
                )}
                <Row style={{padding: '15px'}}>
                    <Col md={2}>
                        <b>Brief Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialBriefTitle"
                            name={this.getNameWithPrefix('shortTitle')}
                            onChange={e => this.handleChange(e, this.props.handleTitleChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_BRIEF_TITLE_LENGTH,
                                    errorMessage: `Too long Brief Title. Max ${MAX_BRIEF_TITLE_LENGTH} symbols.`,
                                },
                            }}
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
                            name={this.getNameWithPrefix('mediumTitle')}
                            onChange={e => this.handleChange(e, this.props.handleTitleChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_MEDIUM_TITLE_LENGTH,
                                    errorMessage: `Too long Medium Title. Max ${MAX_MEDIUM_TITLE_LENGTH} symbols.`,
                                },
                            }}
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
                            name={this.getNameWithPrefix('longTitle')}
                            onChange={e => this.handleChange(e, this.props.handleTitleChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_TITLE_LENGTH,
                                    errorMessage: `Too long Long Title. Max ${MAX_TITLE_LENGTH} symbols.`,
                                },
                            }}
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
                            name={this.getNameWithPrefix('sortTitle')}
                            onChange={e => this.handleChange(e, this.props.handleTitleChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_SORT_TITLE_LENGTH,
                                    errorMessage: `Too long Sort Title. Max ${MAX_SORT_TITLE_LENGTH} symbols.`,
                                },
                            }}
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
                        <b className={`${this.state.autoDecorate ? 'required' : ''}`}>Short Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialShortSynopsis"
                            name={this.getNameWithPrefix('description')}
                            onChange={e => this.handleChange(e, this.props.handleSynopsisChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_SYNOPSIS_LENGTH,
                                    errorMessage: `Too long Short Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.`,
                                },
                            }}
                            required={this.state.autoDecorate}
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
                        <b className={`${this.state.autoDecorate ? 'required' : ''}`}>Medium Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="textarea"
                            id="editorialMediumSynopsis"
                            name={this.getNameWithPrefix('shortDescription')}
                            cols={20}
                            rows={5}
                            style={{resize: 'none'}}
                            onChange={e => this.handleChange(e, this.props.handleSynopsisChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_SYNOPSIS_LENGTH,
                                    errorMessage: `Too long Medium Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.`,
                                },
                            }}
                            required={this.state.autoDecorate}
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
                            type="textarea"
                            id="editorialLongSynopsis"
                            name={this.getNameWithPrefix('longDescription')}
                            onChange={e => this.handleChange(e, this.props.handleSynopsisChange)}
                            cols={20}
                            rows={5}
                            style={{resize: 'none'}}
                            validate={{
                                maxLength: {
                                    value: MAX_SYNOPSIS_LENGTH,
                                    errorMessage: `Too long Long Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.`,
                                },
                            }}
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
                            isMultiColumn={true}
                            getFormatTypeName={getFormatTypeName}
                            showPersonType={true}
                            handleAddCharacterName={this.props.handleAddEditorialCharacterName}
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
                            isMultiColumn={false}
                            showPersonType={true}
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
                            onChange={e => this.handleChange(e, this.props.handleChange)}
                            validate={{
                                maxLength: {
                                    value: MAX_COPYRIGHT_LENGTH,
                                    errorMessage: `Too long Copyright. Max ${MAX_COPYRIGHT_LENGTH} symbols.`,
                                },
                            }}
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
                            onChange={e => this.handleChange(e, this.props.handleChange)}
                            validate={{
                                maxLength: {value: 500, errorMessage: 'Too long Awards. Max 500 symbols.'},
                            }}
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
                            onChange={e => this.handleChange(e, this.props.handleChange)}
                            validate={{
                                maxLength: {
                                    value: 200,
                                    errorMessage: 'Too long Sasktel Inventory ID. Max 200 symbols.',
                                },
                            }}
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
                            id="editorialSasktelLineupID"
                            name={this.getNameWithPrefix('sasktelLineupId')}
                            onChange={e => this.handleChange(e, this.props.handleChange)}
                            validate={{
                                maxLength: {value: 200, errorMessage: 'Too long Sasktel Lineup ID. Max 200 symbols.'},
                            }}
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

EditorialMetadataCreateTab.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleTitleChange: PropTypes.func.isRequired,
    handleEpisodicChange: PropTypes.func.isRequired,
    handleSynopsisChange: PropTypes.func.isRequired,
    handleGenreChange: PropTypes.func.isRequired,
    areFieldsRequired: PropTypes.bool.isRequired,
    cleanField: PropTypes.func.isRequired,
    titleContentType: PropTypes.string,
    editorialMetadataForCreate: PropTypes.object,
    configLanguage: PropTypes.object,
    configLocale: PropTypes.object,
    configGenre: PropTypes.object,
    configCategories: PropTypes.object,
    handleEditorialCastCrewCreate: PropTypes.func,
    handleAddEditorialCharacterName: PropTypes.func,
    handleCategoryChange: PropTypes.func.isRequired,
    handleMetadataStatusChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(EditorialMetadataCreateTab);
