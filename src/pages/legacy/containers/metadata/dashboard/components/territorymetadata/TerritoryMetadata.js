import React, {Component, Fragment} from 'react';
import {Row, Col, Container, TabContent, TabPane, Alert, Tooltip} from 'reactstrap';
import './MetadataTerritoryTab.scss';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import TerritoryMetadataTab from './TerritoryMetadataTab';
import TerritoryMetadataCreateTab from './TerritoryMetadataCreateTab';
import TerritoryMetadataEditMode from './TerritoryMetadataEditMode';
import {configFields} from '../../../service/ConfigService';
import {connect} from 'react-redux';
import {COUNTRY} from '../../../../../constants/metadata/constant-variables';

const mapStateToProps = state => {
    return {
        configCountry: state.titleReducer.configData.find(e => e.key === configFields.LOCALE),
    };
};

class TerritoryMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false,
        };
    }

    getLanguageByCode = (code, type) => {
        if (type === COUNTRY) {
            if (this.props.configCountry) {
                const found = this.props.configCountry.value.find(e => e.countryCode === code);
                if (found) {
                    return found.countryName;
                }
            }
        }
        return code;
    };

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    };

    render() {
        return (
            <Container fluid id="titleContainer" style={{marginTop: '30px'}}>
                <Row style={{marginTop: '5px'}}>
                    <Col>
                        <h2>Territory Metadata</h2>
                    </Col>
                </Row>
                <div className="tab">
                    {this.props.isEditMode ? (
                        <>
                            <FontAwesome
                                className="tablinks add-local"
                                name="plus-circle"
                                id="createTerritoryMetadata"
                                onClick={() => this.props.addTerritoryMetadata(this.props.createTerritoryTab)}
                                key={this.props.createTerritoryTab}
                                size="lg"
                            />
                            <Tooltip
                                placement="top"
                                isOpen={this.state.tooltipOpen}
                                target="createTerritoryMetadata"
                                toggle={this.toggle}
                            >
                                Create Territory Metadata
                            </Tooltip>
                        </>
                    ) : null}
                    {this.props.territory &&
                        this.props.territory.map((item, i) => {
                            return (
                                <span
                                    className="tablinks"
                                    style={{
                                        background: this.props.activeTab === i ? '#000' : '',
                                        color: this.props.activeTab === i ? '#FFF' : '',
                                    }}
                                    key={i}
                                    onClick={() => this.props.toggle(i)}
                                >
                                    <b>{this.getLanguageByCode(item.locale, COUNTRY)}</b>
                                </span>
                            );
                        })}
                </div>
                <TabContent activeTab={this.props.activeTab}>
                    {this.props.territory && this.props.territory.length > 0 ? (
                        !this.props.isEditMode &&
                        this.props.territory.map((item, i) => {
                            return (
                                <TabPane key={i} tabId={i}>
                                    <Row>
                                        <Col>
                                            <TerritoryMetadataTab
                                                getLanguageByCode={this.getLanguageByCode}
                                                key={i}
                                                data={item}
                                            />
                                        </Col>
                                    </Row>
                                </TabPane>
                            );
                        })
                    ) : !this.props.isEditMode ? (
                        <Row>
                            <Col>
                                <Alert color="primary">
                                    <FontAwesome name="info" /> <b>No territory metadata.</b>
                                </Alert>
                            </Col>
                        </Row>
                    ) : null}
                    {this.props.isEditMode ? (
                        <>
                            <TabPane tabId={this.props.createTerritoryTab}>
                                <Row>
                                    <Col>
                                        <TerritoryMetadataCreateTab
                                            territories={this.props.territories}
                                            validSubmit={this.props.validSubmit}
                                            isRequired={this.props.isLocalRequired}
                                            handleChange={this.props.handleChange}
                                            handleChangeDate={this.props.handleChangeDate}
                                            handleMetadataStatusChange={this.props.handleMetadataStatusChange}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            {this.props.territory &&
                                this.props.territory.map((item, i) => {
                                    return (
                                        <TabPane key={i} tabId={i}>
                                            <Row>
                                                <Col>
                                                    <TerritoryMetadataEditMode
                                                        getLanguageByCode={this.getLanguageByCode}
                                                        validSubmit={this.props.validSubmit}
                                                        handleChange={this.props.handleEditChange}
                                                        handleChangeDate={this.props.handleEditChangeDate}
                                                        key={i}
                                                        data={item}
                                                        handleDeleteTerritoryMetaData={
                                                            this.props.handleDeleteTerritoryMetaData
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    );
                                })}
                        </>
                    ) : null}
                </TabContent>
            </Container>
        );
    }
}

TerritoryMetadata.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    territory: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    handleChangeDate: PropTypes.func.isRequired,
    activeTab: PropTypes.any,
    isLocalRequired: PropTypes.bool,
    toggle: PropTypes.func,
    addTerritoryMetadata: PropTypes.func,
    createTerritoryTab: PropTypes.string,
    validSubmit: PropTypes.func.isRequired,
    handleEditChange: PropTypes.func,
    handleEditChangeDate: PropTypes.func,
    territories: PropTypes.object,
    configCountry: PropTypes.object,
    handleMetadataStatusChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(TerritoryMetadata);
