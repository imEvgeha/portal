import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane, Alert } from 'reactstrap';
import './MetadataTerritoryTab.scss';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import TerritoryMetadataTab from './TerritoryMetadataTab';
import TerritoryMetadataCreateTab from './TerritoryMetadataCreateTab';
import TerritoryMetadataEditMode from './TerritoryMetadataEditMode';

import connect from 'react-redux/es/connect/connect';


class TerritoryMetadata extends Component {
    constructor(props) {
        super(props);
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
                            <FontAwesome className={'tablinks add-local'} name="plus-circle" onClick={() => this.props.addTerritoryMetadata(this.props.CREATE_TAB)} key={this.props.CREATE_TAB} size="lg" />
                            : null
                    }
                    {
                        this.props.territories && this.props.territories.map((item, i) => {
                            return <span className={'tablinks'} key={i} onClick={() => this.props.toggle(i)}><b>{item.locale}</b></span>;
                        })
                    }
                </div>
                <TabContent activeTab={this.props.activeTab}>
                    {
                        this.props.territories.length > 0 ?
                            !this.props.isEditMode && this.props.territories.map((item, i) => {
                                return (
                                    <TabPane key={i} tabId={i}>
                                        <Row>
                                            <Col>
                                                <TerritoryMetadataTab  key={i} data={item} />
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
                                <TabPane tabId={this.props.CREATE_TAB}>
                                    <Row>
                                        <Col>
                                            <TerritoryMetadataCreateTab validSubmit={this.props.validSubmit} isRequired={this.props.isLocalRequired} handleChange={this.props.handleChange} />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {
                                    this.props.territories && this.props.territories.map((item, i) => {
                                        return (
                                            <TabPane key={i} tabId={i}>
                                                <Row>
                                                    <Col>
                                                        <TerritoryMetadataEditMode validSubmit={this.props.validSubmit} isRequired={this.props.isLocalRequired} handleChange={this.props.handleChange} key={i} data={item} />
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
    territories: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    activeTab: PropTypes.any,
    isLocalRequired: PropTypes.bool,
    toggle: PropTypes.func,
    addTerritoryMetadata: PropTypes.func,
    CREATE_TAB: PropTypes.string,
    validSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        territories: state.titleReducer.territories,
    };
};



export default connect(mapStateToProps)(TerritoryMetadata);