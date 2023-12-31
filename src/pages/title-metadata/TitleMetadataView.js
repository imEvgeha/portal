import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@portal/portal-auth/authSelectors';
import {isAllowed} from '@portal/portal-auth/permissions';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {TITLE_METADATA} from '@vubiquity-nexus/portal-utils/lib/constants';
import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {get, isEmpty, toLower} from 'lodash';
import {TabMenu} from 'primereact/tabmenu';
import {connect, useSelector} from 'react-redux';
import {store} from '../../index';
import {resetTitle} from '../metadata/metadataActions';
import SyncLogTable from '../sync-log/SyncLogTable';
import TitleMetadataBottomHeaderPart from './components/title-metadata-bottom-header-part/TitleMetadataBottomHeaderPart';
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import RepositorySelectsAndButtons from './components/title-metadata-repo-select-and-buttons/TitleMetadataRepoSelectsAndButtons';
import TitleMetadataTable from './components/title-metadata-table/TitleMetadataTable';
import TitleCreate from './components/titleCreateModal/TitleCreateModal';
import TitleDeleteModal from './components/titleDeleteModal/TitleDeleteModal';
import UploadMetadataTable from './components/upload-metadata-table/UploadMetadataTable';
import TitleConfigurationService from './services/TitleConfigurationService';
import './TitleMetadataView.scss';
import {
    setCurrentUserViewAction,
    setExternalIdValues,
    storeTitleUserDefinedGridState,
    uploadMetadata,
} from './titleMetadataActions';
import {
    createGridStateSelector,
    createTitleMetadataFilterSelector,
    createSelectedTitlesSelector,
    externalIDTypesSelector,
} from './titleMetadataSelectors';
import {TITLE_METADATA_SYNC_LOG_TAB, TITLE_METADATA_TABS, UNMERGE_TITLE_SUCCESS} from './constants';

export const TitleMetadataView = ({
    toggleRefreshGridData,
    resetTitleId,
    storeTitleUserDefinedGridState,
    username,
    gridState,
    titleMetadataFilter,
    uploadMetadata,
    setCurrentUserView,
    setExternalIdValues,
    externalIdOptions,
    selectedTitles,
}) => {
    const selectedTenant = useSelector(state => get(state, 'auth.selectedTenant'));
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [catalogueOwner, setCatalogueOwner] = useState({
        tenantCode: selectedTenant.id,
    });

    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);
    const [showSelected, setShowSelected] = useState(false);

    const selectedTitlesLength = selectedTitles?.[username]?.length || 0;

    const titleConfigurationService = TitleConfigurationService.getInstance();

    useEffect(() => {
        setCatalogueOwner({
            tenantCode: selectedTenant.id,
        });
    }, [selectedTenant]);

    useEffect(() => {
        let currentTenant;
        if (externalIdOptions.length) {
            currentTenant = externalIdOptions.find(e => e.tenantCode === selectedTenant.id);
        }
        if (currentTenant?.tenantCode !== selectedTenant.id) {
            updateExternalIdDropdown().then(responseOptions => setExternalIdValues({responseOptions}));
        }
    }, [selectedTenant]);

    const updateExternalIdDropdown = async () => {
        return titleConfigurationService.getEnums('external-id-type');
    };

    const showSuccess = detail => {
        store.dispatch(
            addToast({
                severity: 'success',
                detail,
                life: 3000,
            })
        );
    };

    const getTitleMetadataTabs = () => {
        if (isAllowed('publishTitleMetadata')) {
            const newTitleMetadataTabs = [...TITLE_METADATA_TABS];
            newTitleMetadataTabs.splice(1, 0, TITLE_METADATA_SYNC_LOG_TAB);
            return newTitleMetadataTabs;
        }
        return TITLE_METADATA_TABS;
    };

    useEffect(() => {
        if (!isEmpty(gridState) && username) {
            setUserDefinedGridStates(gridState[`${username}`]);
        }
    }, [gridState, username]);

    useEffect(() => {
        resetTitleId();
        if (window.sessionStorage.getItem('unmerge')) {
            const successToast = {
                severity: 'success',
                detail: UNMERGE_TITLE_SUCCESS,
            };

            window.sessionStorage.removeItem('unmerge');
            store.dispatch(addToast(successToast));
        }

        return () => {
            setCurrentUserView(undefined);
        };
    }, []);

    const getNameOfCurrentTab = () => {
        const lastIndex = getTitleMetadataTabs()?.length - 1;
        if (lastIndex >= 0) return getTitleMetadataTabs()?.[activeIndex].value;
    };

    const isItTheSameTab = tabName => getNameOfCurrentTab() === tabName;

    const onCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const closeCreateModalAndRefreshTable = () => {
        onCloseCreateModal();
        toggleRefreshGridData(true);
    };

    const changeCatalogueOwner = owner => {
        setCatalogueOwner(prevState => {
            return {
                ...prevState,
                tenantCode: owner,
            };
        });
    };

    const resetToAll = (gridApi, filter, columnApi) => {
        gridApi?.setFilterModel();
        gridApi?.onFilterChanged();
        columnApi?.resetColumnState();
    };

    const uploadHandler = file => {
        const params = {
            tenantCode: catalogueOwner.tenantCode.toUpperCase(),
            file,
        };
        uploadMetadata(params);
    };

    const [blockLastFilter, setBlockLastFilter] = useState(true);

    const storedFilterData = titleMetadataFilter;
    const storedFilterDataId = titleMetadataFilter?.id;

    const lastStoredFilter = {
        label: storedFilterDataId,
    };

    const lastFilterView = (gridApi, columnApi, id) => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && id) {
            const {columnState, filterModel, sortModel} = storedFilterData || {};
            gridApi?.setFilterModel(filterModel);
            setSorting(sortModel, columnApi);
            columnApi?.applyColumnState({state: columnState});
        }
    };

    useEffect(() => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && blockLastFilter) {
            gridApi.setFilterModel(titleMetadataFilter?.filterModel);
            if (columnApi?.columnModel) {
                setSorting(titleMetadataFilter.sortModel, columnApi);
            }
            columnApi?.applyColumnState({state: titleMetadataFilter?.columnState});
        }
    }, [gridApi, columnApi]);

    useEffect(() => {
        blockLastFilter && lastFilterView(gridApi, columnApi, storedFilterDataId);
    }, [blockLastFilter]);

    return (
        <div className="nexus-c-title-metadata">
            <TitleMetadataHeader>
                <div className="row">
                    <div className="col-4">
                        <div className="nexus-c-title-metadata-header__label">{TITLE_METADATA}</div>
                    </div>
                    <div className="col-4 d-flex justify-content-center">
                        <TabMenu
                            className="nexus-c-title-metadata__tab-menu"
                            model={getTitleMetadataTabs()}
                            activeIndex={activeIndex}
                            onTabChange={e => setActiveIndex(e.index)}
                        />
                    </div>
                    <div className="col-4">
                        <RepositorySelectsAndButtons
                            getNameOfCurrentTab={getNameOfCurrentTab}
                            gridApi={gridApi}
                            columnApi={columnApi}
                            username={username}
                            userDefinedGridStates={userDefinedGridStates}
                            setUserDefinedGridState={storeTitleUserDefinedGridState}
                            applyPredefinedTableView={resetToAll}
                            lastStoredFilter={lastStoredFilter}
                            setBlockLastFilter={setBlockLastFilter}
                            changeCatalogueOwner={changeCatalogueOwner}
                            setShowModal={setShowCreateModal}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TitleMetadataBottomHeaderPart
                            className="nexus-c-title-metadata-header__bottom"
                            showSuccess={showSuccess}
                            uploadHandler={uploadHandler}
                            isItTheSameTab={isItTheSameTab}
                            showSelected={showSelected}
                            setShowSelected={setShowSelected}
                            showDeleteModal={showDeleteModal}
                            setShowDeleteModal={setShowDeleteModal}
                            selectedTitlesLength={selectedTitlesLength}
                        />
                    </div>
                </div>
            </TitleMetadataHeader>
            {isItTheSameTab('repository') ? (
                <TitleMetadataTable
                    catalogueOwner={catalogueOwner}
                    showSelected={showSelected}
                    setGridApi={setGridApi}
                    setColumnApi={setColumnApi}
                    columnApi={columnApi}
                    gridApi={gridApi}
                    className="nexus-c-title-metadata__table"
                />
            ) : null}
            {isItTheSameTab('syncLog') && isAllowed('publishTitleMetadata') ? <SyncLogTable /> : null}
            {isItTheSameTab('uploadLog') ? (
                <UploadMetadataTable
                    catalogueOwner={catalogueOwner}
                    setGridApi={setGridApi}
                    setColumnApi={setColumnApi}
                    columnApi={columnApi}
                    gridApi={gridApi}
                    className="nexus-c-title-metadata__table"
                />
            ) : null}
            <TitleCreate
                display={showCreateModal}
                onSave={closeCreateModalAndRefreshTable}
                onCloseModal={onCloseCreateModal}
                tenantCode={catalogueOwner.tenantCode}
                externalDropdownOptions={externalIdOptions.find(
                    e => toLower(e.tenantCode) === toLower(selectedTenant.id)
                )}
            />
            <TitleDeleteModal
                header="Delete Title(s)"
                // Here should be logic to delete titles in future
                onDelete={() => null}
                display={showDeleteModal}
                onCloseModal={() => setShowDeleteModal(false)}
            >
                <div className="d-flex flex-column nexus-c-title-delete_titles">
                    <span className="mb-3">Would you like to delete {`${selectedTitlesLength || ''}`} Title(s)?</span>
                    <span className="mb-3">You will not be able to recover the Title(s) once deleted.</span>
                </div>
            </TitleDeleteModal>
        </div>
    );
};

const mapStateToProps = () => {
    const gridStateSelector = createGridStateSelector();
    const titleMetadataFilterSelector = createTitleMetadataFilterSelector();
    const externalIdSelector = externalIDTypesSelector();
    const selectedTitlesSelector = createSelectedTitlesSelector();
    return state => ({
        username: getUsername(state),
        gridState: gridStateSelector(state),
        titleMetadataFilter: titleMetadataFilterSelector(state),
        externalIdOptions: externalIdSelector(state),
        selectedTitles: selectedTitlesSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    resetTitleId: () => dispatch(resetTitle()),
    storeTitleUserDefinedGridState: payload => dispatch(storeTitleUserDefinedGridState(payload)),
    uploadMetadata: payload => dispatch(uploadMetadata(payload)),
    setCurrentUserView: payload => dispatch(setCurrentUserViewAction(payload)),
    setExternalIdValues: payload => dispatch(setExternalIdValues(payload)),
});

TitleMetadataView.propTypes = {
    toggleRefreshGridData: PropTypes.func,
    resetTitleId: PropTypes.func,
    storeTitleUserDefinedGridState: PropTypes.func,
    username: PropTypes.string,
    gridState: PropTypes.object,
    titleMetadataFilter: PropTypes.object,
    externalIdOptions: PropTypes.array,
    uploadMetadata: PropTypes.func,
    setCurrentUserView: PropTypes.func.isRequired,
    setExternalIdValues: PropTypes.func.isRequired,
    selectedTitles: PropTypes.object.isRequired,
};

TitleMetadataView.defaultProps = {
    toggleRefreshGridData: () => null,
    resetTitleId: () => null,
    storeTitleUserDefinedGridState: () => null,
    username: '',
    gridState: {},
    titleMetadataFilter: {},
    externalIdOptions: [],
    uploadMetadata: () => null,
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleMetadataView);
