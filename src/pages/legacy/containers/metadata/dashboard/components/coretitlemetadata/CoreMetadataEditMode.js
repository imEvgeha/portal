import React, {Component} from 'react';
import {FormGroup, Label, Row, Col} from 'reactstrap';
import './CoreMetadata.scss';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {AvField} from 'availity-reactstrap-validation';
import {connect} from 'react-redux';
import {configFields} from '../../../service/ConfigService';
import {titleService} from '../../../service/TitleService';
import {
    CAST,
    getFilteredCrewList,
    getFilteredCastList,
    getFormatTypeName,
    CREW,
} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {
    CREW_LIST_LABEL,
    CAST_LIST_LABEL,
    CAST_LABEL,
    CREW_LABEL,
    CAST_HTML_FOR,
    CREW_HTML_FOR,
    CAST_HEADER,
    CREW_HEADER,
    MSV_ASSOCIATION_BTN,
} from '../../../../../constants/metadata/constant-variables';
import TitleSystems from '../../../../../constants/metadata/systems';
import Rating from './rating/Rating';
import PersonList from './PersonList';
import NexusTagsContainer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tags-container/NexusTagsContainer';
import Button from '@atlaskit/button';
import Tooltip from '@material-ui/core/Tooltip';
import {loadOptionsPerson} from '../utils/utils';
import "./CoreMetadata.scss";

const {MOVIDA, VZ} = TitleSystems;

const mapStateToProps = state => {
    return {
        configRatings: state.titleReducer.configData.find(e => e.key === configFields.RATINGS),
        configLicensors: state.titleReducer.configData.find(e => e.key === configFields.LICENSORS),
        configLicensees: state.titleReducer.configData.find(e => e.key === configFields.LICENSEES),
    };
};

const defaultMsvAssociationState = {
    msvIsLoading: false,
    msvLicensor: '',
    msvLicensee: '',
};

const defaultAddLicensorsState = {
    licensorSelected: '',
    licensorTitleId: '',
};

class CoreMetadataEditMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratings: [],
            msvAssociationIds: get(props, 'data.externalIds.msvAssociationId') || [],
            licensors: get(props, 'data.licensors') || [],
            ...defaultMsvAssociationState,
            ...defaultAddLicensorsState,
        };
    }

    handleRatingSystemValue = e => {
        const rating = e.target.value;
        const newRatings =
            this.props.configRatings && this.props.configRatings.value.filter(e => e.ratingSystem === rating);
        this.setState({
            ratings: newRatings,
        });
    };

    loadOptionsPerson = (searchPersonText, type) => {
        if (searchPersonText.length < 2) return [];
        return loadOptionsPerson(searchPersonText, type);
    };

    handleMSVIDs = data => {
        this.setState({
            msvAssociationIds: data,
        });

        this.props.handleOnMsvIds(data);
    };

    handleOnMsvLicensorChange = e => {
        this.setState({
            msvLicensor: e.target.value,
        });
    };

    handleOnMsvLicenseeChange(e) {
        this.setState({
            msvLicensee: e.target.value,
        });
    }

    handleOnLicensorSelected = e => {
        this.setState({
            licensorSelected: e.target.value,
        });
    };

    handleOnLicensorTitleIdChange = e => {
        this.setState({
            licensorTitleId: e.target.value,
        });
    };

    handleOnSaveLicensors = () => {
        const licensoreObj = this.props.configLicensors.value.find(item => item.value === this.state.licensorSelected);
        const newLicensors = [
            ...this.state.licensors,
            {id: licensoreObj.id, licensor: this.state.licensorSelected, licensorTitleId: this.state.licensorTitleId},
        ];
        this.setState(prevState => ({...prevState, licensors: newLicensors, ...defaultAddLicensorsState}));
        this.props.handleLicensorsOnChange(newLicensors);
    };

    handleRemoveLicensor = licensorName => {
        const newLicensors = this.state.licensors.filter(
            item => `${item.licensor} : ${item.licensorTitleId}` !== licensorName
        );
        this.setState(prevState => ({...prevState, licensors: newLicensors}));
        this.props.handleLicensorsOnChange(newLicensors);
    };

    handleOnGenerateMsv = () => {
        this.setState({
            msvIsLoading: true,
        });

        titleService
            .addMsvAssociationIds(this.props.data.id, this.state.msvLicensor, this.state.msvLicensee)
            .then(res => {
                if (Array.isArray(res) && res.length) {
                    const msvAssociationIds = [...this.state.msvAssociationIds, ...res];
                    this.setState({
                        ...defaultMsvAssociationState,
                        msvAssociationIds,
                    });

                    this.props.handleOnMsvIds(msvAssociationIds);
                } else {
                    this.setState({
                        ...defaultMsvAssociationState,
                    });
                }
            })
            .catch(err => {
                this.setState({
                    msvIsLoading: false,
                });
            });
    };

    isGenerateMsvBtnDisabled = () => {
        return !(this.state.msvLicensor && this.state.msvLicensee);
    };

    isAddLicensorBtnDisabled = () => {
        return !(this.state.licensorSelected && this.state.licensorTitleId);
    };

    render() {
        const vzExternalID = this.props.externalIDs && this.props.externalIDs.find(e => e.externalSystem === VZ);
        const movidaExternalID =
            this.props.externalIDs && this.props.externalIDs.find(e => e.externalSystem === MOVIDA);
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
                            onReOrder={newArray => this.props.castAndCrewReorder(newArray, CAST)}
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
                            onReOrder={newArray => this.props.castAndCrewReorder(newArray, CREW)}
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
                            <Label for="awards">Awards</Label>
                            <AvField
                                type="text"
                                name="awards"
                                onChange={e => this.props.onChange(e)}
                                id="awards"
                                value={this.props.data.awards ? this.props.data.awards : ''}
                                placeholder="Awards"
                                validate={{
                                    maxLength: {value: 500},
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="imdbLink">IMDb Link</Label>
                            <AvField
                                type="text"
                                name="imdbLink"
                                onChange={e => this.props.onChange(e)}
                                id="imdbLink"
                                value={this.props.data.imdbLink ? this.props.data.imdbLink : ''}
                                placeholder="IMDb Link"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <hr />
                <h4>External IDS</h4>
                <div id="coreMetadataEditMode">
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="assetName">Asset Name </Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="assetName"
                                id="assetName"
                                value={this.props.data.externalIds ? this.props.data.externalIds.assetName : ''}
                                placeholder="Asset Name"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="eidrTitleId">EIDR Title ID </Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="eidrTitleId"
                                id="eidrTitleId"
                                value={this.props.data.externalIds ? this.props.data.externalIds.eidrTitleId : ''}
                                placeholder="EIDR Title ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for="tmsId">TMS ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                name="tmsId"
                                id="tmsId"
                                value={this.props.data.externalIds ? this.props.data.externalIds.tmsId : ''}
                                onChange={e => this.props.handleOnExternalIds(e)}
                                placeholder="TMS ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="eidrEditId">EIDR Edit ID </Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="eidrEditId"
                                id="eidrEditId"
                                value={this.props.data.externalIds ? this.props.data.externalIds.eidrEditId : ''}
                                placeholder="EIDR Edit ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for="xfinityMovieId">Xfinity Movie ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="xfinityMovieId"
                                id="xfinityMovieId"
                                value={this.props.data.externalIds ? this.props.data.externalIds.xfinityMovieId : ''}
                                placeholder="Xfiniy Movie ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="dmaId">MA ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                name="maId"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                id="maId"
                                value={this.props.data.externalIds ? this.props.data.externalIds.maId : ''}
                                placeholder="MA ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for="isan">ISAN</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="isan"
                                id="isan"
                                value={this.props.data.externalIds ? this.props.data.externalIds.isan : ''}
                                placeholder="ISAN"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{borderTop: '1px solid lightgray', marginTop: '10px', paddingTop: '15px'}}>
                        <Col md={1}>
                            <Label for="licensorTitleId"> Add Licensor</Label>
                        </Col>
                        <Col md={3}>
                            <AvField
                                type="select"
                                name="Licensors"
                                id="Licensors"
                                value={this.state.licensorSelected}
                                onChange={this.handleOnLicensorSelected}
                            >
                                <option value="">Select Licensor</option>
                                {this.props.configLicensors &&
                                    this.props.configLicensors.value.map(e => {
                                        return (
                                            <option key={e.value} value={e.value} id={e.id}>
                                                {e.value}
                                            </option>
                                        );
                                    })}
                            </AvField>
                        </Col>
                        <Col md={3}>
                            <AvField
                                type="text"
                                onChange={this.handleOnLicensorTitleIdChange}
                                name="licensorTitleId"
                                id="licensorTitleId"
                                value={this.state.licensorTitleId}
                                placeholder="Licensor Title ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                        <Col md={2}>
                            <Button
                                id="btnAddLicensor"
                                onClick={this.handleOnSaveLicensors}
                                appearance="primary"
                                isDisabled={this.isAddLicensorBtnDisabled()}
                            >
                                Add Licensor
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{borderBottom: '1px solid lightgray', paddingBottom: '15px'}}>
                        <Col md={1}>Licensors</Col>
                        <Col md={8}>
                            <NexusTagsContainer
                                data={this.state.licensors.map(item => `${item.licensor} : ${item.licensorTitleId}`)}
                                removeItems={this.handleRemoveLicensor}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="alid">ALID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="alid"
                                id="alid"
                                value={this.props.data.externalIds ? this.props.data.externalIds.alid : ''}
                                placeholder="ALID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for="vzId">VZ Title ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                readOnly
                                type="text"
                                name="vzTitleId"
                                id="vzTitleId"
                                value={get(vzExternalID, 'externalTitleId', '')}
                                placeholder="VZ ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="cid">C ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="cid"
                                id="cid"
                                value={this.props.data.externalIds ? this.props.data.externalIds.cid : ''}
                                placeholder="C ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                        <Col md={1}>
                            <Label for="movidaId">Movida ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                readOnly
                                type="text"
                                name="movidaId"
                                id="movidaId"
                                value={get(movidaExternalID, 'externalId', '')}
                                placeholder="Movie ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="isrc">ISRC</Label>
                        </Col>
                        <Col>
                            <AvField
                                type="text"
                                onChange={e => this.props.handleOnExternalIds(e)}
                                name="isrc"
                                id="isrc"
                                value={this.props.data.externalIds ? this.props.data.externalIds.isrc : ''}
                                placeholder="ISRC"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>

                        <Col md={1}>
                            <Label for="movidaTitleId">Movida Title ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                readOnly
                                type="text"
                                name="movidaTitleId"
                                id="movidaTitleId"
                                value={get(movidaExternalID, 'externalTitleId', '')}
                                placeholder="Movida Title ID"
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="vzId">VZ Vendor ID</Label>
                        </Col>
                        <Col>
                            <AvField
                                readOnly
                                type="text"
                                name="vzId"
                                id="vzId"
                                value={get(vzExternalID, 'externalId', '')}
                                placeholder="VZ ID"
                                validate={{
                                    maxLength: {value: 200},
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col md={1}>
                            <Label for="overrideMsvAssociationId">MSV Association ID</Label>
                        </Col>
                        <Col md={3}>
                            <AvField
                                type="select"
                                name="msvLicensor"
                                id="msvLicensor"
                                value={this.state.msvLicensor}
                                onChange={this.handleOnMsvLicensorChange}
                            >
                                <option value="">Select Licensor</option>
                                {this.props.configLicensors &&
                                    this.props.configLicensors.value.map(e => {
                                        return (
                                            <option key={e.value} value={e.movidaName || e.value}>
                                                {e.movidaName ? e.value + ' | ' + e.movidaName : e.value}
                                            </option>
                                        );
                                    })}
                            </AvField>
                            <sub className="nexus-subselect">licensor name | movida name</sub>
                        </Col>
                        <Col md={3}>
                            <AvField
                                type="select"
                                name="msvLicensee"
                                id="msvLicensee"
                                value={this.state.msvLicensee}
                                onChange={e => this.handleOnMsvLicenseeChange(e)}
                            >
                                <option value="">Select Licensee</option>
                                {this.props.configLicensees &&
                                    this.props.configLicensees.value.map(e => {
                                        return (
                                            <option key={e.licenseeName} value={e.movidaName || e.licenseeName}>
                                                {(() => {
                                                    if (e.movidaName) {
                                                        if (e.additionalMSVContentProviders && e.additionalMSVContentProviders.length > 0)
                                                            return e.licenseeName + ' | ' + e.movidaName + ' | ' + e.additionalMSVContentProviders.join(', ');
                                                        return e.licenseeName + ' | ' + e.movidaName;
                                                    } else {
                                                        if (e.additionalMSVContentProviders && e.additionalMSVContentProviders.length > 0)
                                                            return e.licenseeName + ' | ' + e.additionalMSVContentProviders.join(', ');
                                                        return e.licenseeName;
                                                    }
                                                })()}
                                            </option>
                                        );
                                    })}
                            </AvField>
                            <sub className="nexus-subselect">licensee name | movida name | MSV content providers</sub>
                        </Col>
                        <Col md={2}>
                            <Tooltip
                                title={
                                    this.isGenerateMsvBtnDisabled()
                                        ? MSV_ASSOCIATION_BTN.disabledHover
                                        : MSV_ASSOCIATION_BTN.readyHover
                                }
                            >
                                <div>
                                    <Button
                                        id="btnGenerateMsv"
                                        isLoading={this.state.msvIsLoading}
                                        isDisabled={this.isGenerateMsvBtnDisabled()}
                                        onClick={this.handleOnGenerateMsv}
                                        appearance="primary"
                                    >
                                        {MSV_ASSOCIATION_BTN.title}
                                    </Button>
                                </div>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={1}></Col>
                        <Col md={8}>
                            <NexusTagsContainer data={this.state.msvAssociationIds} saveData={this.handleMSVIDs} />
                        </Col>
                    </Row>
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
    handleOnMsvIds: PropTypes.func,
    removeCastCrew: PropTypes.func,
    castCrew: PropTypes.array,
    addCastCrew: PropTypes.func,
    ratings: PropTypes.array,
    configRatings: PropTypes.object,
    handleRatingSystemValue: PropTypes.func,
    ratingObjectForCreate: PropTypes.object,
    areRatingFieldsRequired: PropTypes.bool,
    castAndCrewReorder: PropTypes.func,
    handleAddCharacterName: PropTypes.func,
    externalIDs: PropTypes.array,
};

export default connect(mapStateToProps)(CoreMetadataEditMode);
