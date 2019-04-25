import React, { Component, Fragment } from 'react';
import { Col, Row } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { locale } from '../../../../../constants/locale';
import { language } from '../../../../../constants/language';
import { editorialMetadataService } from '../../../../../constants/metadata/editorialMetadataService';
import { resolutionFormat } from '../../../../../constants/resolutionFormat';
import {
    EDITORIAL_METADATA_PREFIX,
    EDITORIAL_METADATA_SYNOPSIS,
    EDITORIAL_METADATA_TITLE
} from '../../../../../constants/metadata/metadataComponent';

class EditorialMetadataEditMode extends Component {
    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(nextProps) {
    //     let differentTitleContentType = this.props.titleContentType !== nextProps.titleContentType;
    //     let differentData = this.props.data !== nextProps.data;
    //     return differentData || differentTitleContentType;
    // }

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
        if(!this.props.data.title) {
            this.props.data.title = {};
        }
        if(!this.props.data.synopsis) {
            this.props.data.synopsis = {};
        }
    };

    render() {
        this.prepareFieldsForUpdate();
        const { synopsis, title, copyright, awards, seriesName } = this.props.data;
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
                                value={this.props.data.locale}>
                                {
                                    locale && locale.map((item, i) => {
                                        return <option key={i} value={item.localeCode}>{item.countryName}</option>;
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
                                value={this.props.data.language}>
                                {
                                    language && language.map((item, i) => {
                                        return <option key={i} value={item.code}>{item.language}</option>;
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
                                value={this.props.data.format}>
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
                                value={this.props.data.service}>
                                <option value={''}>Select Service</option>
                                {
                                    editorialMetadataService && editorialMetadataService.map((item, i) => {
                                        return <option key={i} value={item}>{item}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                    </Row>

                    {(this.props.titleContentType === 'EPISODE' || this.props.titleContentType === 'SEASON') &&
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
                                    value={this.props.data.seriesName}/>
                                <span style={{float:'right', fontSize: '13px', color: seriesName ? this.handleFieldLength(seriesName) === 200 ? 'red' : '#111' : '#111'}}>{seriesName ? this.handleFieldLength(seriesName)  : 0}/200 char</span>
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
                                    value={this.props.data.seasonNumber}/>
                            </Col>
                            {this.props.titleContentType === 'EPISODE' &&
                                <Col md={2}>
                                    <b>Episode Number</b>
                                </Col>}
                            {this.props.titleContentType === 'EPISODE' &&
                                <Col>
                                    <AvField type="number" id="editorialEpisodeNumber" name={this.getNameWithPrefix('episodeNumber')}
                                       onChange={(e) => this.props.handleChange(e, this.props.data)}
                                        validate={{
                                            pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                            maxLength: { value: 3, errorMessage: 'Max 3 digits' }
                                        }}
                                        value={this.props.data.episodeNumber}/>
                                </Col>
                            }
                        </Row>}

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Display Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialDisplayTitle" name={this.getEditorialTitlePrefix('title')}
                               onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Display Title. Max 200 symbols.' }
                                }}
                                value={this.props.data.title.title}/>
                                <span style={{float:'right', fontSize: '13px', color: title ? this.handleFieldLength(title.title) === 200 ? 'red' : '#111' : '#111'}}>{title ? this.handleFieldLength(title.title)  : 0}/200 char</span>
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
                                    maxLength: { value: 200, errorMessage: 'Too long Brief Title. Max 200 symbols.' }
                                }}
                                value={this.props.data.title.shortTitle}/>
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.shortTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.shortTitle)  : 0}/200 char</span>
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
                                    maxLength: { value: 200, errorMessage: 'Too long Medium Title. Max 200 symbols.' }
                                }}
                                value={this.props.data.title.mediumTitle}/>
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.mediumTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.mediumTitle)  : 0}/200 char</span>
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
                                    maxLength: { value: 200, errorMessage: 'Too long Long Title. Max 200 symbols.' }
                                }}
                                value={this.props.data.title.longTitle}/>
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.longTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.longTitle)  : 0}/200 char</span>
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
                                    maxLength: { value: 200, errorMessage: 'Too long Sort Title. Max 200 symbols.' }
                                }}
                                value={this.props.data.title.sortTitle}/>
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.sortTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.sortTitle)  : 0}/200 char</span>
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
                                    maxLength: { value: 500, errorMessage: 'Too long Short Synopsis. Max 500 symbols.' }
                                }}
                                value={this.props.data.synopsis.description}/>
                                <span style={{float:'right', color: synopsis ? this.handleFieldLength(synopsis.description) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{synopsis ? this.handleFieldLength(synopsis.description)  : 0}/500 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Medium Synopsis</b>
                        </Col>
                        <Col>
                            <AvField type="textarea" id="editorialMediumSynopsis" name={this.getSynopsisPrefix('shortDescription')}
                                cols={20} rows={5}
                                style={{ resize: 'none' }}
                               onChange={(e) => this.props.handleChange(e, this.props.data)}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Medium Synopsis. Max 500 symbols.' }
                                }}
                                value={this.props.data.synopsis.shortDescription}/>
                                <span style={{float:'right', color: synopsis ? this.handleFieldLength(synopsis.shortDescription) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{synopsis ? this.handleFieldLength(synopsis.shortDescription)  : 0}/500 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Long Synopsis</b>
                        </Col>                        <Col>
                            <AvField type="textarea" id="editorialLongSynopsis" name={this.getSynopsisPrefix('longDescription')}
                               onChange={(e) => this.props.handleChange(e, this.props.data)}
                                cols={20} rows={5}
                                style={{ resize: 'none' }}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Long Synopsis. Max 500 symbols.' }
                                }}
                                value={this.props.data.synopsis['longDescription']}/>
                            <span style={{float:'right', color: synopsis ? this.handleFieldLength(synopsis.longDescription) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{synopsis ? this.handleFieldLength(synopsis.longDescription)  : 0}/500 char</span>
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
                                    maxLength: { value: 200, errorMessage: 'Too long Copyright. Max 200 symbols.' }
                                }}
                                value={this.props.data.copyright}/>
                                <span style={{float:'right', color: copyright ? this.handleFieldLength(copyright) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{copyright ? this.handleFieldLength(copyright)  : 0}/200 char</span>
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
                                value={this.props.data.awards}/>
                                 <span style={{float:'right', color: awards ? this.handleFieldLength(awards) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{awards ? this.handleFieldLength(awards)  : 0}/500 char</span>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

EditorialMetadataEditMode.propTypes = {
    handleChange: PropTypes.func.isRequired,
    data: PropTypes.object,
    validSubmit: PropTypes.func.isRequired,
    titleContentType: PropTypes.string,
};


export default EditorialMetadataEditMode;