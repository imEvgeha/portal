import React, {useEffect, useState} from 'react';
import {Alert, Col, Container, Row, TabContent, TabPane, Tooltip} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import EditorialMetadataTab from './EditorialMetadataTab';
import EditorialMetadataCreateTab from './EditorialMetadataCreateTab';
import EditorialMetadataEditMode from './EditorialMetadataEditMode';
import {configFields} from '../../../service/ConfigService';
import Title from '../../../../../../metadata/title/Title';
import {URL} from '../../../../../../../util/Common';
import {NexusDrawer} from '../../../../../../../ui/elements';

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
    coreTitleData,
    editorialTitleData
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentFolder, setCurrentFolder] = useState({});
    const [foldersOptions, setFoldersOptions] = useState([]);
    const [foldersChildren, setFoldersChildren] = useState({});

    // When editorialMetadata is received/updated, extract its items and categorize them in folders
    useEffect(() => {
        // Will hold all unique comibnations of locale+language
        const foldersSet = new Set();

        // Extract locale+language from each editorialMetadata item and add it to flodersSet set
        Object.keys(editorialMetadata).forEach((key) => {
            const {locale = '', language = ''} = editorialMetadata[key];
            const folderName = `${locale} ${getLanguageByCode(language)}`;

            foldersSet.add(folderName);
        });

        const categorizedEditorialMetadata = {};

        // For each folder, extract its children
        Array.from(foldersSet).forEach(folder => {
            categorizedEditorialMetadata[folder] = editorialMetadata.filter(({locale, language}) => {
                return folder === `${locale} ${getLanguageByCode(language)}`;
            });
        });
        setFoldersChildren(categorizedEditorialMetadata);

        // Create options for react-select
        setFoldersOptions(Array.from(foldersSet).map(folder => ({value: folder, label: folder})));
    }, [editorialMetadata]);
    useEffect(() => setCurrentFolder(foldersOptions[0]), [foldersOptions]);


    const getLanguageByCode = (code) => {
        if (configLanguage) {
            const found = configLanguage.value.find(e => e.languageCode === code);
            if (found) {
                return found.languageName;
            }
        }
        return code;
    };

    const {value: currentFolderName = ''} = currentFolder || {};

    return (
        <Container fluid id="titleContainer" style={{marginTop: '30px'}}>
            <NexusDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width="extended"
                position="right"
            >
                <Title
                    coreTitleData={coreTitleData}
                    editorialTitleData={editorialTitleData}
                />
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
            <Row>
                <div style={{width: '200px', margin: '5px 0 15px 15px'}}>
                    <Select
                        options={foldersOptions}
                        defaultValue={foldersOptions[0]}
                        value={currentFolder || foldersOptions[0]}
                        onChange={folder => {
                            toggle(0);
                            setCurrentFolder(folder);
                        }}
                    />
                </div>
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
                    foldersChildren[currentFolderName] && foldersChildren[currentFolderName].map((item, i) => {
                        return (
                            <span
                                className="tablinks"
                                style={{background: activeTab === i ? '#000' : '', color: activeTab === i ? '#FFF' : ''}}
                                key={i}
                                onClick={() => toggle(i)}
                            >
                                <b>
                                    {`${(item.format || '')} ${(item.service || '')}`}
                                </b>
                            </span>
                        );
                    })
                }
            </div>
            <TabContent activeTab={activeTab}>
                {
                    foldersChildren && foldersChildren[currentFolderName] ?
                        !isEditMode && foldersChildren[currentFolderName].map((item, i) => {
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
    coreTitleData: PropTypes.object,
    editorialTitleData: PropTypes.array,
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
    coreTitleData: {},
    editorialTitleData: [],
};

export default connect(mapStateToProps)(EditorialMetadata);
