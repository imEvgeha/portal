import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane } from 'reactstrap';
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
        this.state = {
            activeTab: 0,
            isLocalRequired: false,
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                isLocalRequired: false
            });
        }
    }
    addTerritoryMetadata(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                isLocalRequired: true
            });
        }

    }
    handleSubmit = () => {
        this.setState({
            activeTab: 0
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
                            <FontAwesome className={'tablinks add-local'} name="plus-circle" onClick={() => { this.addTerritoryMetadata('3'); }} key={'3'} size="lg" />
                            : null
                    }
                    {
                        this.props.territories && this.props.territories.map((item, i) => {
                            return <span className={'tablinks'} key={i} onClick={() => { this.toggle(i); }}><b>{item.locale}</b></span>;
                        })
                    }
                </div>
                <TabContent activeTab={this.state.activeTab}>
                    {
                        !this.props.isEditMode && this.props.territories.map((item, i) => {
                            return (
                                <TabPane key={i} tabId={i}>
                                    <Row>
                                        <Col>
                                            <TerritoryMetadataTab key={i} data={item} />
                                        </Col>
                                    </Row>
                                </TabPane>);
                        })
                    }
                    {
                        this.props.isEditMode ?
                            <Fragment>
                                <TabPane tabId="3">
                                    <Row>
                                        <Col>
                                            <TerritoryMetadataCreateTab isRequired={this.state.isLocalRequired} toggle={this.toggle} handleChange={this.props.handleChange} />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {
                                    this.props.territories && this.props.territories.map((item, i) => {
                                        return (
                                            <TabPane key={i} tabId={i}>
                                            <Row>
                                                <Col>
                                                    <TerritoryMetadataEditMode handleChange={this.props.handleChange} key={i} data={item} />
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
    handleChange: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        territories: state.titleReducer.territories,
    };
};



export default connect(mapStateToProps)(TerritoryMetadata);