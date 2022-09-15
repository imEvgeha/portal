import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isAllowed, Restricted} from '@portal/portal-auth/permissions';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import {getAllFields} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import PropagateButtonWrapper from '@vubiquity-nexus/portal-ui/lib/elements/nexus-person/elements/PropagateButtonWrapper/PropagateButtonWrapper';
import NexusStickyFooter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-sticky-footer/NexusStickyFooter';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {addToast} from '@vubiquity-nexus/portal-ui/src/toast/NexusToastNotificationActions';
import {searchPerson} from '@vubiquity-nexus/portal-utils/lib/services/rightDetailsServices';
import classnames from 'classnames';
import {get, isEmpty, isEqual, isNull, isUndefined, toString, toUpper} from 'lodash';
import moment from 'moment';
import {connect, useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router-dom';
import ShowAllEpisodes from '../../../../common/components/showAllEpisodes/ShowAllEpisodes';
import {store} from '../../../../index';
import * as detailsSelectors from '../../../avails/right-details/rightDetailsSelector';
import {fetchConfigApiEndpoints} from '../../../settings/settingsActions';
import * as settingsSelectors from '../../../settings/settingsSelectors';
import Loading from '../../../static/Loading';
import {
    EPISODE,
    FIELDS_TO_REMOVE,
    MOVIDA,
    MOVIDA_INTL,
    SEASON,
    SYNC,
    UPDATE_EDITORIAL_METADATA_ERROR,
    UPDATE_EDITORIAL_METADATA_SUCCESS,
    UPDATE_TERRITORY_METADATA_SUCCESS,
    VZ,
} from '../../constants';
import TitleConfigurationService from '../../services/TitleConfigurationService';
import TitleEditorialService from '../../services/TitleEditorialService';
import TitleService from '../../services/TitleService';
import TitleTerritorialService from '../../services/TitleTerritorialService';
import {
    clearSeasonPersons,
    clearTitle,
    getEditorialMetadata,
    getExternalIds,
    getTerritoryMetadata,
    getTitle,
    publishTitle,
    setExternalIdValues,
    syncTitle,
    updateTitle,
} from '../../titleMetadataActions';
import * as selectors from '../../titleMetadataSelectors';
import {generateMsvIds, regenerateAutoDecoratedMetadata} from '../../titleMetadataServices';
import {
    formatEditorialBody,
    formatTerritoryBody,
    handleDirtyValues,
    handleEditorialGenresAndCategory,
    handleTitleCategory,
    isNexusTitle,
    isStateEditable,
    prepareCategoryField,
    propagateSeasonsPersonsToEpisodes,
    isValidContentTypeToCreateCopy,
} from '../../utils';
import ActionMenu from './components/ActionMenu';
import SyncPublish from './components/SyncPublish';
import TitleDetailsHeader from './components/TitleDetailsHeader';
import schema from './schema.json';
import './TitleDetails.scss';

const TitleDetails = ({
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
    setExternalIdValues,
    externalIdOptions,
}) => {
    const containerRef = useRef();
    const isFetchingExternalIdTypes = useRef(false);
    const [refresh, setRefresh] = useState(false);
    const [VZDisabled, setVZDisabled] = useState(true);
    const [MOVDisabled, setMOVDisabled] = useState(true);
    const [MovIntDisabled, setMovIntDisabled] = useState(true);
    const [editorialMetadataUpdatedAt, setEditorialMetadataUpdatedAt] = useState(null);
    const [territoryMetadataUpdatedAt, setTerritoryMetadataUpdatedAt] = useState(null);
    const [episodesCount, setEpisodesCount] = useState('0');
    const [seasonsCount, setSeasonsCount] = useState('0');
    const routeParams = useParams();
    const location = useLocation();

    const titleConfigurationService = TitleConfigurationService.getInstance();
    const titleServiceSingleton = TitleService.getInstance();

    const propagateAddPersons = useSelector(selectors.propagateAddPersonsSelector);
    const propagateRemovePersons = useSelector(selectors.propagateRemovePersonsSelector);
    const selectedTenant = useSelector(state => state?.auth?.selectedTenant || {});

    const externalIdTypes = useSelector(
        state => state?.titleMetadata?.externalDropdownIDs.find(entry => entry.tenantCode === selectedTenant.id)?.values
    );

    const {fields} = schema;

    useEffect(() => {
        return () => {
            clearTitle();
        };
    }, []);

    useEffect(() => {
        setRefresh(true);
    }, [location]);

    useEffect(() => {
        if (refresh) {
            clearTitle();
            fetchConfigApiEndpoints();
            const {id} = routeParams;
            if (id) {
                const nexusTitle = isNexusTitle(id);
                getTitle({id});
                nexusTitle && isAllowed('publishTitleMetadata') && getExternalIds({id});
                getTerritoryMetadata({id, selectedTenant});
                getEditorialMetadata({id, selectedTenant});
                clearSeasonPersons();
                let searchCriteria = {
                    parentId: id,
                    contentType: EPISODE,
                };
                titleServiceSingleton
                    .advancedSearchTitles(searchCriteria, undefined, undefined, undefined, undefined, selectedTenant)
                    .then(res => {
                        setEpisodesCount(res);
                        setRefresh(false);
                    });
                searchCriteria = {...searchCriteria, contentType: SEASON};
                titleServiceSingleton
                    .advancedSearchTitles(searchCriteria, undefined, undefined, undefined, undefined, selectedTenant)
                    .then(res => {
                        setSeasonsCount(res);
                        setRefresh(false);
                    });
            }
        }
    }, [refresh]);

    useEffect(() => {
        if (editorialMetadata.length) {
            const editorialUpdatedAtArray = editorialMetadata.map(item => item.updatedAt);
            const sortedData = editorialUpdatedAtArray.sort((a, b) => (moment(b).isBefore(moment(a)) ? -1 : 1));
            setEditorialMetadataUpdatedAt(sortedData[0]);
        }
    }, [editorialMetadata]);

    useEffect(() => {
        if (territoryMetadata.length) {
            const territoryUpdatedAtArray = territoryMetadata.map(item => item.meta.updatedAt);
            const sortedData = territoryUpdatedAtArray.sort((a, b) => (moment(b).isBefore(moment(a)) ? -1 : 1));
            setTerritoryMetadataUpdatedAt(sortedData[0]);
        }
    }, [territoryMetadata]);

    const onSubmit = (values, initialValues) => {
        isFetchingExternalIdTypes.current = false;
        handleDirtyValues(initialValues, values);

        const isEmetUpdated = values.editorialMetadata?.some(item => item.isUpdated);
        const isTmetUpdated = values.territorialMetadata?.some(item => item.isUpdated);
        const {id} = routeParams;
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

        const canUpdateTitle = !!(values.isUpdated && title?.id);
        prepareCategoryField(updatedValues);
        const updatePayload = {...updatedValues, id: title?.id};

        canUpdateTitle && updateTitleAPI(updatePayload);
        isTmetUpdated && updateTerritoryMetadata(values?.territorialMetadata, id);
        isEmetUpdated && updateEditorialMetadata(values.editorialMetadata, id);

        const promises = [clearSeasonPersons()];

        if (!isEmpty(propagateAddPersons) || !isEmpty(propagateRemovePersons)) {
            const data = {addPersons: propagateAddPersons, deletePersons: propagateRemovePersons};
            promises.push(propagateSeasonsPersonsToEpisodes(data, id));
        }

        Promise.all(promises).then(() => {
            setVZDisabled(true);
            setMOVDisabled(true);
            setMovIntDisabled(true);
        });
    };

    const errorOptions = (type = 'core', details = '') => {
        const messagesVersions = {
            core: 'Unable to save changes, Core Title for this Title has recently been updated. Click below for latest version and resubmit.',
            emet: `Unable to save changes, Editorial Metadata ${details} for this Title has recently been updated. Click below for latest version and resubmit.`,
            tmet: `Unable to save changes, Territory Metadata ${details} for this Title has recently been updated. Click below for latest version and resubmit.`,
        };
        return {
            customErrors: [
                {
                    errorCodes: [412],
                    message: messagesVersions[type],
                    toastAction: {
                        label: 'View Title',
                        icon: 'pi pi-external-link',
                        iconPos: 'right',
                        className: 'p-button-link p-toast-button-link',
                        onClick: () => window.open(window.location.href, '_blank'),
                    },
                },
            ],
        };
    };

    const updateTitleAPI = payload => {
        TitleService.getInstance()
            .update(payload, false, false, errorOptions())
            .then(res => updateTitle({updatePayload: payload, updateResponse: res}));
    };

    const updateTerritoryMetadata = async (territorialMetadata = [], titleId) => {
        const titleTerritorialService = TitleTerritorialService.getInstance();

        const promises = [];
        territorialMetadata.forEach(tmet => {
            if ((get(tmet, 'isUpdated') || get(tmet, 'isDeleted')) && !get(tmet, 'isCreated')) {
                const {id, ...body} = formatTerritoryBody(tmet);
                const errorMsgDetails = `(${body.locale})`;
                promises.push(titleTerritorialService.update(body, titleId, id, errorOptions('tmet', errorMsgDetails)));
            } else if (get(tmet, 'isCreated') && !get(tmet, 'isDeleted')) {
                const body = formatTerritoryBody(tmet);
                const errorMsgDetails = `(${body.locale})`;
                // POST is on V2
                promises.push(titleTerritorialService.create(body, titleId, errorOptions('tmet', errorMsgDetails)));
            }
        });

        let fulfilledPromises = [];
        let rejectedPromises = [];
        await Promise.allSettled(promises).then(res => {
            fulfilledPromises = res.filter(e => e.status === 'fulfilled');
            rejectedPromises = res.filter(e => e.status === 'rejected');
        });

        fulfilledPromises.forEach(() => {
            const successToast = {
                severity: 'success',
                detail: UPDATE_TERRITORY_METADATA_SUCCESS,
            };
            store.dispatch(addToast(successToast));
        });

        if (fulfilledPromises.length && !rejectedPromises.length) {
            return getTerritoryMetadata({id: titleId, selectedTenant});
        }
    };

    const updateEditorialMetadata = async (editorialMetadata = [], titleId) => {
        const titleEditorialService = TitleEditorialService.getInstance();

        let toast = {
            severity: 'error',
            detail: UPDATE_EDITORIAL_METADATA_ERROR,
        };

        const data = editorialMetadata || [];
        const promises = [];
        data.forEach(emet => {
            if ((get(emet, 'isUpdated') || get(emet, 'isDeleted')) && !get(emet, 'isCreated')) {
                const updatedEmet = formatEditorialBody(emet, titleId, false);
                const {locale, language, format} = updatedEmet.body;
                const errorMsgDetails = format ? `(${locale} ${language}, ${format})` : `(${locale} ${language})`;
                promises.push(titleEditorialService.update(updatedEmet, errorOptions('emet', errorMsgDetails)));
            } else if (get(emet, 'isCreated') && !get(emet, 'isDeleted')) {
                const newEmet = formatEditorialBody(emet, titleId, true);
                const {locale, language, format} = newEmet;
                const errorMsgDetails = format ? `(${locale} ${language}, ${format})` : `(${locale} ${language})`;
                promises.push(titleEditorialService.create(newEmet, errorOptions('emet', errorMsgDetails)));
            }
        });

        let fulfilledPromises = [];
        let rejectedPromises = [];
        await Promise.allSettled(promises).then(res => {
            fulfilledPromises = res.filter(e => e.status === 'fulfilled');
            rejectedPromises = res.filter(e => e.status === 'rejected');
        });
        fulfilledPromises.forEach(() => {
            toast = {
                severity: 'success',
                detail: UPDATE_EDITORIAL_METADATA_SUCCESS,
            };
            store.dispatch(addToast(toast));
        });

        if (fulfilledPromises.length && !rejectedPromises.length) {
            return getEditorialMetadata({id: titleId, selectedTenant});
        }
    };

    const getPublishedAt = repo => {
        if (isNexusTitle(title.id)) {
            return externalIds.find(ids => ids.externalIdType === repo);
        }
    };

    const vzPublishedAt = getPublishedAt('vz');
    const movidaPublishedAt = getPublishedAt('movida');
    const movidaUkPublishedAt = getPublishedAt('movida-uk');

    const getDateTime = dateTime => {
        return dateTime ? `Updated At: ${moment(dateTime?.publishedAt).utc().format('YYYY/MM/DD, h:mm:ss a')}` : '';
    };

    /**
     * Calculate the external ids for a given title
     * Nexus Titles get this info from a different API
     * whereas non-nexus titles have it in {title.tenantData} property
     * @returns Flat External Ids list
     */
    const calculateExternalIds = () => {
        const repositories = ['vz', 'movida', 'movida-uk'];
        // for Nexus titles, external ids are fetched from getPublishInfo API
        if (isNexusTitle(title.id)) {
            return externalIds.filter(ids => repositories.includes(ids.externalSystem));
        }
        // else if the title is not a Nexus title
        return title?.tenantData?.complexProperties.find(property => property.name === 'legacyIds').simpleProperties;
    };

    const extendTitleWithExternalIds = () => {
        const externalIds = calculateExternalIds();

        const updatedTitle = handleTitleCategory(title);
        const updatedEditorialMetadata = handleEditorialGenresAndCategory(editorialMetadata, 'categories', 'name');
        // v2 consists of object.data and object.meta, merging meta.id to obj
        const updatedTerritorialMetadata = territoryMetadata?.length
            ? territoryMetadata?.map(metadata => {
                  return {
                      id: metadata.meta.id,
                      ...metadata.data,
                  };
              })
            : [];

        return {
            ...updatedTitle,
            episodesCount: episodesCount.total ? episodesCount.total : '0',
            seasonsCount: seasonsCount.total ? seasonsCount.total : '0',
            externalIds,
            editorialMetadata: handleEditorialGenresAndCategory(updatedEditorialMetadata, 'genres', 'genre'),
            territorialMetadata: updatedTerritorialMetadata,
        };
    };

    const syncPublishHandler = (externalSystem, buttonType) => {
        const {id} = routeParams;
        if (!isAllowed('publishTitleMetadata')) {
            return;
        }

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

    const isEditPermitted = () => isAllowed('editTitleDetails');

    const canEdit = isNexusTitle(title?.id) && isStateEditable(title?.metadataStatus) && isEditPermitted();

    const loading =
        isLoadingSelectValues ||
        isEmpty(selectValues) ||
        emetLoading ||
        titleLoading ||
        externalIdsLoading ||
        isEmpty(title) ||
        isNull(title) ||
        isUndefined(title);

    const getActions = () => {
        return {
            saveAutoDecorate: decorateForm => {
                const titleEditorialService = TitleEditorialService.getInstance();
                return titleEditorialService.addAutoDecorate(decorateForm);
            },
            setRefresh: value => {
                setRefresh(value);
            },
        };
    };

    const getSelectValues = () => {
        let res = {...selectValues};

        if (externalIdTypes) {
            res = {...selectValues, externalIdType: externalIdTypes};
        } else if (!isFetchingExternalIdTypes.current) {
            isFetchingExternalIdTypes.current = true;
            titleConfigurationService
                .getEnums('external-id-type')
                .then(responseOptions => setExternalIdValues({responseOptions}));
        }

        return res;
    };

    const isActionMenuBtnVisible =
        title.id &&
        (isAllowed('isActionMenuVisible') ||
            (isValidContentTypeToCreateCopy(title.contentType) && isAllowed('createTitleCopyAction')));

    return (
        <div className={classnames(loading ? 'nexus-c-title-details__loading' : 'nexus-c-title-details')}>
            <TitleDetailsHeader
                title={title}
                containerRef={containerRef}
                canEdit={canEdit}
                selectedTenant={selectedTenant}
            />
            {loading ? (
                <Loading />
            ) : (
                <>
                    <NexusDynamicForm
                        castCrewConfig={configApiEndpoints.find(e => e.displayName === 'Persons')}
                        searchPerson={searchPerson}
                        schema={schema}
                        initialData={extendTitleWithExternalIds()}
                        canEdit={canEdit}
                        containerRef={containerRef}
                        selectValues={getSelectValues()}
                        seasonPersons={propagateAddPersons}
                        onSubmit={onSubmit}
                        generateMsvIds={generateMsvIds}
                        regenerateAutoDecoratedMetadata={regenerateAutoDecoratedMetadata}
                        hasButtons={isNexusTitle(title.id)}
                        isSaving={isSaving}
                        setRefresh={setRefresh}
                        actions={getActions()}
                        isTitlePage
                        titleActionComponents={{
                            propagate: (onClose, getValues, setFieldValue, key) => (
                                <PropagateButtonWrapper
                                    key={key}
                                    onClose={onClose}
                                    getValues={getValues}
                                    setFieldValue={setFieldValue}
                                    canEdit={isNexusTitle(title.id) && isStateEditable(title.metadataStatus)}
                                />
                            ),
                            showAllEpisodes: (onClose, getValues, setFieldValue, key) => (
                                <ShowAllEpisodes
                                    key={key}
                                    contentType={get(extendTitleWithExternalIds(), 'contentType', '')}
                                    titleId={get(extendTitleWithExternalIds(), 'id', '')}
                                />
                            ),
                        }}
                    />
                    <NexusStickyFooter>
                        <NexusStickyFooter.LeftActions>
                            <Restricted resource="publishTitleMetadata">
                                <NexusTooltip content={getDateTime(vzPublishedAt)}>
                                    <SyncPublish
                                        externalSystem={VZ}
                                        externalIds={externalIds}
                                        onSyncPublish={syncPublishHandler}
                                        isSyncing={isVZTitleSyncing}
                                        isPublishing={isVZTitlePublishing}
                                        isDisabled={VZDisabled}
                                        titleUpdatedAt={title.updatedAt}
                                        editorialMetadataUpdatedAt={editorialMetadataUpdatedAt}
                                        territoryMetadataUpdatedAt={territoryMetadataUpdatedAt}
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
                                        editorialMetadataUpdatedAt={editorialMetadataUpdatedAt}
                                        territoryMetadataUpdatedAt={territoryMetadataUpdatedAt}
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
                                        editorialMetadataUpdatedAt={editorialMetadataUpdatedAt}
                                        territoryMetadataUpdatedAt={territoryMetadataUpdatedAt}
                                        hasButtons={isNexusTitle(title.id)}
                                    />
                                </NexusTooltip>
                            </Restricted>

                            {isActionMenuBtnVisible && (
                                <ActionMenu
                                    title={title}
                                    containerClassName={
                                        isAllowed('publishTitleMetadata') ? 'nexus-c-actions-menu-container' : ''
                                    }
                                    externalIdOptions={externalIdOptions.find(e =>
                                        isEqual(toUpper(toString(e.tenantCode)), toUpper(toString(selectedTenant.id)))
                                    )}
                                    editorialMetadata={editorialMetadata}
                                />
                            )}
                        </NexusStickyFooter.LeftActions>
                    </NexusStickyFooter>
                </>
            )}
        </div>
    );
};

TitleDetails.propTypes = {
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
    setExternalIdValues: PropTypes.func.isRequired,
    externalIdOptions: PropTypes.array,
};

TitleDetails.defaultProps = {
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
    externalIdOptions: [],
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
    const externalIdSelector = selectors.externalIDTypesSelector();

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
        externalIdOptions: externalIdSelector(state),
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
    setExternalIdValues: payload => dispatch(setExternalIdValues(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleDetails);
