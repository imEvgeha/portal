import React, {Component, Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import {AvField} from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import {locale} from '../../../../../constants/locale';
import {language} from '../../../../../constants/language';
import {editorialMetadataService} from '../../../../../constants/metadata/editorialMetadataService';
import {resolutionFormat} from '../../../../../constants/resolutionFormat';

class EditorialMetadataCreateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorialMetadata: [],
            activeTab: 0
        };
    }

    render() {
        return (
            <div id="editorialContainer">
                <Fragment>
                    <Row style={{padding: '15px'}}>
                        <Col>
                            <b>Locale<span style={{color: 'red'}}>*</span></b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                     name="locale"
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
                            <b>Language<span style={{color: 'red'}}>*</span></b>
                        </Col>
                        <Col md={2}>
                            <AvField type="select"
                                     name="language"
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
                                     name="format"
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
                                     name="service"
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
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Series Name</b>
                        </Col>
                        <Col>
                            <AvField type="number" id="editorialSeriesName" name="seriesName"
                                     onChange={this.props.handleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Series Name. Max 200 symbols.'}
                                     }}/>
                        </Col>
                        <Col md={2}>
                            <b>Season Number</b>
                        </Col>
                        <Col>
                            <AvField type="number" id="editorialSeriesNumber" name="seriesNumber"
                                     onChange={this.props.handleChange}
                                     validate={{
                                         pattern: {value: '^[0-9]+$', errorMessage: 'Please enter a number'},
                                         maxLength: {value: 3, errorMessage: 'Max 3 digits'}
                                     }}/>
                        </Col>
                        {this.props.titleContentType === 'EPISODE' &&
                        <Col md={2}>
                            <b>Season Number</b>
                        </Col>}
                        {this.props.titleContentType === 'EPISODE' &&
                        <Col>
                            <AvField type="number" id="editorialEpisodeNumber" name="episodeNumber"
                                     onChange={this.props.handleChange}
                                     validate={{
                                         pattern: {value: '^[0-9]+$', errorMessage: 'Please enter a number'},
                                         maxLength: {value: 3, errorMessage: 'Max 3 digits'}
                                     }}/>
                        </Col>
                        }
                    </Row>}

                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Display Title</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialDisplayTitle" name="title"
                                     onChange={this.props.handleTitleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Display Title. Max 200 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Brief Title</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialBriefTitle" name="shortTitle"
                                     onChange={this.props.handleTitleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Brief Title. Max 200 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Medium Title</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialMediumTitle" name="mediumTitle"
                                     onChange={this.props.handleTitleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Medium Title. Max 200 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Long Title</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialLongTitle" name="longTitle"
                                     onChange={this.props.handleTitleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Long Title. Max 200 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Sort Title</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialSortTitle" name="sortTitle"
                                     onChange={this.props.handleTitleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Sort Title. Max 200 symbols.'}
                                     }}/>
                        </Col>
                    </Row>

                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Short Synopsis</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialShortSynopsis" name="description"
                                     onChange={this.props.handleSynopsisChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Short Synopsis. Max 500 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Medium Synopsis</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialMediumSynopsis" name="shortDescription"
                                     onChange={this.props.handleSynopsisChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Medium Synopsis. Max 500 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Long Synopsis</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialLongSynopsis" name="longDescription"
                                     onChange={this.props.handleSynopsisChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Long Synopsis. Max 500 symbols.'}
                                     }}/>
                        </Col>
                    </Row>

                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Copyright</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialCopyright" name="copyright"
                                     onChange={this.props.handleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Copyright. Max 200 symbols.'}
                                     }}/>
                        </Col>
                    </Row>
                    <Row style={{padding: '15px'}}>
                        <Col md={2}>
                            <b>Awards</b>
                        </Col>
                        <Col md={2}>
                            <AvField type="text" id="editorialAwards" name="awards"
                                     onChange={this.props.handleChange}
                                     validate={{
                                         maxLength: {value: 200, errorMessage: 'Too long Awards. Max 200 symbols.'}
                                     }}/>
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
    titleContentType: PropTypes.string
};


export default EditorialMetadataCreateTab;