import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Label, Row } from 'reactstrap'; // ?
import { AvField } from 'availity-reactstrap-validation'; // ?
import Select from 'react-select';
import { editorialMetadataService } from '../../../../../constants/metadata/editorialMetadataService';
import { resolutionFormat } from '../../../../../constants/resolutionFormat';
import { EDITORIAL_METADATA_PREFIX } from '../../../../../constants/metadata/metadataComponent';
import { configFields, searchPerson } from '../../../service/ConfigService';
import { EVENT, SEASON } from '../../../../../constants/metadata/contentType';

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
    PERSONS_PER_REQUEST,
    getFilteredCastList
} from '../../../../../constants/metadata/configAPI';
import constants from '../../../MetadataConstants';

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
            showCategoryError: false
        };
    }

    shouldComponentUpdate(nextProps) {
        const differentTitleContentType = this.props.titleContentType !== nextProps.titleContentType;
        const differentEditorialMetadataForCreate = this.props.editorialMetadataForCreate !== nextProps.editorialMetadataForCreate;
        const differentFieldsRequired = this.props.areFieldsRequired !== nextProps.areFieldsRequired;

        return differentEditorialMetadataForCreate || differentTitleContentType || differentFieldsRequired;
    }

    handleFieldLength = (name) => {
        return name ? name.length : 0;
    }

    getNameWithPrefix(name) {
        return EDITORIAL_METADATA_PREFIX + name;
    }

    handleGenreChange = (e) => {
        if (e.length > 10) {
            this.setState({
                showGenreError: true
            });
            e.pop();
        } else {
            if (this.state.showGenreError) {
                this.setState({
                    showGenreError: false
                });
            }
        }
        this.props.handleGenreChange(e);
    };

    handleCategoryChange = (category) => {
        if (category.length > 12) {
            this.setState({
                showCategoryError: true
            });
            category.pop();
        } else {
            if (this.state.showCategoryError) {
                this.setState({
                    showCategoryError: false
                });
            }
        }
        this.props.handleCategoryChange(category);
    };

    loadOptionsPerson = (searchPersonText, type) => {
        if (type === CAST) {
            return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CAST, true)
                .then(res => getFilteredCastList(res.data.data, true, true).map(e => { return { id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase(), original: JSON.stringify(e) }; })
                );
        } else {
            return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CREW)
                .then(res => getFilteredCrewList(res.data.data, true).map(e => { return { id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase(), original: JSON.stringify(e) }; })
                );
        }
    };

    handleEditorialRemovePerson = (person, castCrew) => {
        let newCastCrewList = [];
        if (castCrew) {
            newCastCrewList = castCrew.filter(e => e.id !== person.id);
        }
        this.props.handleEditorialCastCrewCreate(newCastCrewList, this.props.editorialMetadataForCreate);
    }

    handleEditorialAddPerson = (person, castCrew) => {
        let newCastCrewList = [person];
        if (castCrew) {
            newCastCrewList = [...castCrew, person];
        }
        this.props.handleEditorialCastCrewCreate(newCastCrewList, this.props.editorialMetadataForCreate);
    }
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
    }

    render() {
        const { synopsis, title, copyright, awards, seriesName, sasktelInventoryId, sasktelLineupId, castCrew } = this.props.editorialMetadataForCreate;
        const { MAX_SEASON_LENGTH, MAX_TITLE_LENGTH, MAX_MEDIUM_TITLE_LENGTH, MAX_BRIEF_TITLE_LENGTH,
            MAX_SORT_TITLE_LENGTH, MAX_SYNOPSIS_LENGTH, MAX_COPYRIGHT_LENGTH, MAX_EPISODE_LENGTH } = constants;
        return (
            <div id="editorialMetadataCreate">
                <Row style={{ padding: '15px' }}>
                    <Col>
                        <b> Locale<span style={{ color: 'red' }}>*</span></b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('locale')}
                            id="editorialLocal"
                            required={this.props.areFieldsRequired}
                            onChange={this.props.handleChange}
                            errorMessage="Field cannot be empty!"
                        >
                            <option value=''>Select Locale</option>
                            {
                                    this.props.configLocale && this.props.configLocale.value.map((e, index) => {
                                        return <option key={index} value={e.countryCode}>{e.countryName}</option>;
                                    })
                                }
                        </AvField>
                    </Col>
                    <Col>
                        <b> Language<span style={{ color: 'red' }}>*</span></b>
                    </Col>
                    <Col md={2}>
                        <AvField
                            type="select"
                            name={this.getNameWithPrefix('language')}
                            id="editorialLanguage"
                            required={this.props.areFieldsRequired}
                            onChange={this.props.handleChange}
                            errorMessage="Field cannot be empty!"
                        >
                            <option value=''>Select Language</option>
                            {
                                    this.props.configLanguage && this.props.configLanguage.value.map((e, index) => {
                                        return <option key={index} value={e.languageCode}>{e.languageName}</option>;
                                    })
                                }
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
                        >
                            <option value="">Select Format</option>
                            {
                                    resolutionFormat && resolutionFormat.map((item, i) => {
                                        return <option key={i} value={item}>{item}</option>;
                                    })
                                }
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
                        >
                            <option value="">Select Service</option>
                            {
                                    editorialMetadataService && editorialMetadataService.map((item, i) => {
                                        return <option key={i} value={item}>{item}</option>;
                                    })
                                }
                        </AvField>
                    </Col>
                </Row>

                {(this.props.titleContentType === EVENT.apiName || this.props.titleContentType === SEASON.apiName) && (
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Series Name</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialSeriesName"
                            name={this.getNameWithPrefix('seriesName')}
                            onChange={this.props.handleEpisodicChange}
                            validate={{
                                        maxLength: { value: 200, errorMessage: 'Too long Series Name. Max 200 symbols.' }
                                    }}
                        />
                        <span style={{ float: 'right', fontSize: '13px', color: seriesName ? this.handleFieldLength(seriesName) === 200 ? 'red' : '#111' : '#111' }}>{seriesName ? this.handleFieldLength(seriesName) : 0}/200 char</span>
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
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                        maxLength: { value: MAX_SEASON_LENGTH, errorMessage: `Max ${MAX_SEASON_LENGTH} digits` }
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
                                            pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                            maxLength: { value: MAX_EPISODE_LENGTH, errorMessage: `Max ${MAX_EPISODE_LENGTH} digits` }
                                        }}
                        />
                    </Col>
                              )}
                </Row>
                      )}

                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Genres:</b>
                    </Col>
                    <Col>
                        <Select
                            name={this.getNameWithPrefix('genres')}
                            value={this.props.editorialMetadataForCreate.genres ? this.props.editorialMetadataForCreate.genres.map(e => {
                                    return { id: e.id, genre: e.genre, value: e.genre, label: e.genre };
                                }) : []}
                            onChange={this.handleGenreChange}
                            isMulti
                            placeholder='Select Genre'
                            options={this.props.configGenre ? this.props.configGenre.value
                                    .filter(e => e.name !== null)
                                    .map(e => { return { id: e.id, genre: e.name, value: e.name, label: e.name }; })
                                    : []}
                        />
                        {this.state.showGenreError && <Label style={{ color: 'red' }}>Max 10 genres</Label>}
                    </Col>
                </Row>

                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Categories:</b>
                    </Col>
                    <Col>
                        <Select
                            name={this.getNameWithPrefix('category')}
                            value={this.state.category}
                            onChange={this.handleCategoryChange}
                            isMulti
                            placeholder='Select Category'
                            options={this.props.configCategories ? this.props.configCategories.value
                                    .filter(e => e.value !== null)
                                    .map(e => { return { value: e.value, label: e.value }; })
                                : []}
                        />
                        {this.state.showCategoryError && <Label style={{ color: 'red' }}>Max 12 categories</Label>}
                    </Col>
                </Row>

                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Display Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialDisplayTitle"
                            name={this.getNameWithPrefix('title')}
                            onChange={this.props.handleTitleChange}
                            validate={{
                                    maxLength: { value: MAX_TITLE_LENGTH, errorMessage: `Too long Display Title. Max ${MAX_TITLE_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', fontSize: '13px', color: title ? this.handleFieldLength(title.title) === MAX_TITLE_LENGTH ? 'red' : '#111' : '#111' }}>
                            {title ? this.handleFieldLength(title.title) : 0}/{MAX_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Brief Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialBriefTitle"
                            name={this.getNameWithPrefix('shortTitle')}
                            onChange={this.props.handleTitleChange}
                            validate={{
                                    maxLength: { value: MAX_BRIEF_TITLE_LENGTH, errorMessage: `Too long Brief Title. Max ${MAX_BRIEF_TITLE_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: title ? this.handleFieldLength(title.shortTitle) === MAX_BRIEF_TITLE_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {title ? this.handleFieldLength(title.shortTitle) : 0}/{MAX_BRIEF_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Medium Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialMediumTitle"
                            name={this.getNameWithPrefix('mediumTitle')}
                            onChange={this.props.handleTitleChange}
                            validate={{
                                    maxLength: { value: MAX_MEDIUM_TITLE_LENGTH, errorMessage: `Too long Medium Title. Max ${MAX_MEDIUM_TITLE_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: title ? this.handleFieldLength(title.mediumTitle) === MAX_MEDIUM_TITLE_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {title ? this.handleFieldLength(title.mediumTitle) : 0}/{MAX_MEDIUM_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Long Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialLongTitle"
                            name={this.getNameWithPrefix('longTitle')}
                            onChange={this.props.handleTitleChange}
                            validate={{
                                    maxLength: { value: MAX_TITLE_LENGTH, errorMessage: `Too long Long Title. Max ${MAX_TITLE_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: title ? this.handleFieldLength(title.longTitle) === MAX_TITLE_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {title ? this.handleFieldLength(title.longTitle) : 0}/{MAX_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Sort Title</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialSortTitle"
                            name={this.getNameWithPrefix('sortTitle')}
                            onChange={this.props.handleTitleChange}
                            validate={{
                                    maxLength: { value: MAX_SORT_TITLE_LENGTH, errorMessage: `Too long Sort Title. Max ${MAX_SORT_TITLE_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: title ? this.handleFieldLength(title.sortTitle) === MAX_SORT_TITLE_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {title ? this.handleFieldLength(title.sortTitle) : 0}/{MAX_SORT_TITLE_LENGTH} char
                        </span>
                    </Col>
                </Row>

                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Short Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialShortSynopsis"
                            name={this.getNameWithPrefix('description')}
                            onChange={this.props.handleSynopsisChange}
                            validate={{
                                    maxLength: { value: MAX_SYNOPSIS_LENGTH, errorMessage: `Too long Short Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: synopsis ? this.handleFieldLength(synopsis.description) === MAX_SYNOPSIS_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {synopsis ? this.handleFieldLength(synopsis.description) : 0}/{MAX_SYNOPSIS_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Medium Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="textarea"
                            id="editorialMediumSynopsis"
                            name={this.getNameWithPrefix('shortDescription')}
                            cols={20}
                            rows={5}
                            style={{ resize: 'none' }}
                            onChange={this.props.handleSynopsisChange}
                            validate={{
                                    maxLength: { value: MAX_SYNOPSIS_LENGTH, errorMessage: `Too long Medium Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: synopsis ? this.handleFieldLength(synopsis.shortDescription) === MAX_SYNOPSIS_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {synopsis ? this.handleFieldLength(synopsis.shortDescription) : 0}/{MAX_SYNOPSIS_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Long Synopsis</b>
                    </Col>
                    <Col>
                        <AvField
                            type="textarea"
                            id="editorialLongSynopsis"
                            name={this.getNameWithPrefix('longDescription')}
                            onChange={this.props.handleSynopsisChange}
                            cols={20}
                            rows={5}
                            style={{ resize: 'none' }}
                            validate={{
                                    maxLength: { value: MAX_SYNOPSIS_LENGTH, errorMessage: `Too long Long Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: synopsis ? this.handleFieldLength(synopsis.longDescription) === MAX_SYNOPSIS_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {synopsis ? this.handleFieldLength(synopsis.longDescription) : 0}/{MAX_SYNOPSIS_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col>
                        <PersonList
                            personLabel={CAST_LABEL}
                            personHtmlFor={CAST_HTML_FOR}
                            personListLabel={CAST_LIST_LABEL}
                            personHeader={CAST_HEADER}
                            type={CAST}
                            persons={getFilteredCastList(castCrew, false, true)}
                            filterPersonList={getFilteredCastList}
                            removePerson={(person) => this.handleEditorialRemovePerson(person, castCrew)}
                            loadOptionsPerson={this.loadOptionsPerson}
                            addPerson={(person) => this.handleEditorialAddPerson(person, castCrew)}
                            isMultiColumn={true}
                            getFormatTypeName={getFormatTypeName}
                            showPersonType={true}
                            handleAddCharacterName={this.props.handleAddEditorialCharacterName}
                            onReOrder={(newArray) => this.castAndCrewReorder(newArray, CAST, castCrew)}
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
                            removePerson={(person) => this.handleEditorialRemovePerson(person, castCrew)}
                            loadOptionsPerson={this.loadOptionsPerson}
                            addPerson={(person) => this.handleEditorialAddPerson(person, castCrew)}
                            getFormatTypeName={getFormatTypeName}
                            isMultiColumn={false}
                            showPersonType={true}
                            onReOrder={(newArray) => this.castAndCrewReorder(newArray, CREW, castCrew)}
                        />
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Copyright</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialCopyright"
                            name={this.getNameWithPrefix('copyright')}
                            onChange={this.props.handleChange}
                            validate={{
                                    maxLength: { value: MAX_COPYRIGHT_LENGTH, errorMessage: `Too long Copyright. Max ${MAX_COPYRIGHT_LENGTH} symbols.` }
                                }}
                        />
                        <span style={{ float: 'right', color: copyright ? this.handleFieldLength(copyright) === MAX_COPYRIGHT_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                            {copyright ? this.handleFieldLength(copyright) : 0}/{MAX_COPYRIGHT_LENGTH} char
                        </span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Awards</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialAwards"
                            name={this.getNameWithPrefix('awards')}
                            onChange={this.props.handleChange}
                            validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Awards. Max 500 symbols.' }
                                }}
                        />
                        <span style={{ float: 'right', color: awards ? this.handleFieldLength(awards) === 500 ? 'red' : '#111' : '#111', fontSize: '13px' }}>{awards ? this.handleFieldLength(awards) : 0}/500 char</span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Sasktel Inventory ID</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialSasktelInventoryID"
                            name={this.getNameWithPrefix('sasktelInventoryId')}
                            onChange={this.props.handleChange}
                            validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Sasktel Inventory ID. Max 200 symbols.' }
                                }}
                        />
                        <span style={{ float: 'right', color: sasktelInventoryId ? this.handleFieldLength(sasktelInventoryId) === 200 ? 'red' : '#111' : '#111', fontSize: '13px' }}>{sasktelInventoryId ? this.handleFieldLength(sasktelInventoryId) : 0}/200 char</span>
                    </Col>
                </Row>
                <Row style={{ padding: '15px' }}>
                    <Col md={2}>
                        <b>Sasktel Lineup ID</b>
                    </Col>
                    <Col>
                        <AvField
                            type="text"
                            id="editorialSasktelLineupID"
                            name={this.getNameWithPrefix('sasktelLineupId')}
                            onChange={this.props.handleChange}
                            validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Sasktel Lineup ID. Max 200 symbols.' }
                                }}
                        />
                        <span style={{ float: 'right', color: sasktelLineupId ? this.handleFieldLength(sasktelLineupId) === 200 ? 'red' : '#111' : '#111', fontSize: '13px' }}>{sasktelLineupId ? this.handleFieldLength(sasktelLineupId) : 0}/200 char</span>
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
    titleContentType: PropTypes.string,
    editorialMetadataForCreate: PropTypes.object,
    configLanguage: PropTypes.object,
    configLocale: PropTypes.object,
    configGenre: PropTypes.object,
    configCategories: PropTypes.object,
    handleEditorialCastCrewCreate: PropTypes.func,
    handleAddEditorialCharacterName: PropTypes.func,
    handleCategoryChange: PropTypes.func.isRequired,
};


export default connect(mapStateToProps)(EditorialMetadataCreateTab);