import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {getAllFields} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import NexusStickyFooter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-sticky-footer/NexusStickyFooter';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import classnames from 'classnames';
import {get, isEmpty} from 'lodash';
import moment from 'moment';
import {connect, useSelector} from 'react-redux';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';
import {fetchConfigApiEndpoints} from '../../../legacy/containers/settings/settingsActions';
import * as settingsSelectors from '../../../legacy/containers/settings/settingsSelectors';
import Loading from '../../../static/Loading';
import {FIELDS_TO_REMOVE, MOVIDA, SYNC, VZ, MOVIDA_INTL} from '../../constants';
import {
    clearSeasonPersons,
    clearTitle,
    getEditorialMetadata,
    getExternalIds,
    getTerritoryMetadata,
    getTitle,
    publishTitle,
    syncTitle,
    updateTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds, getEpisodesCount, regenerateAutoDecoratedMetadata} from '../../titleMetadataServices';
import {
    handleDirtyValues,
    handleEditorialGenresAndCategory,
    handleTitleCategory,
    isMgmTitle,
    isNexusTitle,
    isStateEditable,
    prepareCategoryField,
    propagateSeasonsPersonsToEpisodes,
    updateEditorialMetadata,
    updateTerritoryMetadata,
} from '../../utils';
import ActionMenu from './components/ActionMenu';
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
    isLoadingSelectValues,
    configApiEndpoints,
    syncTitle,
    publishTitle,
    isSaving,
    isVZTitleSyncing,
    isMOVTitleSyncing,
    isMovIntTitleSyncing,
    isVZTitlePublishing,
    isMOVTitlePublishing,
    isMovIntTitlePublishing,
    titleLoading,
    emetLoading,
    clearSeasonPersons,
    externalIdsLoading,
}) => {
    const containerRef = useRef();
    const [refresh, setRefresh] = useState(false);
    const [VZDisabled, setVZDisabled] = useState(true);
    const [MOVDisabled, setMOVDisabled] = useState(true);
    const [MovIntDisabled, setMovIntDisabled] = useState(true);
    const [episodesCount, setEpisodesCount] = useState('0');

    const propagateAddPersons = useSelector(selectors.propagateAddPersonsSelector);
    const propagateRemovePersons = useSelector(selectors.propagateRemovePersonsSelector);

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
            clearSeasonPersons();
            getEpisodesCount(id).then(res => {
                setEpisodesCount(res);
            });
        }
    }, [refresh]);

    const onSubmit = (values, initialValues) => {
        handleDirtyValues(initialValues, values);

        const isTitleUpdated = values.isUpdated;
        const isEmetUpdated = values.editorialMetadata.some(item => item.isUpdated);
        const isTmetUpdated = values.territorialMetadata.some(item => item.isUpdated);
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
        Promise.all([
            isTitleUpdated && updateTitle({...updatedValues, id: title.id}),
            isTmetUpdated && updateTerritoryMetadata(values, id),
            isEmetUpdated && updateEditorialMetadata(values, id),
            (!isEmpty(propagateAddPersons) || !isEmpty(propagateRemovePersons)) &&
                propagateSeasonsPersonsToEpisodes(
                    {
                        addPersons: propagateAddPersons,
                        deletePersons: propagateRemovePersons,
                    },
                    id
                ),
            clearSeasonPersons(),
        ]).then(() => {
            setRefresh(prev => !prev);
            setVZDisabled(true);
            setMOVDisabled(true);
            setMovIntDisabled(true);
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

    const getPublishedAt = repo => {
        if (isNexusTitle(title.id)) {
            return externalIds.find(ids => ids.externalSystem === repo);
        }
    };

    const vzPublishedAt = getPublishedAt('vz');
    const movidaPublishedAt = getPublishedAt('movida');
    const movidaUkPublishedAt = getPublishedAt('movida-uk');

    const getDateTime = dateTime => {
        return dateTime ? `Updated At: ${moment(dateTime?.publishedAt).utc().format('YYYY/MM/DD, h:mm:ss a')}` : '';
    };

    const extendTitleWithExternalIds = () => {
        const [vzExternalIds] = getExternaIds('vz');
        const [movidaExternalIds] = getExternaIds('movida');
        const [movidaUkExternalIds] = getExternaIds('movida-uk');

        const updatedTitle = handleTitleCategory(title);
        const updatedEditorialMetadata = handleEditorialGenresAndCategory(editorialMetadata, 'category', 'name');

        return {
            ...updatedTitle,
            episodesCount: episodesCount.total ? episodesCount.total : '0',
            vzExternalIds,
            movidaExternalIds,
            movidaUkExternalIds,
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

        switch (externalSystem) {
            case VZ?.value:
                setVZDisabled(true);
                break;
            case MOVIDA?.value:
                setMOVDisabled(true);
                break;
            case MOVIDA_INTL?.value:
                setMovIntDisabled(true);
                break;
            default:
                break;
        }
    };

    const canEdit = isNexusTitle(title.id) && isStateEditable(title.metadataStatus);
    const loading = isLoadingSelectValues || isEmpty(selectValues) || emetLoading || titleLoading || externalIdsLoading;
    return (
        <div className={classnames(loading ? 'nexus-c-title-details__loading' : 'nexus-c-title-details')}>
            <TitleDetailsHeader title={title} history={history} containerRef={containerRef} canEdit={canEdit} />
            {loading ? (
                <Loading />
            ) : (
                <>
                    <NexusDynamicForm
                        castCrewConfig={configApiEndpoints.find(e => e.displayName === 'Persons')}
                        searchPerson={searchPerson}
                        schema={schema}
                        initialData={extendTitleWithExternalIds()}
                        canEdit={isNexusTitle(title.id) && isStateEditable(title.metadataStatus)}
                        containerRef={containerRef}
                        selectValues={selectValues}
                        seasonPersons={propagateAddPersons}
                        onSubmit={onSubmit}
                        generateMsvIds={generateMsvIds}
                        regenerateAutoDecoratedMetadata={regenerateAutoDecoratedMetadata}
                        hasButtons={isNexusTitle(title.id)}
                        isSaving={isSaving}
                        setRefresh={setRefresh}
                        isTitlePage
                    />
                    <NexusStickyFooter>
                        <NexusStickyFooter.LeftActions>
                            <NexusTooltip content={getDateTime(vzPublishedAt)}>
                                <SyncPublish
                                    externalSystem={VZ}
                                    externalIds={externalIds}
                                    onSyncPublish={syncPublishHandler}
                                    isSyncing={isVZTitleSyncing}
                                    isPublishing={isVZTitlePublishing}
                                    isDisabled={VZDisabled}
                                    titleUpdatedAt={title.updatedAt}
                                    hasButtons={isNexusTitle(title.id)}
                                />
                            </NexusTooltip>

                            <NexusTooltip content={getDateTime(movidaUkPublishedAt)}>
                                <SyncPublish
                                    externalSystem={MOVIDA_INTL}
                                    externalIds={externalIds}
                                    onSyncPublish={syncPublishHandler}
                                    isSyncing={isMovIntTitleSyncing}
                                    isPublishing={isMovIntTitlePublishing}
                                    isDisabled={MovIntDisabled}
                                    titleUpdatedAt={title.updatedAt}
                                    hasButtons={isNexusTitle(title.id)}
                                />
                            </NexusTooltip>
                            <div className="nexus-c-line" />
                            <NexusTooltip content={getDateTime(movidaPublishedAt)}>
                                <SyncPublish
                                    externalSystem={MOVIDA}
                                    externalIds={externalIds}
                                    onSyncPublish={syncPublishHandler}
                                    isSyncing={isMOVTitleSyncing}
                                    isPublishing={isMOVTitlePublishing}
                                    isDisabled={MOVDisabled}
                                    titleUpdatedAt={title.updatedAt}
                                    hasButtons={isNexusTitle(title.id)}
                                />
                            </NexusTooltip>
                            {title.id && <ActionMenu titleId={title.id} />}
                        </NexusStickyFooter.LeftActions>
                    </NexusStickyFooter>
                </>
            )}
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
    clearSeasonPersons: PropTypes.func,
    getExternalIds: PropTypes.func,
    getTerritoryMetadata: PropTypes.func,
    getEditorialMetadata: PropTypes.func,
    updateTitle: PropTypes.func,
    selectValues: PropTypes.object,
    isLoadingSelectValues: PropTypes.bool,
    syncTitle: PropTypes.func,
    publishTitle: PropTypes.func,
    isSaving: PropTypes.bool,
    isVZTitleSyncing: PropTypes.bool,
    isMOVTitleSyncing: PropTypes.bool,
    isMovIntTitleSyncing: PropTypes.bool,
    isVZTitlePublishing: PropTypes.bool,
    isMOVTitlePublishing: PropTypes.bool,
    isMovIntTitlePublishing: PropTypes.bool,
    fetchConfigApiEndpoints: PropTypes.func,
    configApiEndpoints: PropTypes.array,
    titleLoading: PropTypes.bool,
    emetLoading: PropTypes.bool,
    externalIdsLoading: PropTypes.bool,
};

TitleDetails.defaultProps = {
    history: {},
    match: {},
    title: {},
    externalIds: [],
    isLoadingSelectValues: true,
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
    isMovIntTitleSyncing: false,
    isVZTitlePublishing: false,
    isMOVTitlePublishing: false,
    isMovIntTitlePublishing: false,
    fetchConfigApiEndpoints: () => null,
    clearSeasonPersons: () => null,
    titleLoading: true,
    emetLoading: true,
    externalIdsLoading: true,
    configApiEndpoints: [],
};

const mapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    const externalIdsLoadingSelector = selectors.createExternalIdsLoadingSelector();
    const titleLoadingSelector = selectors.createTitleLoadingSelector();
    const emetLoadingSelector = selectors.createEmetLoadingSelector();
    const selectValuesLoadingSelector = createLoadingSelector(['FETCH_SELECT_VALUES']);
    const externalIdsSelector = selectors.createExternalIdsSelector();
    const territoryMetadataSelector = selectors.createTerritoryMetadataSelector();
    const editorialMetadataSelector = selectors.createEditorialMetadataSelector();
    const isVZTitleSyncingSelector = selectors.createVZTitleIsSyncingSelector();
    const isMOVTitleSyncingSelector = selectors.createMOVTitleIsSyncingSelector();
    const isMovIntTitleSyncingSelector = selectors.createMovIntTitleIsSyncingSelector();
    const isVZTitlePublishingSelector = selectors.createVZTitleIsPublishingSelector();
    const isMOVTitlePublishingSelector = selectors.createMOVTitleIsPublishingSelector();
    const isMovIntTitlePublishingSelector = selectors.createMovIntTitleIsPublishingSelector();
    const settingsConfigEndpointsSelector = settingsSelectors.createSettingsEndpointsSelector();

    return (state, props) => ({
        title: titleSelector(state, props),
        titleLoading: titleLoadingSelector(state),
        externalIdsLoading: externalIdsLoadingSelector(state),
        emetLoading: emetLoadingSelector(state),
        externalIds: externalIdsSelector(state, props),
        territoryMetadata: territoryMetadataSelector(state, props),
        editorialMetadata: editorialMetadataSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
        isLoadingSelectValues: selectValuesLoadingSelector(state),
        isSaving: detailsSelectors.isSavingSelector(state),
        isVZTitleSyncing: isVZTitleSyncingSelector(state, props),
        isMOVTitleSyncing: isMOVTitleSyncingSelector(state, props),
        isMovIntTitleSyncing: isMovIntTitleSyncingSelector(state, props),
        isVZTitlePublishing: isVZTitlePublishingSelector(state, props),
        isMOVTitlePublishing: isMOVTitlePublishingSelector(state, props),
        isMovIntTitlePublishing: isMovIntTitlePublishingSelector(state, props),
        configApiEndpoints: settingsConfigEndpointsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getTitle: payload => dispatch(getTitle(payload)),
    clearTitle: () => dispatch(clearTitle()),
    clearSeasonPersons: () => dispatch(clearSeasonPersons()),
    getExternalIds: payload => dispatch(getExternalIds(payload)),
    getTerritoryMetadata: payload => dispatch(getTerritoryMetadata(payload)),
    getEditorialMetadata: payload => dispatch(getEditorialMetadata(payload)),
    updateTitle: payload => dispatch(updateTitle(payload)),
    syncTitle: payload => dispatch(syncTitle(payload)),
    publishTitle: payload => dispatch(publishTitle(payload)),
    fetchConfigApiEndpoints: payload => dispatch(fetchConfigApiEndpoints(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleDetails);
