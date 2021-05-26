import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {getAllFields} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import {get} from 'lodash';
import {connect} from 'react-redux';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';
import {FIELDS_TO_REMOVE, SYNC} from '../../constants';
import {
    getTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
    syncTitle,
    publishTitle,
    editTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds, regenerateAutoDecoratedMetadata} from '../../titleMetadataServices';
import {
    handleEditorialGenresAndCategory,
    handleTitleCategory,
    updateTerritoryMetadata,
    updateEditorialMetadata,
    isNexusTitle,
    isMgmTitle,
    prepareCategoryField,
    handleDirtyValues,
} from '../../utils';
import TitleDetailsHeader from './components/TitleDetailsHeader';
import './TitleDetails.scss';
import schema from './schema.json';

const TitleDetails = ({
    history,
    match,
    title,
    externalIds,
    territoryMetadata,
    editorialMetadata,
    getTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
    selectValues,
    syncTitle,
    publishTitle,
    isSaving,
    isVZTitleSyncing,
    isMOVTitleSyncing,
    isVZTitlePublishing,
    isMOVTitlePublishing,
    isEditMode,
    setEditTitle,
}) => {
    const containerRef = useRef();
    const [isEditView, setIsEditView] = useState(false);

    useEffect(() => {
        const {params} = match || {};
        const {id} = params;
        if (id) {
            const nexusTitle = isNexusTitle(id);
            const isMgm = isMgmTitle(id);
            getTitle({id, isMgm});
            nexusTitle && !isMgm && getExternalIds({id});
            getTerritoryMetadata({id, isMgm});
            getEditorialMetadata({id, isMgm});
        }
    }, []);

    const onSubmit = values => {
        handleDirtyValues(values);
        const {params} = match || {};
        const {id} = params;
        // remove fields under arrayWithTabs
        const {fields} = schema;
        const innerFields = getAllFields(fields, true);
        const allFields = getAllFields(fields, false);
        const valuesNoInnerFields = [];

        // remove innerFields from values
        Object.keys(values).forEach(key => {
            const removeFromPayload = get(allFields, `${key}.removeFromPayload`);
            if (!get(innerFields, key) && !removeFromPayload) {
                valuesNoInnerFields[key] = values[key];
            }
        });

        const updatedValues = [];
        Object.keys(valuesNoInnerFields).forEach(key => {
            if (!FIELDS_TO_REMOVE.find(e => e === key)) {
                updatedValues[key] = values[key];
            }
        });
        prepareCategoryField(updatedValues);
        updateTitle({...updatedValues, id: title.id});
        updateTerritoryMetadata(values, id);
        updateEditorialMetadata(values, id);
    };

    const getExternaIds = repo => {
        if (isNexusTitle(title.id)) {
            return externalIds.filter(ids => ids.externalSystem === repo);
        } 
            return [
                {
                    externalTitleId: get(title.legacyIds, `${repo}.${repo}TitleId`, ''),
                    externalId: get(title.legacyIds, `${repo}.${repo}Id`, ''),
                },
            ];
        
    };
    const extendTitleWithExternalIds = repo => {
        const [vzExternalIds] = getExternaIds('vz');
        const [movidaExternalIds] = getExternaIds('movida');
        const updatedTitle = handleTitleCategory(title);
        const updatedEditorialMetadata = handleEditorialGenresAndCategory(editorialMetadata, 'category', 'name');
        return {
            ...updatedTitle,
            vzExternalIds,
            movidaExternalIds,
            editorialMetadata: handleEditorialGenresAndCategory(updatedEditorialMetadata, 'genres', 'genre'),
            territorialMetadata: territoryMetadata,
        };
    };

    const syncPublishHandler = (externalSystem, buttonType) => {
        const {params} = match || {};
        const {id} = params;
        if (buttonType === SYNC) {
            syncTitle({id, externalSystem});
        } else {
            publishTitle({id, externalSystem});
        }
    };

    return (
        <div className="nexus-c-title-details">
            <TitleDetailsHeader
                title={title}
                history={history}
                containerRef={containerRef}
                externalIds={externalIds}
                onSyncPublish={syncPublishHandler}
                isEditView={isEditView}
                isVZSyncing={isVZTitleSyncing}
                isMOVSyncing={isMOVTitleSyncing}
                isVZPublishing={isVZTitlePublishing}
                isMOVPublishing={isMOVTitlePublishing}
            />
            <NexusDynamicForm
                searchPerson={searchPerson}
                schema={schema}
                initialData={extendTitleWithExternalIds()}
                isEdit={isEditMode}
                setEditMode={setEditTitle}
                isTitlePage={true}
                containerRef={containerRef}
                selectValues={selectValues}
                onSubmit={values => onSubmit(values)}
                generateMsvIds={generateMsvIds}
                regenerateAutoDecoratedMetadata={regenerateAutoDecoratedMetadata}
                hasButtons={isNexusTitle(title.id)}
                setIsEditView={setIsEditView}
                isSaving={isSaving}
            />
        </div>
    );
};

TitleDetails.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    title: PropTypes.object,
    externalIds: PropTypes.array,
    territoryMetadata: PropTypes.array,
    editorialMetadata: PropTypes.array,
    getTitle: PropTypes.func,
    getExternalIds: PropTypes.func,
    getTerritoryMetadata: PropTypes.func,
    getEditorialMetadata: PropTypes.func,
    updateTitle: PropTypes.func,
    selectValues: PropTypes.object,
    syncTitle: PropTypes.func,
    publishTitle: PropTypes.func,
    isSaving: PropTypes.bool,
    isVZTitleSyncing: PropTypes.bool,
    isMOVTitleSyncing: PropTypes.bool,
    isVZTitlePublishing: PropTypes.bool,
    isMOVTitlePublishing: PropTypes.bool,
    isEditMode: PropTypes.bool,
    setEditTitle: PropTypes.func,
};

TitleDetails.defaultProps = {
    history: {},
    match: {},
    title: {},
    externalIds: [],
    territoryMetadata: [],
    editorialMetadata: [],
    getTitle: () => null,
    getExternalIds: () => null,
    getTerritoryMetadata: () => null,
    getEditorialMetadata: () => null,
    updateTitle: () => null,
    selectValues: {},
    syncTitle: () => null,
    publishTitle: () => null,
    isSaving: false,
    isVZTitleSyncing: false,
    isMOVTitleSyncing: false,
    isVZTitlePublishing: false,
    isMOVTitlePublishing: false,
    isEditMode: false,
    setEditTitle: () => null,
};

const mapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    const externalIdsSelector = selectors.createExternalIdsSelector();
    const territoryMetadataSelector = selectors.createTerritoryMetadataSelector();
    const editorialMetadataSelector = selectors.createEditorialMetadataSelector();
    const isVZTitleSyncingSelector = selectors.createVZTitleIsSyncingSelector();
    const isMOVTitleSyncingSelector = selectors.createMOVTitleIsSyncingSelector();
    const isVZTitlePublishingSelector = selectors.createVZTitleIsPublishingSelector();
    const isMOVTitlePublishingSelector = selectors.createMOVTitleIsPublishingSelector();
    const isEditModeSelector = selectors.createIsEditModeSelector();

    return (state, props) => ({
        title: titleSelector(state, props),
        externalIds: externalIdsSelector(state, props),
        territoryMetadata: territoryMetadataSelector(state, props),
        editorialMetadata: editorialMetadataSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
        isSaving: detailsSelectors.isSavingSelector(state),
        isVZTitleSyncing: isVZTitleSyncingSelector(state, props),
        isMOVTitleSyncing: isMOVTitleSyncingSelector(state, props),
        isVZTitlePublishing: isVZTitlePublishingSelector(state, props),
        isMOVTitlePublishing: isMOVTitlePublishingSelector(state, props),
        isEditMode: isEditModeSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getTitle: payload => dispatch(getTitle(payload)),
    getExternalIds: payload => dispatch(getExternalIds(payload)),
    getTerritoryMetadata: payload => dispatch(getTerritoryMetadata(payload)),
    getEditorialMetadata: payload => dispatch(getEditorialMetadata(payload)),
    updateTitle: payload => dispatch(updateTitle(payload)),
    syncTitle: payload => dispatch(syncTitle(payload)),
    publishTitle: payload => dispatch(publishTitle(payload)),
    setEditTitle: payload => dispatch(editTitle(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleDetails);
