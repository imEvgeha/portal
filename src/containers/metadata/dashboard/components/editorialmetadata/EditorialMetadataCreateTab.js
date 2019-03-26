import React, { Component, Fragment } from 'react';
import { Col, Row } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { locale } from '../../../../../constants/locale';
import { language } from '../../../../../constants/language';
import { editorialMetadataService } from '../../../../../constants/metadata/editorialMetadataService';
import { resolutionFormat } from '../../../../../constants/resolutionFormat';
import {EDITORIAL_METADATA_PREFIX} from '../../../../../constants/metadata/metadataComponent';

class EditorialMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorialMetadata: [],
            activeTab: 0
        };
    }

    handleFieldLength = (name) => {
        return name ? name.length : 0;
    }

    getNameWithPrefix(name) {
        return EDITORIAL_METADATA_PREFIX + name;
    }

    render() {
        const { synopsis, title, copyright, awards, seriesName } = this.props.editorialMetadataForCreate;
        return (
            <div id="editorialContainer">
                <Fragment>
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <b>Locale<span style={{ color: 'red' }}>*</span></b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                name={this.getNameWithPrefix('locale')}
                                id="editorialLocal"
                                required={this.props.areFieldsRequired}
                                onChange={this.props.handleChange}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select Locale</option>
                                {
                                    locale && locale.map((item, i) => {
                                        return <option key={i} value={item.localeCode}>{item.countryName}</option>;
                                    })
                                }
                            </AvField>
                        </Col>
                        <Col>
                            <b>Language<span style={{ color: 'red' }}>*</span></b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                name={this.getNameWithPrefix('language')}
                                id="editorialLanguage"
                                required={this.props.areFieldsRequired}
                                onChange={this.props.handleChange}
                                errorMessage="Field cannot be empty!">
                                <option value={''}>Select Language</option>
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
                                onChange={this.props.handleChange}>
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
                                onChange={this.props.handleChange}>
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
                                <AvField type="tex" id="editorialSeriesName" name={this.getNameWithPrefix('seriesName')}
                                    onChange={this.props.handleChange}
                                    validate={{
                                        maxLength: { value: 200, errorMessage: 'Too long Series Name. Max 200 symbols.' }
                                    }} />
                                <span style={{float:'right', fontSize: '13px', color: seriesName ? this.handleFieldLength(seriesName) === 200 ? 'red' : '#111' : '#111'}}>{seriesName ? this.handleFieldLength(seriesName)  : 0}/200 char</span>
                            </Col>
                            <Col md={2}>
                                <b>Season Number</b>
                            </Col>
                            <Col>
                                <AvField type="number" id="editorialSeasonNumber" name={this.getNameWithPrefix('seasonNumber')}
                                    onChange={this.props.handleChange}
                                    validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                        maxLength: { value: 3, errorMessage: 'Max 3 digits' }
                                    }} />
                            </Col>
                            {this.props.titleContentType === 'EPISODE' &&
                                <Col md={2}>
                                    <b>Episode Number</b>
                                </Col>}
                            {this.props.titleContentType === 'EPISODE' &&
                                <Col>
                                    <AvField type="number" id="editorialEpisodeNumber" name={this.getNameWithPrefix('episodeNumber')}
                                        onChange={this.props.handleChange}
                                        validate={{
                                            pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number' },
                                            maxLength: { value: 3, errorMessage: 'Max 3 digits' }
                                        }} />
                                </Col>
                            }
                        </Row>}

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Display Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialDisplayTitle" name={this.getNameWithPrefix('title')}
                                onChange={this.props.handleTitleChange}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Display Title. Max 200 symbols.' }
                                }} />
                                <span style={{float:'right', fontSize: '13px', color: title ? this.handleFieldLength(title.title) === 200 ? 'red' : '#111' : '#111'}}>{title ? this.handleFieldLength(title.title)  : 0}/200 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Brief Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialBriefTitle" name={this.getNameWithPrefix('shortTitle')}
                                onChange={this.props.handleTitleChange}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Brief Title. Max 200 symbols.' }
                                }} />
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.shortTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.shortTitle)  : 0}/200 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Medium Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialMediumTitle" name={this.getNameWithPrefix('mediumTitle')}
                                onChange={this.props.handleTitleChange}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Medium Title. Max 200 symbols.' }
                                }} />
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.mediumTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.mediumTitle)  : 0}/200 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Long Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialLongTitle" name={this.getNameWithPrefix('longTitle')}
                                onChange={this.props.handleTitleChange}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Long Title. Max 200 symbols.' }
                                }} />
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.longTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.longTitle)  : 0}/200 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Sort Title</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialSortTitle" name={this.getNameWithPrefix('sortTitle')}
                                onChange={this.props.handleTitleChange}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Sort Title. Max 200 symbols.' }
                                }} />
                                <span style={{float:'right', color: title ? this.handleFieldLength(title.sortTitle) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{title ? this.handleFieldLength(title.sortTitle)  : 0}/200 char</span>
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Short Synopsis</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialShortSynopsis" name={this.getNameWithPrefix('description')}
                                onChange={this.props.handleSynopsisChange}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Short Synopsis. Max 500 symbols.' }
                                }} />
                                <span style={{float:'right', color: synopsis ? this.handleFieldLength(synopsis.description) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{synopsis ? this.handleFieldLength(synopsis.description)  : 0}/500 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Medium Synopsis</b>
                        </Col>
                        <Col>
                            <AvField type="textarea" id="editorialMediumSynopsis" name={this.getNameWithPrefix('shortDescription')}
                                cols={20} rows={5}
                                style={{ resize: 'none' }}
                                onChange={this.props.handleSynopsisChange}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Medium Synopsis. Max 500 symbols.' }
                                }} />
                                <span style={{float:'right', color: synopsis ? this.handleFieldLength(synopsis.shortDescription) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{synopsis ? this.handleFieldLength(synopsis.shortDescription)  : 0}/500 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Long Synopsis</b>
                        </Col>
                        <Col>
                            <AvField type="textarea" id="editorialLongSynopsis" name={this.getNameWithPrefix('longDescription')}
                                onChange={this.props.handleSynopsisChange}
                                cols={20} rows={5}
                                style={{ resize: 'none' }}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Long Synopsis. Max 500 symbols.' }
                                }} />                                
                            <span style={{float:'right', color: synopsis ? this.handleFieldLength(synopsis.longDescription) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{synopsis ? this.handleFieldLength(synopsis.longDescription)  : 0}/500 char</span>
                        </Col>
                    </Row>

                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Copyright</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialCopyright" name={this.getNameWithPrefix('copyright')}
                                onChange={this.props.handleChange}
                                validate={{
                                    maxLength: { value: 200, errorMessage: 'Too long Copyright. Max 200 symbols.' }
                                }} />
                                <span style={{float:'right', color: copyright ? this.handleFieldLength(copyright) === 200 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{copyright ? this.handleFieldLength(copyright)  : 0}/200 char</span>
                        </Col>
                    </Row>
                    <Row style={{ padding: '15px' }}>
                        <Col md={2}>
                            <b>Awards</b>
                        </Col>
                        <Col>
                            <AvField type="text" id="editorialAwards" name={this.getNameWithPrefix('awards')}
                                onChange={this.props.handleChange}
                                validate={{
                                    maxLength: { value: 500, errorMessage: 'Too long Awards. Max 500 symbols.' }
                                }} />
                                 <span style={{float:'right', color: awards ? this.handleFieldLength(awards) === 500 ? 'red' : '#111' : '#111', fontSize: '13px'}}>{awards ? this.handleFieldLength(awards)  : 0}/500 char</span>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

EditorialMetadataCreateTab.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleTitleChange: PropTypes.func.isRequired,
    handleSynopsisChange: PropTypes.func.isRequired,
    areFieldsRequired: PropTypes.bool.isRequired,
    titleContentType: PropTypes.string,
    editorialMetadataForCreate: PropTypes.object
};


export default EditorialMetadataCreateTab;