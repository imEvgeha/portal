import React from 'react';
import PropTypes from 'prop-types';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {Button} from 'primereact/button';
import './TitleMetadataRepoSelectsAndButtons.scss';
import {TABLE_LABELS, TABLE_OPTIONS} from '../../constants';
import CatalogueOwner from '../catalogue-owner/CatalogueOwner';

const RepositorySelectsAndButtons = ({
    getNameOfCurrentTab,
    gridApi,
    columnApi,
    username,
    userDefinedGridStates,
    setUserDefinedGridState,
    applyPredefinedTableView,
    lastStoredFilter,
    setBlockLastFilter,
    changeCatalogueOwner,
    setShowModal,
}) => {
    if (getNameOfCurrentTab() === 'repository') {
        return (
            <div className="row nexus-c-title-metadata__select-container">
                <div className="d-flex justify-content-end col-xs-12 col-xl-10 col-xxl-11">
                    <NexusSavedTableDropdown
                        gridApi={gridApi}
                        columnApi={columnApi}
                        username={username}
                        userDefinedGridStates={userDefinedGridStates}
                        setUserDefinedGridState={setUserDefinedGridState}
                        applyPredefinedTableView={applyPredefinedTableView}
                        tableLabels={TABLE_LABELS}
                        tableOptions={TABLE_OPTIONS}
                        lastStoredFilter={lastStoredFilter}
                        setBlockLastFilter={setBlockLastFilter}
                        isTitleMetadata={true}
                    />
                    <CatalogueOwner setCatalogueOwner={changeCatalogueOwner} />
                </div>
                <div className="d-flex align-items-center justify-content-end col-xs-12 col-xl-2 col-xxl-1">
                    <Button
                        tooltip="Create New Title"
                        tooltipOptions={{position: 'left'}}
                        icon={IconActionAdd}
                        onClick={() => setShowModal(true)}
                        className="p-button-text nexus-c-title-metadata__create-btn"
                    />
                </div>
            </div>
        );
    }

    return null;
};

RepositorySelectsAndButtons.propTypes = {
    getNameOfCurrentTab: PropTypes.func,
    gridApi: PropTypes.any,
    columnApi: PropTypes.any,
    username: PropTypes.string,
    userDefinedGridStates: PropTypes.array,
    setUserDefinedGridState: PropTypes.func,
    applyPredefinedTableView: PropTypes.func,
    lastStoredFilter: PropTypes.object,
    setBlockLastFilter: PropTypes.func,
    changeCatalogueOwner: PropTypes.func,
    setShowModal: PropTypes.func,
};

RepositorySelectsAndButtons.defaultProps = {
    getNameOfCurrentTab: () => null,
    gridApi: null,
    columnApi: null,
    username: '',
    userDefinedGridStates: [],
    setUserDefinedGridState: () => null,
    applyPredefinedTableView: () => null,
    lastStoredFilter: {},
    setBlockLastFilter: () => null,
    changeCatalogueOwner: () => null,
    setShowModal: () => null,
};

export default RepositorySelectsAndButtons;
