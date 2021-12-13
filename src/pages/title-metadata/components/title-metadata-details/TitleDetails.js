import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {getAllFields} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import NexusStickyFooter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-sticky-footer/NexusStickyFooter';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import classnames from 'classnames';
import {get, isEmpty, isEqual, pickBy, cloneDeep, omit, isObject} from 'lodash';
import {connect, useSelector} from 'react-redux';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';
import {fetchConfigApiEndpoints} from '../../../legacy/containers/settings/settingsActions';
import * as settingsSelectors from '../../../legacy/containers/settings/settingsSelectors';
import Loading from '../../../static/Loading';
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
    clearSeasonPersons,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds, getEpisodesCount, regenerateAutoDecoratedMetadata} from '../../titleMetadataServices';
import {
    handleEditorialGenresAndCategory,
    handleTitleCategory,
    updateTerritoryMetadata,
    updateEditorialMetadata,
    isNexusTitle,
    isStateEditable,
    isMgmTitle,
    prepareCategoryField,
    handleDirtyValues,
    propagateSeasonsPersonsToEpisodes,
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
    castCrewConfig,
    syncTitle,
    publishTitle,
    isSaving,
    isVZTitleSyncing,
    isMOVTitleSyncing,
    isVZTitlePublishing,
    isMOVTitlePublishing,
    titleLoading,
    emetLoading,
    clearSeasonPersons,
    externalIdsLoading,
}) => {
    const containerRef = useRef();
    const [refresh, setRefresh] = useState(false);
    const [VZDisabled, setVZDisabled] = useState(true);
    const [MOVDisabled, setMOVDisabled] = useState(true);

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
        const cleanedValues = values.editorialMetadata.map(item => pickBy(item, v => v !== undefined));
        console.log('%ccleanedValues', 'color: red; font-size: 14px;', cleanedValues);

        const updatedNewValues = handleDirtyValues(initialValues, values);
        const updatedNewValuesClone = cloneDeep(updatedNewValues);

        const cleanedUpdatedValues = updatedNewValuesClone.map(item =>
            pickBy(item, v => v !== undefined, delete item.isUpdated)
        );

        console.log('%ccleanedUpdatedValues', 'color: gold; font-size: 14px;', cleanedUpdatedValues);

        const getMapFromArray = data =>
            data.reduce((acc, item) => {
                console.log('%c@@@@@@@@@@@item', 'color: tomato; font-size: 14px;', item);

                const init = [];

                // add object key to our object i.e. charmander: { type: 'water' }
                //   acc = { item: Object.values(item.title) !== undefined && item.title };
                acc = init.push(pickBy(item, v => v !== undefined));
                return init;
            }, []);

        // let test = []
        // const getMapFromArray2 = data => data.map((item, i) => {

        //     test.push(pickBy(item, v => v !== undefined))

        // })

        console.log('%cgetMapFromArray', 'color: magenta; font-size: 14px;', getMapFromArray(cleanedUpdatedValues));

        // console.log('%ctest', 'color: gold; font-size: 14px;', test);

        cleanedUpdatedValues.map(item => {
            // const getMapFromArray = data =>
            // data.reduce((acc, item) => {
            //   // add object key to our object i.e. charmander: { type: 'water' }
            //   acc = { item };
            //   return acc;
            // }, {});

            // console.log('%cgetMapFromArray', 'color: magenta; font-size: 14px;', getMapFromArray(item));

            let cleanedObject;
            Object.keys(item).forEach(key => {
                const innerObj = item[`${key}`];

                console.log('%cinnerObj', 'color: gold; font-size: 14px;', innerObj);
                // console.log('%cinnerObj removed', 'color: gold; font-size: 14px;',
                // isObject(innerObj) && pickBy(innerObj, v => v !== undefined) );

                const innerObjCleaned = isObject(innerObj) && pickBy(innerObj, v => v !== undefined);

                cleanedObject = {cleanedObject, ...innerObjCleaned};

                // console.log('%cinnerObjCleaned', 'color: lawngreen; font-size: 14px;', {innerObj, ...innerObjCleaned});

                // isObject(innerObj) && Object.keys(innerObj).forEach( inKey =>
                //     console.log('%cinKey', 'color: gold; font-size: 14px;', inKey)
                // )
            });
            console.log('%ccleanedObject', 'color: aqua; font-size: 14px;', cleanedObject);
        });

        const isEmetUpdated = isEqual(cleanedValues, cleanedUpdatedValues);
        console.log('%cisEmetUpdated', 'color: gold; font-size: 14px;', isEmetUpdated);

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
            updateTitle({...updatedValues, id: title.id}),
            updateTerritoryMetadata(values, id),
            updateEditorialMetadata(values, id),
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
    const extendTitleWithExternalIds = () => {
        const [vzExternalIds] = getExternaIds('vz');
        const [movidaExternalIds] = getExternaIds('movida');
        const updatedTitle = handleTitleCategory(title);
        const updatedEditorialMetadata = handleEditorialGenresAndCategory(editorialMetadata, 'category', 'name');

        return {
            ...updatedTitle,
            totalEpisodesCount: episodesCount.total ? episodesCount.total : '0',
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
    const loading = isLoadingSelectValues || isEmpty(selectValues) || emetLoading || titleLoading || externalIdsLoading;
    return (
        <div className={classnames(loading ? 'nexus-c-title-details__loading' : 'nexus-c-title-details')}>
            <TitleDetailsHeader title={title} history={history} containerRef={containerRef} canEdit={canEdit} />
            {loading ? (
                <Loading />
            ) : (
                <>
                    <NexusDynamicForm
                        castCrewConfig={castCrewConfig}
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
    isVZTitlePublishing: PropTypes.bool,
    isMOVTitlePublishing: PropTypes.bool,
    fetchConfigApiEndpoints: PropTypes.func,
    castCrewConfig: PropTypes.object,
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
    isVZTitlePublishing: false,
    isMOVTitlePublishing: false,
    fetchConfigApiEndpoints: () => null,
    clearSeasonPersons: () => null,
    titleLoading: true,
    emetLoading: true,
    externalIdsLoading: true,
    castCrewConfig: {},
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
    const isVZTitlePublishingSelector = selectors.createVZTitleIsPublishingSelector();
    const isMOVTitlePublishingSelector = selectors.createMOVTitleIsPublishingSelector();
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
        isVZTitlePublishing: isVZTitlePublishingSelector(state, props),
        isMOVTitlePublishing: isMOVTitlePublishingSelector(state, props),
        castCrewConfig: settingsConfigEndpointsSelector(state, props).find(e => e.displayName === 'Persons'),
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
