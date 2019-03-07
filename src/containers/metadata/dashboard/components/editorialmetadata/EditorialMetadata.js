import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane, Alert } from 'reactstrap';
import './MetadataTerritoryTab.scss';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

class EditorialMetadata extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container fluid id="titleContainer" style={{ marginTop: '30px' }}>

                <Row style={{ marginTop: '5px' }}>
                    <Col>
                        <h2>Editorial Metadata</h2>
                    </Col>
                </Row>
                <div className='tab'>
                    {
                        this.props.isEditMode ?
                            <FontAwesome className={'tablinks add-local'} name="plus-circle" onClick={() => this.props.addEditorialMetadata(this.props.CREATE_TAB)} key={this.props.CREATE_TAB} size="lg" />
                            : null
                    }
                    {
                        this.props.territory && this.props.territory.map((item, i) => {
                            return <span className={'tablinks'} key={i} onClick={() => this.props.toggle(i)}><b>{item.locale + ' ' + item.language}</b></span>;
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

EditorialMetadata.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    territory: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    activeTab: PropTypes.any,
    isLocalRequired: PropTypes.bool,
    toggle: PropTypes.func,
    addEditorialMetadata: PropTypes.func,
    CREATE_TAB: PropTypes.string,
    validSubmit: PropTypes.func.isRequired,
    handleEditChange: PropTypes.func
};



export default EditorialMetadata;