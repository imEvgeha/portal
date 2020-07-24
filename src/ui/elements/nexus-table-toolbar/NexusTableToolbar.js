import React from 'react';
import PropTypes from 'prop-types';
import './NexusTableToolbar.scss';
import {
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB,
    PRE_PLAN_TAB,
} from '../../../pages/avails/rights-repository/constants';
import SelectedRightsActions from '../../../pages/avails/selected-rights-actions/SelectedRightsActions';
import NexusTableExportDropdown from '../nexus-table-export-dropdown/NexusTableExportDropdown';
import NexusTab from './components/NexusTab';
import SelectedButton from './components/SelectedButton';

const NexusTableToolbar = ({
    title,
    totalRows,
    selectedRightsCount,
    hasDownloadButton,
    selectedRows,
    activeTab,
    setActiveTab,
    setSelectedRights,
    rightsFilter,
    rightColumnApi,
    gridApi,
    selectedRightColumnApi,
    selectedRightGridApi,
    selectedRepoRights,
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            <SelectedRightsActions
                selectedRights={selectedRepoRights}
                selectedRightGridApi={selectedRightGridApi}
                setSelectedRights={setSelectedRights}
                gridApi={gridApi}
            />
            <NexusTab
                title="Rights"
                totalRows={totalRows}
                activeTab={activeTab}
                currentTab={RIGHTS_TAB}
                setActiveTab={setActiveTab}
            />
            <NexusTab
                title="Pre-Plan"
                totalRows={0}
                activeTab={activeTab}
                currentTab={PRE_PLAN_TAB}
                setActiveTab={setActiveTab}
            />
            {hasDownloadButton && (
                <div className="nexus-c-table-toolbar__button-container">
                    <SelectedButton
                        selectedRightsCount={selectedRightsCount}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <NexusTableExportDropdown
                        isSelectedOptionActive={activeTab === RIGHTS_SELECTED_TAB}
                        selectedRows={selectedRows}
                        rightsFilter={rightsFilter}
                        rightColumnApi={rightColumnApi}
                        selectedRightColumnApi={selectedRightColumnApi}
                        selectedRightGridApi={selectedRightGridApi}
                        totalRows={totalRows}
                    />
                </div>
            )}
        </div>
    );
};

NexusTableToolbar.propTypes = {
    title: PropTypes.string,
    totalRows: PropTypes.number,
    hasDownloadButton: PropTypes.bool,
    selectedRightGridApi: PropTypes.object,
    selectedRightColumnApi: PropTypes.object,
    selectedRightsCount: PropTypes.number,
    selectedRepoRights: PropTypes.array,
    setSelectedRights: PropTypes.func.isRequired,
    rightColumnApi: PropTypes.object,
    gridApi: PropTypes.object,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    selectedRows: PropTypes.array.isRequired,
    rightsFilter: PropTypes.object.isRequired,
};

NexusTableToolbar.defaultProps = {
    title: null,
    totalRows: 0,
    hasDownloadButton: true,
    selectedRepoRights: [],
    selectedRightsCount: 0,
    selectedRightGridApi: {},
    selectedRightColumnApi: {},
    rightColumnApi: {},
    gridApi: {},
};

export default NexusTableToolbar;
