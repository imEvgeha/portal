import React, {useState} from 'react';
import {Row, Col, Container, TabContent, TabPane, Alert, Tooltip} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {connect} from 'react-redux';
import EditorialMetadataTab from './EditorialMetadataTab';
import EditorialMetadataCreateTab from './EditorialMetadataCreateTab';
import EditorialMetadataEditMode from './EditorialMetadataEditMode';
import {configFields} from '../../../service/ConfigService';
import {NexusDrawer} from '../../../../../ui/elements';
import Title from '../../../../../metadata/title/Title';
import {URL} from '../../../../../util/Common';

const mapStateToProps = state => {
    return {
        configLanguage: state.titleReducer.configData.find(e => e.key === configFields.LANGUAGE)
    };
};

const EditorialMetadata = ({
    isEditMode,
    editorialMetadata,
    handleChange,
    handleTitleChange,
    handleEpisodicChange,
    handleSynopsisChange,
    activeTab,
    areFieldsRequired,
    toggle,
    addEditorialMetadata,
    createEditorialTab,
    validSubmit,
    handleEditChange,
    titleContentType,
    editorialMetadataForCreate,
    updatedEditorialMetadata,
    handleGenreChange,
    handleGenreEditChange,
    configLanguage,
    handleEditorialCastCrewCreate,
    handleEditorialCastCrew,
    handleAddEditorialCharacterName,
    handleAddEditorialCharacterNameEdit,
    handleCategoryChange,
    handleCategoryEditChange,
    titleData,
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getLanguageByCode = (code) => {
        if (configLanguage) {
            const found = configLanguage.value.find(e => e.languageCode === code);
            if (found) {
                return found.languageName;
            }
        }
        return code;
    };

    return (
        <Container fluid id="titleContainer" style={{marginTop: '30px'}}>
            <NexusDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width="extended"
                position="right"
            >
                <Title titleData={titleData} />
            </NexusDrawer>
            <Row style={{marginTop: '5px'}}>
                <Col>
                    <h2>Editorial Metadata</h2>
                </Col>
                {URL.isLocalOrDevOrQA() && (
                    <Col style={{display: 'flex', justifyContent: 'end'}}>
                        <Button onClick={() => setIsDrawerOpen(true)}>Open drawer</Button>
                    </Col>
                )}
            </Row>
            <div className='tab'>
                {
                    isEditMode ? (
                        <>
                            <FontAwesome
                                className="tablinks add-local"
                                id="createEditorialMetadata"
                                name="plus-circle"
                                onClick={() => addEditorialMetadata(createEditorialTab)}
                                key={createEditorialTab}
                                size="lg"
                            />
                            <Tooltip
                                placement="top"
                                isOpen={tooltipOpen}
                                target="createEditorialMetadata"
                                toggle={() => setTooltipOpen(!tooltipOpen)}
                            >
                                Create Editorial Metadata
                            </Tooltip>
                        </>
                      )
                        : null
                }
                {
                    editorialMetadata && editorialMetadata.map((item, i) => {
                        return (
                            <span
                                className="tablinks"
                                style={{background: activeTab === i ? '#000' : '', color: activeTab === i ? '#FFF' : ''}}
                                key={i}
                                onClick={() => toggle(i)}
                            >
                                <b>
                                    {`${item.locale} ${getLanguageByCode(item.language)} ${(item.format ? item.format : '')} ${(item.service ? item.service : '')}`}
                                </b>
                            </span>
                        );
                    })
                }
            </div>
            <TabContent activeTab={activeTab}>
                {
                    editorialMetadata && editorialMetadata.length > 0 ?
                        !isEditMode && editorialMetadata.map((item, i) => {
                            return (
                                <TabPane key={i} tabId={i}>
                                    <Row>
                                        <Col>
                                            <EditorialMetadataTab
                                                titleContentType={titleContentType}
                                                getLanguageByCode={getLanguageByCode}
                                                key={i}
                                                data={item}
                                            />
                                        </Col>
                                    </Row>
                                </TabPane>
                            );
                        }) :
                        !isEditMode ? (
                            <Row>
                                <Col>
                                    <Alert color="primary">
                                        <FontAwesome name="info" /> <b>No editorial metadata.</b>
                                    </Alert>
                                </Col>
                            </Row>
                          ) : null
                }
                {
                    isEditMode ? (
                        <>
                            <TabPane tabId={createEditorialTab}>
                                <Row>
                                    <Col>
                                        <EditorialMetadataCreateTab
                                            handleAddEditorialCharacterName={handleAddEditorialCharacterName}
                                            validSubmit={validSubmit}
                                            areFieldsRequired={areFieldsRequired}
                                            handleChange={handleChange}
                                            handleTitleChange={handleTitleChange}
                                            handleEpisodicChange={handleEpisodicChange}
                                            editorialMetadataForCreate={editorialMetadataForCreate}
                                            handleSynopsisChange={handleSynopsisChange}
                                            handleGenreChange={handleGenreChange}
                                            handleCategoryChange={handleCategoryChange}
                                            handleEditorialCastCrewCreate={handleEditorialCastCrewCreate}
                                            titleContentType={titleContentType}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            {
                                editorialMetadata && editorialMetadata.map((item, i) => {
                                    return (
                                        <TabPane key={i} tabId={i}>
                                            <Row>
                                                <Col>
                                                    <EditorialMetadataEditMode
                                                        handleAddEditorialCharacterNameEdit={handleAddEditorialCharacterNameEdit}
                                                        titleContentType={titleContentType}
                                                        validSubmit={validSubmit}
                                                        handleChange={handleEditChange}
                                                        handleEditorialCastCrew={handleEditorialCastCrew}
                                                        handleGenreEditChange={handleGenreEditChange}
                                                        updatedEditorialMetadata={updatedEditorialMetadata}
                                                        handleCategoryEditChange={handleCategoryEditChange}
                                                        key={i}
                                                        data={item}
                                                    />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    );
                                })
                            }
                        </>
                      )
                        : null
                }
            </TabContent>
        </Container>
    );
};

EditorialMetadata.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    editorialMetadata: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    handleTitleChange: PropTypes.func.isRequired,
    handleEpisodicChange: PropTypes.func.isRequired,
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
    configLanguage: PropTypes.object,
    handleEditorialCastCrewCreate: PropTypes.func,
    handleEditorialCastCrew: PropTypes.func,
    handleAddEditorialCharacterName: PropTypes.func,
    handleAddEditorialCharacterNameEdit: PropTypes.func,
    titleData: PropTypes.object,
    handleCategoryChange: PropTypes.func.isRequired,
    handleCategoryEditChange: PropTypes.func.isRequired,
};

EditorialMetadata.defaultProps = {
    editorialMetadata: [],
    areFieldsRequired: false,
    toggle: () => null,
    addEditorialMetadata: () => null,
    createEditorialTab: '',
    handleEditChange: () => null,
    titleContentType: '',
    editorialMetadataForCreate: {},
    updatedEditorialMetadata: [],
    configLanguage: {value: []},
    handleEditorialCastCrew: () => null,
    handleEditorialCastCrewCreate: () => null,
    handleAddEditorialCharacterName: () => null,
    handleAddEditorialCharacterNameEdit: () => null,
    titleData: {},
};

export default connect(mapStateToProps)(EditorialMetadata);
