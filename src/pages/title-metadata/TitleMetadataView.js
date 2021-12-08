import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import CloudUploadIcon from '@vubiquity-nexus/portal-assets/action-cloud-upload.svg';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import NexusUploadButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload-button/NexusUploadButton';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {store} from '../../index';
import TitleCreate from '../legacy/containers/metadata/dashboard/components/TitleCreateModal'; // TODO:replace with new component
import {resetTitle} from '../metadata/metadataActions';
import CatalogueOwner from './components/catalogue-owner/CatalogueOwner';
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import CloudDownloadButton from './components/title-metadata-header/components/CloudDownloadButton/CloudDownloadButton';
import TitleMetadataTable from './components/title-metadata-table/TitleMetadataTable';
import './TitleMetadataView.scss';
import {storeTitleUserDefinedGridState, uploadMetadata} from './titleMetadataActions';
import {createGridStateSelector, createTitleMetadataFilterSelector} from './titleMetadataSelectors';
import {CREATE_NEW_TITLE, SYNC_LOG, DEFAULT_CATALOGUE_OWNER, UNMERGE_TITLE_SUCCESS, METADATA_UPLOAD_TITLE} from './constants';



export const TitleMetadataView = ({
    history,
    toggleRefreshGridData,
    resetTitleId,
    storeTitleUserDefinedGridState,
    username,
    gridState,
    titleMetadataFilter,
    uploadMetadata
}) => {
    const [showModal, setShowModal] = useState(false);
    const [catalogueOwner, setCatalogueOwner] = useState({
        tenantCode: DEFAULT_CATALOGUE_OWNER,
    });

    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);

    useEffect(() => {
        if (!isEmpty(gridState) && username) {
            setUserDefinedGridStates(gridState[`${username}`]);
        }
    }, [gridState, username]);

    useEffect(() => {
        resetTitleId();
        if (window.sessionStorage.getItem('unmerge')) {
            const successToast = {
                title: 'Success',
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: UNMERGE_TITLE_SUCCESS,
            };

            window.sessionStorage.removeItem('unmerge');
            store.dispatch(addToast(successToast));
        }
    }, []);

    const closeModalAndRefreshTable = () => {
        setShowModal(false);
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

    const tableLabels = {
        savedDropdownLabel: 'Saved Table View:',
        savedViewslabel: 'My Saved Views',
    };

    const tableOptions = [{label: 'All', value: 'all'}];

    const resetToAll = (gridApi, filter, columnApi) => {
        gridApi.setFilterModel();
        gridApi.onFilterChanged();
        columnApi.resetColumnState();
    };

    const uploadHandler = (file) => {
        const params = {
            tenantCode: catalogueOwner.tenantCode.toUpperCase(),
            file,
        }; 
        uploadMetadata(params);
    };

    const [blockLastFilter, setBlockLastFilter] = useState(true);

    useEffect(() => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && blockLastFilter) {
            gridApi.setFilterModel(titleMetadataFilter.filterModel);
            setSorting(titleMetadataFilter.sortModel, columnApi);
            columnApi.setColumnState(titleMetadataFilter.columnState);
        }
    }, [gridApi, columnApi]);

    const storedFilterData = titleMetadataFilter;
    const storedFilterDataId = titleMetadataFilter?.id;

    const lastStoredFilter = {
        label: storedFilterDataId,
    };

    const lastFilterView = (gridApi, columnApi, id) => {
        if (!isEmpty(gridApi) && !isEmpty(columnApi) && id) {
            const {columnState, filterModel, sortModel} = storedFilterData || {};
            gridApi.setFilterModel(filterModel);
            setSorting(sortModel, columnApi);
            columnApi.setColumnState(columnState);
        }
    };

    blockLastFilter && lastFilterView(gridApi, columnApi, storedFilterDataId);

    return (
        <div className="nexus-c-title-metadata">
            <TitleMetadataHeader>
                <NexusUploadButton title={METADATA_UPLOAD_TITLE} icon={CloudUploadIcon} uploadCallback={uploadHandler} />
                <CloudDownloadButton />
                <NexusSavedTableDropdown
                    gridApi={gridApi}
                    columnApi={columnApi}
                    username={username}
                    userDefinedGridStates={userDefinedGridStates}
                    setUserDefinedGridState={storeTitleUserDefinedGridState}
                    applyPredefinedTableView={resetToAll}
                    tableLabels={tableLabels}
                    tableOptions={tableOptions}
                    lastStoredFilter={lastStoredFilter}
                    setBlockLastFilter={setBlockLastFilter}
                    isTitleMetadata={true}
                />
                <CatalogueOwner setCatalogueOwner={changeCatalogueOwner} />
                <Button
                    className="nexus-c-title-metadata__create-btn"
                    appearance="primary"
                    onClick={() => setShowModal(true)}
                >
                    {CREATE_NEW_TITLE}
                </Button>
                <Button
                    className="nexus-c-title-metadata__sync-btn"
                    appearance="subtle"
                    onClick={() => history.push(URL.keepEmbedded('/metadata/sync-log'))}
                >
                    {SYNC_LOG}
                </Button>
            </TitleMetadataHeader>

            <TitleMetadataTable
                history={history}
                catalogueOwner={catalogueOwner}
                setGridApi={setGridApi}
                setColumnApi={setColumnApi}
                columnApi={columnApi}
                gridApi={gridApi}
                className="nexus-c-title-metadata__table"
            />
            <TitleCreate
                display={showModal}
                toggle={closeModalAndRefreshTable}
                tenantCode={catalogueOwner.tenantCode}
                redirectToV2
            />
        </div>
    );
};

const mapStateToProps = () => {
    const gridStateSelector = createGridStateSelector();
    const titleMetadataFilterSelector = createTitleMetadataFilterSelector();
    return state => ({
        username: getUsername(state),
        gridState: gridStateSelector(state),
        titleMetadataFilter: titleMetadataFilterSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    resetTitleId: () => dispatch(resetTitle()),
    storeTitleUserDefinedGridState: payload => dispatch(storeTitleUserDefinedGridState(payload)),
    uploadMetadata: payload => dispatch(uploadMetadata(payload)),
});

TitleMetadataView.propTypes = {
    history: PropTypes.object,
    toggleRefreshGridData: PropTypes.func,
    resetTitleId: PropTypes.func,
    storeTitleUserDefinedGridState: PropTypes.func,
    username: PropTypes.string.isRequired,
    gridState: PropTypes.object,
    titleMetadataFilter: PropTypes.object,
    uploadMetadata: PropTypes.func,
};

TitleMetadataView.defaultProps = {
    history: {},
    toggleRefreshGridData: () => null,
    resetTitleId: () => null,
    storeTitleUserDefinedGridState: () => null,
    gridState: {},
    titleMetadataFilter: {},
    uploadMetadata: () => null,
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleMetadataView);
