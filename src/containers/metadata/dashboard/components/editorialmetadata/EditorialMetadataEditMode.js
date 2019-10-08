import React, { Component, Fragment } from 'react';
import { Col, Label, Row } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { editorialMetadataService } from '../../../../../constants/metadata/editorialMetadataService';
import { resolutionFormat } from '../../../../../constants/resolutionFormat';
import {
    EDITORIAL_METADATA_PREFIX,
    EDITORIAL_METADATA_SYNOPSIS,
    EDITORIAL_METADATA_TITLE
} from '../../../../../constants/metadata/metadataComponent';
import { configFields, searchPerson } from '../../../service/ConfigService';
import { connect } from 'react-redux';
import Select from 'react-select';
import { EPISODE, SEASON } from '../../../../../constants/metadata/contentType';

import PersonList from '../coretitlemetadata/PersonList'; import {
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
    PERSONS_PER_REQUEST
} from '../../../../../constants/metadata/configAPI';

import constants from '../../../MetadataConstants';

const mapStateToProps = state => {
    return {
        configLanguage: state.titleReducer.configData.find(e => e.key === configFields.LANGUAGE),
        configLocale: state.titleReducer.configData.find(e => e.key === configFields.LOCALE),
        configGenre: state.titleReducer.configData.find(e => e.key === configFields.GENRE),
    };
};

class EditorialMetadataEditMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genres: [],
            showGenreError: false
        };
    }

    componentDidMount() {
        let newGenres = this.props.data.genres ? this.props.data.genres : [];
        this.setState({
            genres: newGenres
        });
    }

    handleGenre = (e) => {
        if (e.length > 3) {
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
            this.setState({
                genres: e
            });
        }
        this.props.handleGenreEditChange(this.props.data, e);
    };


    shouldComponentUpdate(nextProps) {
        let differentTitleContentType = this.props.titleContentType !== nextProps.titleContentType;
        let differentData = this.props.data !== nextProps.data;
        let differentUpdatedData = this.props.updatedEditorialMetadata.filter(e => e.id === this.props.data.id) !== nextProps.updatedEditorialMetadata.filter(e => e.id === nextProps.data.id);
        return differentData || differentTitleContentType || differentUpdatedData;
    }

    handleFieldLength = (name) => {
        return name ? name.length : 0;
    }

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
        this.props.handleEditorialCastCrew(newCastCrewList, this.props.data);
    }

    handleEditorialAddPerson = (person, castCrew) => {
        let newCastCrewList = [person];
        if (castCrew) {
            newCastCrewList = [...castCrew, person];
        }
        this.props.handleEditorialCastCrew(newCastCrewList, this.props.data);
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

        let castAndCrewList = [...castList, ...crewList];
        this.props.handleEditorialCastCrew(castAndCrewList, this.props.data);
    }

    render() {
        this.prepareFieldsForUpdate();
        const updateData = this.props.updatedEditorialMetadata.find(e => e.id === this.props.data.id);
        const { locale, language, format, service, seriesName, seasonNumber, episodeNumber, synopsis, title, copyright, awards, sasktelInventoryId, sasktelLineupId, castCrew } = updateData ? updateData : this.props.data;
        const { MAX_TITLE_LENGTH, MAX_MEDIUM_TITLE_LENGTH, MAX_BRIEF_TITLE_LENGTH,
            MAX_SORT_TITLE_LENGTH, MAX_SYNOPSIS_LENGTH, MAX_COPYRIGHT_LENGTH } = constants;
        return (
            <div id="editorialMetadataEdit">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Locale</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                name={this.getNameWithPrefix('locale')}
                                id="editorialLocal"
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                value={locale}>
                                {
                                    this.props.configLocale && this.props.configLocale.value.map((e, index) => {
                                        return <option key={index} value={e.countryCode}>{e.countryName}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                        <Col>
                            <b>Language</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                name={this.getNameWithPrefix('language')}
                                id="editorialLanguage"
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                value={language}>
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
                            <AvField type="select"
                                name={this.getNameWithPrefix('format')}
                                id="editorialFormat"
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                value={format}>
                                <option value={''}>Select Format</option>
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
                            <AvField type="select"
                                name={this.getNameWithPrefix('service')}
                                id="editorialService"
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                value={service}>
                                <option value={''}>Select Service</option>
                                {
                                    editorialMetadataService && editorialMetadataService.map((item, i) => {
                                        return <option key={i} value={item}>{item}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                    </Row>

                    {(this.props.titleContentType === EPISODE.apiName || this.props.titleContentType === SEASON.apiName) &&
                        <Row style={{ padding: '15px' }}>
                            <Col md={2}>
                                <b>Series Name</b>
                            </Col>
                            <Col>
                                <AvField type="text" id="editorialSeriesName" name={this.getNameWithPrefix('seriesName')}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    validate={{
                                        maxLength: { value: 200, errorMessage: 'Too long Series Name. Max 200 symbols.' }
                                    }}
                                    value={seriesName} />
                                <span style={{ float: 'right', fontSize: '13px', color: seriesName ? this.handleFieldLength(seriesName) === 200 ? 'red' : '#111' : '#111' }}>{seriesName ? this.handleFieldLength(seriesName) : 0}/200 char</span>
                            </Col>
                            <Col md={2}>
                                <b>Season Number</b>
                            </Col>
                            <Col>
                                <AvField type="number" id="editorialSeasonNumber" name={this.getNameWithPrefix('seasonNumber')}
                                    onChange={(e) => this.props.handleChange(e, this.props.data)}
                                    validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                        maxLength: { value: 3, errorMessage: 'Max 3 digits' }
                                    }}
                                    value={seasonNumber} />
                            </Col>
                            {this.props.titleContentType === EPISODE.apiName &&
                                <Col md={2}>
                                    <b>Episode Number</b>
                                </Col>}
                            {this.props.titleContentType === EPISODE.apiName &&
                                <Col>
                                    <AvField type="number" id="editorialEpisodeNumber" name={this.getNameWithPrefix('episodeNumber')}
                                        onChange={(e) => this.props.handleChange(e, this.props.data)}
                                        validate={{
                                            pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                            maxLength: { value: 3, errorMessage: 'Max 3 digits' }
                                        }}
                                        value={episodeNumber} />
                                </Col>
                            }
                        </Row>}

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Genres:</b>
                        </Col>
                        <Col>
                            <Select
                                name={this.getNameWithPrefix('edit-genres')}
                                value={this.state.genres.map(e => {
                                    return { id: e.id, genre: e.genre, value: e.genre, label: e.genre };
                                })}
                                onChange={e => this.handleGenre(e)}
                                isMulti
                                placeholder='Select Genre'
                                options={this.props.configGenre ? this.props.configGenre.value
                                    .filter(e => e.name !== null)
                                    .map(e => { return { id: e.id, genre: e.name, value: e.name, label: e.name }; })
                                    : []}
                            />
                            {this.state.showGenreError && <Label style={{ color: 'red' }}>Max 3 genres</Label>}
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Display Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialDisplayTitle" name={this.getEditorialTitlePrefix('title')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_TITLE_LENGTH,
                                        errorMessage: `Too long Display Title. Max ${MAX_TITLE_LENGTH} symbols.` }
                                }}
                                value={title.title} />
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
                            <AvField type="text" id="editorialBriefTitle" name={this.getEditorialTitlePrefix('shortTitle')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_BRIEF_TITLE_LENGTH, errorMessage: `Too long Brief Title. Max ${MAX_BRIEF_TITLE_LENGTH} symbols.` }
                                }}
                                value={title.shortTitle} />
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
                            <AvField type="text" id="editorialMediumTitle" name={this.getEditorialTitlePrefix('mediumTitle')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_MEDIUM_TITLE_LENGTH, errorMessage: `Too long Medium Title. Max ${MAX_MEDIUM_TITLE_LENGTH} symbols.` }
                                }}
                                value={title.mediumTitle} />
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
                            <AvField type="text" id="editorialLongTitle" name={this.getEditorialTitlePrefix('longTitle')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_TITLE_LENGTH, errorMessage: `Too long Long Title. Max ${MAX_TITLE_LENGTH} symbols.` }
                                }}
                                value={title.longTitle} />
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
                            <AvField type="text" id="editorialSortTitle" name={this.getEditorialTitlePrefix('sortTitle')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_SORT_TITLE_LENGTH, errorMessage: `Too long Sort Title. Max ${MAX_SORT_TITLE_LENGTH} symbols.` }
                                }}
                                value={title.sortTitle} />
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
                            <AvField type="text" id="editorialShortSynopsis" name={this.getSynopsisPrefix('description')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_SYNOPSIS_LENGTH, errorMessage: `Too long Short Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.` }
                                }}
                                value={synopsis.description} />
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
                            <AvField type="text" id="editorialMediumSynopsis" name={this.getSynopsisPrefix('shortDescription')}
                                cols={20} rows={5}
                                style={{ resize: 'none' }}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_SYNOPSIS_LENGTH, errorMessage: `Too long Medium Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.` }
                                }}
                                value={synopsis.shortDescription} />
                            <span style={{ float: 'right', color: synopsis ? this.handleFieldLength(synopsis.shortDescription) === MAX_SYNOPSIS_LENGTH ? 'red' : '#111' : '#111', fontSize: '13px' }}>
                                {synopsis ? this.handleFieldLength(synopsis.shortDescription) : 0}/{MAX_SYNOPSIS_LENGTH} char
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Long Synopsis</b>
                        </Col>                        <Col>
                            <AvField type="text" id="editorialLongSynopsis" name={this.getSynopsisPrefix('longDescription')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                cols={20} rows={5}
                                style={{ resize: 'none' }}
                                validate={{
                                    maxLength: { value: MAX_SYNOPSIS_LENGTH, errorMessage: `Too long Long Synopsis. Max ${MAX_SYNOPSIS_LENGTH} symbols.` }
                                }}
                                value={synopsis.longDescription} />
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
                                getFormatTypeName={getFormatTypeName}
                                showPersonType={true}                                
                                isMultiColumn={true}
                                parentId={this.props.data.id}
                                handleAddCharacterName={this.props.handleAddEditorialCharacterNameEdit}
                                data={this.props.data}
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
                                showPersonType={true}
                                isMultiColumn={false}
                                onReOrder={(newArray) => this.castAndCrewReorder(newArray, CREW, castCrew)}
                            />
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Copyright</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialCopyright" name={this.getNameWithPrefix('copyright')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: MAX_COPYRIGHT_LENGTH, errorMessage: `Too long Copyright. Max ${MAX_COPYRIGHT_LENGTH} symbols.` }
                                }}
                                value={copyright} />
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
                            <AvField type="text" id="editorialAwards" name={this.getNameWithPrefix('awards')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Awards. Max 500 symbols.' }
                                }}
                                value={awards} />
                            <span style={{ float: 'right', color: awards ? this.handleFieldLength(awards) === 500 ? 'red' : '#111' : '#111', fontSize: '13px' }}>{awards ? this.handleFieldLength(awards) : 0}/500 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Sasktel Inventory ID</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialSasktelInventoryID" name={this.getNameWithPrefix('sasktelInventoryId')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Sasktel Inventory ID. Max 200 symbols.' }
                                }}
                                value={sasktelInventoryId} />
                            <span style={{ float: 'right', color: sasktelInventoryId ? this.handleFieldLength(sasktelInventoryId) === 200 ? 'red' : '#111' : '#111', fontSize: '13px' }}>{sasktelInventoryId ? this.handleFieldLength(sasktelInventoryId) : 0}/200 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Sasktel Lineup ID</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="sasktelLineupId" name={this.getNameWithPrefix('sasktelLineupId')}
                                onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Sasktel Lineup ID. Max 200 symbols.' }
                                }}
                                value={sasktelLineupId} />
                            <span style={{ float: 'right', color: sasktelLineupId ? this.handleFieldLength(sasktelLineupId) === 200 ? 'red' : '#111' : '#111', fontSize: '13px' }}>{sasktelLineupId ? this.handleFieldLength(sasktelLineupId) : 0}/200 char</span>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

EditorialMetadataEditMode.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleGenreEditChange: PropTypes.func.isRequired,
    data: PropTypes.object,
    validSubmit: PropTypes.func.isRequired,
    titleContentType: PropTypes.string,
    updatedEditorialMetadata: PropTypes.array,
    configLanguage: PropTypes.object,
    configLocale: PropTypes.object,
    configGenre: PropTypes.object,
    handleEditorialCastCrew: PropTypes.func,
    handleAddEditorialCharacterNameEdit: PropTypes.func
};


export default connect(mapStateToProps)(EditorialMetadataEditMode);