import React, { Component, Fragment } from 'react';
import { Row, Col, Container, TabContent, TabPane, Alert, Tooltip } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import EditorialMetadataTab from './EditorialMetadataTab';
import EditorialMetadataCreateTab from './EditorialMetadataCreateTab';
import EditorialMetadataEditMode from './EditorialMetadataEditMode';
import { configFields } from '../../../service/ConfigService';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        configLanguage: state.titleReducer.configData.find(e => e.key === configFields.LANGUAGE)
    };
};

class EditorialMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false
        };
    }

    getLanguageByCode = (code) => {
        if (this.props.configLanguage) {
            let found = this.props.configLanguage.value.find(e => e.languageCode === code);
            if (found) {
                return found.languageName;
            }
        }
        return code;
    };

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
                        <h2>Editorial Metadata</h2>
                    </Col>
                </Row>
                <div className='tab'>
                    {
                        this.props.isEditMode ?
                            <React.Fragment>
                                <FontAwesome className={'tablinks add-local'} id={'createEditorialMetadata'} name="plus-circle" onClick={() => this.props.addEditorialMetadata(this.props.createEditorialTab)} key={this.props.createEditorialTab} size="lg" />
                                <Tooltip placement={'top'} isOpen={this.state.tooltipOpen} target={'createEditorialMetadata'} toggle={this.toggle}>
                                    Create Editorial Metadata
                                </Tooltip>
                            </React.Fragment>
                            : null
                    }
                    {
                        this.props.editorialMetadata && this.props.editorialMetadata.map((item, i) => {
                            return <span className={'tablinks'} style={{ background: this.props.activeTab === i ? '#000' : '', color: this.props.activeTab === i ? '#FFF' : '' }} key={i} onClick={() => this.props.toggle(i)}><b>{item.locale + ' ' + this.getLanguageByCode(item.language) + ' ' + (item.format ? item.format : '') + ' ' + (item.service ? item.service : '')}</b></span>;
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
                                                <EditorialMetadataTab
                                                    titleContentType={this.props.titleContentType}
                                                    getLanguageByCode={this.getLanguageByCode}
                                                    key={i} data={item} />
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
                                <TabPane tabId={this.props.createEditorialTab}>
                                    <Row>
                                        <Col>
                                            <EditorialMetadataCreateTab
                                                validSubmit={this.props.validSubmit}
                                                areFieldsRequired={this.props.areFieldsRequired}
                                                handleChange={this.props.handleChange}
                                                handleTitleChange={this.props.handleTitleChange}
                                                editorialMetadataForCreate={this.props.editorialMetadataForCreate}
                                                handleSynopsisChange={this.props.handleSynopsisChange}
                                                handleGenreChange={this.props.handleGenreChange}
                                                titleContentType={this.props.titleContentType} />
                                        </Col>
                                    </Row>
                                </TabPane>
                                {
                                    this.props.editorialMetadata && this.props.editorialMetadata.map((item, i) => {
                                        return (
                                            <TabPane key={i} tabId={i}>
                                                <Row>
                                                    <Col>
                                                        <EditorialMetadataEditMode
                                                            titleContentType={this.props.titleContentType}
                                                            validSubmit={this.props.validSubmit}
                                                            handleChange={this.props.handleEditChange}
                                                            handleGenreEditChange={this.props.handleGenreEditChange}
                                                            updatedEditorialMetadata={this.props.updatedEditorialMetadata}
                                                            key={i} data={item} />
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
    editorialMetadata: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    handleTitleChange: PropTypes.func.isRequired,
    handleSynopsisChange: PropTypes.func.isRequired,
    activeTab: PropTypes.any,
    areFieldsRequired: PropTypes.bool,
    toggle: PropTypes.func,
    addEditorialMetadata: PropTypes.func,
    createEditorialTab: PropTypes.string,
    validSubmit: PropTypes.func.isRequired,
    handleEditChange: PropTypes.func,
    titleContentType: PropTypes.string,
    editorialMetadataForCreate: PropTypes.object,
    updatedEditorialMetadata: PropTypes.array,
    handleGenreChange: PropTypes.func.isRequired,
    handleGenreEditChange: PropTypes.func.isRequired,
    configLanguage: PropTypes.object
};



export default connect(mapStateToProps)(EditorialMetadata);