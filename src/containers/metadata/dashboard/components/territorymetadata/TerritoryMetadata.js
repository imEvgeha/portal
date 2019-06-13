import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane, Alert, Tooltip } from 'reactstrap';
import './MetadataTerritoryTab.scss';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import TerritoryMetadataTab from './TerritoryMetadataTab';
import TerritoryMetadataCreateTab from './TerritoryMetadataCreateTab';
import TerritoryMetadataEditMode from './TerritoryMetadataEditMode';


class TerritoryMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false
        };
    }
    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    render() {
        return (
            <Container fluid id="titleContainer" style={{ marginTop: '30px' }}>

                <Row style={{ marginTop: '5px' }}>
                    <Col>
                        <h2>Territory Metadata</h2>
                    </Col>
                </Row>
                <div className='tab'>
                    {
                        this.props.isEditMode ?
                            <React.Fragment>
                                <FontAwesome className={'tablinks add-local'} name="plus-circle" id={'createTerritoryMetadata'} onClick={() => this.props.addTerritoryMetadata(this.props.createTerritoryTab)} key={this.props.createTerritoryTab} size="lg" />
                                <Tooltip placement={'top'} isOpen={this.state.tooltipOpen} target={'createTerritoryMetadata'} toggle={this.toggle}>
                                    Create Territory Metadata
                                </Tooltip>
                            </React.Fragment>
                            : null
                    }
                    {
                        this.props.territory && this.props.territory.map((item, i) => {
                            return <span className={'tablinks'} style={{ background: this.props.activeTab === i ? '#000' : '', color: this.props.activeTab === i ? '#FFF' : '' }} key={i} onClick={() => this.props.toggle(i)}><b>{item.locale}</b></span>;
                        })
                    }
                </div>
                <TabContent activeTab={this.props.activeTab}>
                    {
                        this.props.territory && this.props.territory.length > 0 ?
                            !this.props.isEditMode && this.props.territory.map((item, i) => {
                                return (
                                    <TabPane key={i} tabId={i}>
                                        <Row>
                                            <Col>
                                                <TerritoryMetadataTab key={i} data={item} />
                                            </Col>
                                        </Row>
                                    </TabPane>);
                            }) :
                            !this.props.isEditMode ?
                                <Row>
                                    <Col>
                                        <Alert color="primary">
                                            <FontAwesome name="info" /> <b>No territory metadata.</b>
                                        </Alert>
                                    </Col>
                                </Row> : null
                    }
                    {
                        this.props.isEditMode ?
                            <Fragment>
                                <TabPane tabId={this.props.createTerritoryTab}>
                                    <Row>
                                        <Col>
                                            <TerritoryMetadataCreateTab territories={this.props.territories} validSubmit={this.props.validSubmit} isRequired={this.props.isLocalRequired} handleChange={this.props.handleChange} />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {
                                    this.props.territory && this.props.territory.map((item, i) => {
                                        return (
                                            <TabPane key={i} tabId={i}>
                                                <Row>
                                                    <Col>
                                                        <TerritoryMetadataEditMode validSubmit={this.props.validSubmit} handleChange={this.props.handleEditChange} key={i} data={item} />
                                                    </Col>
                                                </Row>
                                            </TabPane>);
                                    })
                                }
                            </Fragment>
                            : null
                    }
                </TabContent>
            </Container>
        );
    }
}

TerritoryMetadata.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    territory: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    activeTab: PropTypes.any,
    isLocalRequired: PropTypes.bool,
    toggle: PropTypes.func,
    addTerritoryMetadata: PropTypes.func,
    createTerritoryTab: PropTypes.string,
    validSubmit: PropTypes.func.isRequired,
    handleEditChange: PropTypes.func,
    territories: PropTypes.object
};



export default TerritoryMetadata;