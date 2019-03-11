import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane, Alert } from 'reactstrap';
// import './MetadataTerritoryTab.scss';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import EditorialMetadataTab from './EditorialMetadataTab';
import EditorialMetadataCreateTab from './EditorialMetadataCreateTab';

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
                        this.props.editorialMetadata && this.props.editorialMetadata.map((item, i) => {
                            return <span className={'tablinks'} key={i} onClick={() => this.props.toggle(i)}><b>{item.locale + ' ' + item.language + ' ' + item.format}</b></span>;
                        })
                    }
                </div>
                <TabContent activeTab={this.props.activeTab}>
                    {
                        this.props.editorialMetadata && this.props.editorialMetadata.length > 0 ?
                            !this.props.isEditMode && this.props.editorialMetadata.map((item, i) => {
                                return (
                                    <TabPane key={i} tabId={i}>
                                        <Row>
                                            <Col>
                                                <EditorialMetadataTab key={i} data={item} titleContentType={this.props.titleContentType}/>
                                            </Col>
                                        </Row>
                                    </TabPane>);
                            }) :
                            !this.props.isEditMode ?
                                <Row>
                                    <Col>
                                        <Alert color="primary">
                                            <FontAwesome name="info" /> <b>No editorial metadata.</b>
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
                                            <EditorialMetadataCreateTab
                                                validSubmit={this.props.validSubmit}
                                                areFieldsRequired={this.props.areFieldsRequired}
                                                handleChange={this.props.handleChange}
                                                handleTitleChange={this.props.handleTitleChange}
                                                handleSynopsisChange={this.props.handleSynopsisChange}
                                                titleContentType={this.props.titleContentType}/>
                                        </Col>
                                    </Row>
                                </TabPane>
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
    editorialMetadata: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    handleTitleChange: PropTypes.func.isRequired,
    handleSynopsisChange: PropTypes.func.isRequired,
    activeTab: PropTypes.any,
    areFieldsRequired: PropTypes.bool,
    toggle: PropTypes.func,
    addEditorialMetadata: PropTypes.func,
    CREATE_TAB: PropTypes.string,
    validSubmit: PropTypes.func.isRequired,
    handleEditChange: PropTypes.func,
    titleContentType: PropTypes.string
};



export default EditorialMetadata;