import React from 'react';
import PropTypes from 'prop-types';
import './NexusTableToolbar.scss';
import PrePlanActions from '../../../pages/avails/pre-plan-actions/PrePlanActions';
import {RIGHTS_TAB, PRE_PLAN_TAB, SELECTED_FOR_PLANNING_TAB} from '../../../pages/avails/rights-repository/constants';
import SelectedRightsActions from '../../../pages/avails/selected-rights-actions/SelectedRightsActions';
import NexusTableExportDropdown from '../nexus-table-export-dropdown/NexusTableExportDropdown';
import NexusTab from './components/NexusTab';
import SelectedButton from './components/SelectedButton';

const NexusTableToolbar = ({
    totalRows,
    selectedRightsCount,
    prePlanRightsCount,
    planningRightsCount,
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
    setPrePlanRepoRights,
    prePlanRepoRights,
    selectedPrePlanRights,
    setSelectedPrePlanRights,
    setPreplanRights,
    isPlanningTabRefreshed,
    setIsPlanningTabRefreshed,
    username,
    singleRightMatch,
    setSingleRightMatch,
    prePlanColumnApi,
    prePlanGridApi,
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            {activeTab === PRE_PLAN_TAB ? (
                <PrePlanActions
                    selectedPrePlanRights={selectedPrePlanRights}
                    setSelectedPrePlanRights={setSelectedPrePlanRights}
                    selectedRightGridApi={selectedRightGridApi}
                    setSelectedRights={setSelectedRights}
                    setPreplanRights={setPreplanRights}
                    prePlanRepoRights={prePlanRepoRights}
                    username={username}
                />
            ) : (
                <SelectedRightsActions
                    selectedRights={selectedRepoRights}
                    selectedRightGridApi={selectedRightGridApi}
                    setSelectedRights={setSelectedRights}
                    setPrePlanRepoRights={setPrePlanRepoRights}
                    gridApi={gridApi}
                    activeTab={activeTab}
                    singleRightMatch={singleRightMatch}
                    setSingleRightMatch={setSingleRightMatch}
                />
            )}
            <NexusTab title={RIGHTS_TAB} totalRows={totalRows} activeTab={activeTab} setActiveTab={setActiveTab} />
            <NexusTab
                title={PRE_PLAN_TAB}
                totalRows={prePlanRightsCount}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <NexusTab
                title={SELECTED_FOR_PLANNING_TAB}
                totalRows={planningRightsCount}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tooltip="Click to refresh"
                onClick={() => setIsPlanningTabRefreshed(!isPlanningTabRefreshed)}
            />

            {hasDownloadButton && (
                <div className="nexus-c-table-toolbar__button-container">
                    <SelectedButton
                        selectedRightsCount={selectedRightsCount}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <NexusTableExportDropdown
                        activeTab={activeTab}
                        selectedRows={selectedRows}
                        rightsFilter={rightsFilter}
                        rightColumnApi={rightColumnApi}
                        selectedRightColumnApi={selectedRightColumnApi}
                        selectedRightGridApi={selectedRightGridApi}
                        prePlanColumnApi={prePlanColumnApi}
                        prePlanGridApi={prePlanGridApi}
                        totalRows={totalRows}
                        prePlanRightsCount={prePlanRightsCount}
                        username={username}
                    />
                </div>
            )}
        </div>
    );
};

NexusTableToolbar.propTypes = {
    totalRows: PropTypes.number,
    hasDownloadButton: PropTypes.bool,
    selectedRightGridApi: PropTypes.object,
    selectedRightColumnApi: PropTypes.object,
    selectedRightsCount: PropTypes.number,
    prePlanRightsCount: PropTypes.number,
    planningRightsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedRepoRights: PropTypes.array,
    setSelectedRights: PropTypes.func.isRequired,
    setPrePlanRepoRights: PropTypes.func.isRequired,
    rightColumnApi: PropTypes.object,
    gridApi: PropTypes.object,
    activeTab: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    selectedRows: PropTypes.array.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    prePlanRepoRights: PropTypes.array,
    selectedPrePlanRights: PropTypes.array,
    setPreplanRights: PropTypes.func.isRequired,
    setSelectedPrePlanRights: PropTypes.func.isRequired,
    isPlanningTabRefreshed: PropTypes.bool.isRequired,
    setIsPlanningTabRefreshed: PropTypes.func.isRequired,
    singleRightMatch: PropTypes.array,
    setSingleRightMatch: PropTypes.func,
    prePlanColumnApi: PropTypes.object,
    prePlanGridApi: PropTypes.object,
};

NexusTableToolbar.defaultProps = {
    totalRows: 0,
    hasDownloadButton: true,
    selectedRepoRights: [],
    selectedRightsCount: 0,
    prePlanRightsCount: 0,
    planningRightsCount: 0,
    selectedRightGridApi: {},
    selectedRightColumnApi: {},
    rightColumnApi: {},
    gridApi: {},
    prePlanRepoRights: [],
    selectedPrePlanRights: [],
    singleRightMatch: [],
    setSingleRightMatch: () => null,
    prePlanColumnApi: {},
    prePlanGridApi: {},
};

export default NexusTableToolbar;
