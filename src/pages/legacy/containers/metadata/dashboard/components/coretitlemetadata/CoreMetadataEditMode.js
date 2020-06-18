import React, { Component } from 'react';
import {
    FormGroup,
    Label,
    Row,
    Col
} from 'reactstrap';
import './CoreMetadata.scss';
import PropTypes from 'prop-types';
import { AvField } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { configFields, searchPerson } from '../../../service/ConfigService';
import {
    CAST,
    getFilteredCrewList, 
    getFilteredCastList, 
    getFormatTypeName, 
    CREW,
    PERSONS_PER_REQUEST
} from '../../../../../constants/metadata/configAPI';
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
import Rating from './rating/Rating';
import PersonList from './PersonList';
import NexusTagsContainer from '../../../../../../../ui/elements/nexus-tags-container/NexusTagsContainer';

const mapStateToProps = state => {
    return {
        configRatings: state.titleReducer.configData.find(e => e.key === configFields.RATINGS),
    };
};

const dummyMSV = ['Verizon Technology^00^ATMP0000000000017037', 'Paramount1234', 'Bla Bla','Verizon Technology^00^ATMP0000003000017067', 'Verizon Technology^00^ATMP0000010000017067', 'Verizon Technology^00^ATMP0000000000017067'];

class CoreMetadataEditMode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ratings: [],
            externalIDs: {},
        };
        this.handleMSVIDs = this.handleMSVIDs.bind(this);
    }

    handleRatingSystemValue = (e) => {
    const rating = e.target.value;
    const newRatings = this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === rating);
    this.setState({
        ratings: newRatings
    });

  };

    handleMovidaLegacyIds(e) {
        const movidaLegacyId = { movida: { [e.target.name]: e.target.value } };
        this.props.handleOnLegacyIds(movidaLegacyId);
    }

    handleVzLegacyIds(e) {
        const vzLegacyId = { vz: { [e.target.name]: e.target.value } };
        this.props.handleOnLegacyIds(vzLegacyId);
    }

    loadOptionsPerson = (searchPersonText, type) => {
        if (searchPersonText.length < 2) return [];
        if (type === CAST) {
            return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CAST)
                .then(res => getFilteredCastList(res.data, true).map(e => {return {id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase()  , original: JSON.stringify(e)};})
            );
        } else {
            return searchPerson(searchPersonText, PERSONS_PER_REQUEST, CREW)
                .then(res => getFilteredCrewList(res.data, true).map(e => {return {id: e.id, name: e.displayName, byline: e.personType.toString().toUpperCase(), original: JSON.stringify(e)};})
            );
        }
    };

    handleMSVIDs(data)  {
        /* TODO: modify to save data locally or in the consumer component to send saved data to put api */
        this.setState({
            externalIDs: { ...this.state.externalIDs, msvAssociationId: data}
        });
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <PersonList
                            handleAddCharacterName={this.props.handleAddCharacterName}
                            personLabel={CAST_LABEL}
                            personHtmlFor={CAST_HTML_FOR}
                            personListLabel={CAST_LIST_LABEL}
                            personHeader={CAST_HEADER}
                            type={CAST}
                            persons={getFilteredCastList(this.props.editedTitle.castCrew, false)}
                            removePerson={this.props.removeCastCrew}
                            loadOptionsPerson={this.loadOptionsPerson}
                            addPerson={this.props.addCastCrew}
                            showPersonType={true}
                            isMultiColumn={true}
                            getFormatTypeName={getFormatTypeName}
                            onReOrder={(newArray) => this.props.castAndCrewReorder(newArray, CAST)}
                        />
                    </Col>
                    <Col>
                        <PersonList
                            personLabel={CREW_LABEL}
                            personHtmlFor={CREW_HTML_FOR}
                            personListLabel={CREW_LIST_LABEL}
                            personHeader={CREW_HEADER}
                            type={CREW}
                            persons={getFilteredCrewList(this.props.editedTitle.castCrew, false)}
                            removePerson={this.props.removeCastCrew}
                            loadOptionsPerson={this.loadOptionsPerson}
                            addPerson={this.props.addCastCrew}
                            getFormatTypeName={getFormatTypeName}
                            showPersonType={true}
                            isMultiColumn={false}
                            onReOrder={(newArray) => this.props.castAndCrewReorder(newArray, CREW)}
                        />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Rating
                        isEditMode={true}
                        ratings={this.props.ratings}
                        areRatingFieldsRequired={this.props.areRatingFieldsRequired}
                        ratingObjectForCreate={this.props.ratingObjectForCreate}
                        filteredRatings={this.state.ratings}
                        activeTab={this.props.titleRankingActiveTab}
                        toggle={this.props.toggleTitleRating}
                        addRating={this.props.addTitleRatingTab}
                        createRatingTab={this.props.createRatingTab}
                        handleEditChange={this.props.handleRatingEditChange}
                        handleRatingCreateChange={this.props.handleRatingCreateChange}
                        handleRatingSystemValue={this.props.handleRatingSystemValue}
                    />
                </Row>

                <hr />
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='awards'>Awards</Label>
                            <AvField
                                type='text'
                                name='awards'
                                onChange={e => this.props.onChange(e)}
                                id='awards'
                                value={this.props.data.awards ? this.props.data.awards : ''}
                                placeholder='Awards'
                                validate={{
                      maxLength: { value: 500 }
                    }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='imdbLink'>IMDb Link</Label>
                            <AvField
                                type='text'
                                name='imdbLink'
                                onChange={e => this.props.onChange(e)}
                                id='imdbLink'
                                value={this.props.data.imdbLink ? this.props.data.imdbLink : ''}
                                placeholder='IMDb Link'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <hr />
                <h4>External IDS</h4>
                <div id="coreMetadataEditMode">
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='assetName'>Asset Name </Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='assetName'
                                id='assetName'
                                value={this.props.data.externalIds ? this.props.data.externalIds.assetName : ''}
                                placeholder='Asset Name'
                                validate={{
                                    maxLength: { value: 200 }
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='eidrTitleId'>EIDR Title ID </Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='eidrTitleId'
                                id='eidrTitleId'
                                value={this.props.data.externalIds ? this.props.data.externalIds.eidrTitleId : ''}
                                placeholder='EIDR Title ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for='tmsId'>TMS ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                name='tmsId'
                                id='tmsId'
                                value={this.props.data.externalIds ? this.props.data.externalIds.tmsId : ''}
                                onChange={e => this.props.handleOnExternalIds(e)}
                                placeholder='TMS ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='eidrEditId'>EIDR Edit ID </Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='eidrEditId'
                                id='eidrEditId'
                                value={this.props.data.externalIds ? this.props.data.externalIds.eidrEditId : ''}
                                placeholder='EIDR Edit ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for='xfinityMovieId'>Xfinity Movie ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='xfinityMovieId'
                                id='xfinityMovieId'
                                value={this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId : ''}
                                placeholder='Xfiniy Movie ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='dmaId'>MA ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                name='maId'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                id='maId'
                                value={this.props.data.externalIds ? this.props.data.externalIds.maId : ''}
                                placeholder='MA ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for='licensorTitleId'>Licensor Title ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='licensorTitleId'
                                id='licensorTitleId'
                                value={this.props.data.externalIds ? this.props.data.externalIds.licensorTitleId : ''}
                                placeholder='Licensor Title ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='isan'>ISAN</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='isan'
                                id='isan'
                                value={this.props.data.externalIds ? this.props.data.externalIds.isan : ''}
                                placeholder='ISAN'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>

                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='alid'>ALID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='alid'
                                id='alid'
                                value={this.props.data.externalIds ? this.props.data.externalIds.alid : ''}
                                placeholder='ALID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for='vzId'>VZ Title ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.handleVzLegacyIds(e)}
                                name='vzTitleId'
                                id='vzTitleId'
                                value={this.props.data.legacyIds && this.props.data.legacyIds.vz ? this.props.data.legacyIds.vz.vzTitleId : ''}
                                placeholder='VZ ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='cid'>C ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='cid'
                                id='cid'
                                value={this.props.data.externalIds ? this.props.data.externalIds.cid : ''}
                                placeholder='C ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for='movidaId'>Movida ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.handleMovidaLegacyIds(e)}
                                name='movidaId'
                                id='movidaId'
                                value={this.props.data.legacyIds && this.props.data.legacyIds.movida ? this.props.data.legacyIds.movida.movidaId : ''}
                                placeholder='Movie ID'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col md={1}>
                            <Label for='isrc'>ISRC</Label>
                        </Col>
                        <Col>
                            <AvField
                                type='text'
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name='isrc'
                                id='isrc'
                                value={this.props.data.externalIds ? this.props.data.externalIds.isrc : ''}
                                placeholder='ISRC'
                                validate={{
                      maxLength: { value: 200 }
                    }}
                            />
                        </Col>

                        <Col md={1}>
                            <Label for='movidaTitleId'>Movida Title ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                readOnly
                                type='text'
                                name='movidaTitleId'
                                id='movidaTitleId'
                                value={this.props.data.legacyIds && this.props.data.legacyIds.movida ? this.props.data.legacyIds.movida.movidaTitleId : ''}
                                placeholder='Movida Title ID'
                            />
                        </Col>
                    </Row>
                    <Col md={1}>
                        <Label for='vzId'>VZ Vendor ID</Label>
                    </Col>
                    <Col>
                        <AvField
                            type='text'
                            onChange={e => this.handleVzLegacyIds(e)}
                            name='vzId'
                            id='vzId'
                            value={this.props.data.legacyIds && this.props.data.legacyIds.vz ? this.props.data.legacyIds.vz.vzId : ''}
                            placeholder='VZ ID'
                            validate={{
                                maxLength: { value: 200 }
                            }}
                        />
                    </Col>

                        <Col md={2}>
                            <Label for='overrideMsvAssociationId'>
                                Override MSV Association ID
                            </Label>
                        </Col>
                        <Col>
                            <NexusTagsContainer data={ (this.props.data.externalIds && this.props.data.externalIds.msvAssociationId) || dummyMSV} saveData={this.handleMSVIDs} />
                        </Col>
                </div>
            </>
        );
    }
}

CoreMetadataEditMode.propTypes = {
    titleRankingActiveTab: PropTypes.any,
    toggleTitleRating: PropTypes.func,
    addTitleRatingTab: PropTypes.func,
    createRatingTab: PropTypes.string,
    handleRatingEditChange: PropTypes.func,
    handleRatingCreateChange: PropTypes.func,
    data: PropTypes.object,
    editedTitle: PropTypes.object,
    onChange: PropTypes.func,
    handleOnExternalIds: PropTypes.func,
    handleOnLegacyIds: PropTypes.func,
    removeCastCrew: PropTypes.func,
    castCrew: PropTypes.array,
    addCastCrew: PropTypes.func,
    ratings: PropTypes.array,
    configRatings: PropTypes.object,
    handleRatingSystemValue: PropTypes.func,
    ratingObjectForCreate: PropTypes.object,
    areRatingFieldsRequired: PropTypes.bool,
    castAndCrewReorder: PropTypes.func,
    handleAddCharacterName: PropTypes.func
};


export default connect(mapStateToProps)(CoreMetadataEditMode);
