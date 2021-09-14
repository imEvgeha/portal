import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {getAllFields} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import NexusStickyFooter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-sticky-footer/NexusStickyFooter';
import {get} from 'lodash';
import {connect} from 'react-redux';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';
import {fetchConfigApiEndpoints} from '../../../legacy/containers/settings/settingsActions';
import * as settingsSelectors from '../../../legacy/containers/settings/settingsSelectors';
import {FIELDS_TO_REMOVE, SYNC, VZ, MOVIDA} from '../../constants';
import {
    getTitle,
    clearTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
    syncTitle,
    publishTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds, regenerateAutoDecoratedMetadata} from '../../titleMetadataServices';
import {
    handleEditorialGenresAndCategory,
    handleTitleCategory,
    updateTerritoryMetadata,
    updateEditorialMetadata,
    isNexusTitle,
    isStateEditable,
    isMgmTitle,
    prepareCategoryField,
    prepareAwardsField,
    handleDirtyValues,
} from '../../utils';
import SyncPublish from './components/SyncPublish';
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
    fetchConfigApiEndpoints,
    getTitle,
    clearTitle,
    getExternalIds,
    getTerritoryMetadata,
    getEditorialMetadata,
    updateTitle,
    selectValues,
    castCrewConfig,
    syncTitle,
    publishTitle,
    isSaving,
    isVZTitleSyncing,
    isMOVTitleSyncing,
    isVZTitlePublishing,
    isMOVTitlePublishing,
}) => {
    const containerRef = useRef();
    const [refresh, setRefresh] = useState(false);
    const [VZDisabled, setVZDisabled] = useState(true);
    const [MOVDisabled, setMOVDisabled] = useState(true);

    const {fields} = schema;

    useEffect(() => {
        return () => {
            clearTitle();
        };
    }, []);

    useEffect(() => {
        fetchConfigApiEndpoints();
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
    }, [refresh]);

    const onSubmit = (values, initialValues) => {
        handleDirtyValues(initialValues, values);
        const {params} = match || {};
        const {id} = params;
        // remove fields under arrayWithTabs
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
        updatedValues['awards'] = prepareAwardsField(updatedValues, selectValues?.awards);
        Promise.all([
            updateTitle({...updatedValues, id: title.id}),
            updateTerritoryMetadata(values, id),
            updateEditorialMetadata(values, id),
        ]).then(() => {
            setVZDisabled(false);
            setMOVDisabled(false);
        });
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

        externalSystem === VZ ? setVZDisabled(true) : setMOVDisabled(true);
    };

    const canEdit = isNexusTitle(title.id) && isStateEditable(title.metadataStatus);

    return (
        <div className="nexus-c-title-details">
            <TitleDetailsHeader title={title} history={history} containerRef={containerRef} canEdit={canEdit} />
            <NexusDynamicForm
                castCrewConfig={castCrewConfig}
                searchPerson={searchPerson}
                schema={schema}
                initialData={extendTitleWithExternalIds()}
                canEdit={isNexusTitle(title.id) && isStateEditable(title.metadataStatus)}
                containerRef={containerRef}
                selectValues={selectValues}
                onSubmit={(values, initialValues) => onSubmit(values, initialValues)}
                generateMsvIds={generateMsvIds}
                regenerateAutoDecoratedMetadata={regenerateAutoDecoratedMetadata}
                hasButtons={isNexusTitle(title.id)}
                isSaving={isSaving}
                setRefresh={setRefresh}
                isTitlePage
            />
            <NexusStickyFooter>
                <NexusStickyFooter.LeftActions>
                    <SyncPublish
                        externalSystem={VZ}
                        externalIds={externalIds}
                        onSyncPublish={syncPublishHandler}
                        isSyncing={isVZTitleSyncing}
                        isPublishing={isVZTitlePublishing}
                        isDisabled={VZDisabled}
                    />
                    <SyncPublish
                        externalSystem={MOVIDA}
                        externalIds={externalIds}
                        onSyncPublish={syncPublishHandler}
                        isSyncing={isMOVTitleSyncing}
                        isPublishing={isMOVTitlePublishing}
                        isDisabled={MOVDisabled}
                    />
                </NexusStickyFooter.LeftActions>
            </NexusStickyFooter>
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
    clearTitle: PropTypes.func,
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
    fetchConfigApiEndpoints: PropTypes.func,
    castCrewConfig: PropTypes.object,
};

TitleDetails.defaultProps = {
    history: {},
    match: {},
    title: {},
    externalIds: [],
    territoryMetadata: [],
    editorialMetadata: [],
    getTitle: () => null,
    clearTitle: () => null,
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
    fetchConfigApiEndpoints: () => null,
    castCrewConfig: {},
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
    const settingsConfigEndpointsSelector = settingsSelectors.createSettingsEndpointsSelector();

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
        castCrewConfig: settingsConfigEndpointsSelector(state, props).find(e => e.displayName === 'Persons'),
    });
};

const mapDispatchToProps = dispatch => ({
    getTitle: payload => dispatch(getTitle(payload)),
    clearTitle: () => dispatch(clearTitle()),
    getExternalIds: payload => dispatch(getExternalIds(payload)),
    getTerritoryMetadata: payload => dispatch(getTerritoryMetadata(payload)),
    getEditorialMetadata: payload => dispatch(getEditorialMetadata(payload)),
    updateTitle: payload => dispatch(updateTitle(payload)),
    syncTitle: payload => dispatch(syncTitle(payload)),
    publishTitle: payload => dispatch(publishTitle(payload)),
    fetchConfigApiEndpoints: payload => dispatch(fetchConfigApiEndpoints(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleDetails);
