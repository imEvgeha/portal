import React from 'react';
import PropTypes from 'prop-types';
import './AvailsTableToolbar.scss';
import NexusTableExportDropdown from '../avails-table-export-dropdown/AvailsTableExportDropdown';
import AvailsTableReleaseReport from '../avails-table-release-report/AvailsTableReleaseReport';
import PrePlanActions from '../pre-plan-actions/PrePlanActions';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB, PRE_PLAN_TAB, SELECTED_FOR_PLANNING_TAB} from '../rights-repository/constants';
import SelectedRightsActions from '../selected-rights-actions/SelectedRightsActions';
import SelectedButton from './components/selected-button/SelectedButton';

const AvailsTableToolbar = ({
    totalRows,
    selectedRightsCount,
    prePlanRightsCount,
    planningRightsCount,
    hasDownloadButton,
    selectedRows,
    activeTab,
    setActiveTab,
    setActiveTabIndex,
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
    selectedForPlanningColumnApi,
    selectedForPlanningGridApi,
}) => {
    const isItSamePage = (tab) => activeTab === tab;

    const getAmountOfRowsForCurrentTab = () => {
        if(isItSamePage(SELECTED_FOR_PLANNING_TAB)) {
            return planningRightsCount;
        }
        if(isItSamePage(PRE_PLAN_TAB)) {
            return prePlanRightsCount;
        }
        return totalRows;
    };

    return (
        <div className="nexus-c-table-toolbar d-flex justify-content-between row">
            <div className='col-xs-12 col-xl-8 d-flex align-items-center justify-content-xs-between justify-content-xl-start'>
                <div className="nexus-c-table-toolbar__rights-counter-container">
                    <span className="nexus-c-table-toolbar__total-rows">{getAmountOfRowsForCurrentTab()}</span>
                </div>
                <div className='d-flex'>
                    <div className="nexus-c-table-toolbar__selected-button-container">
                        {[RIGHTS_TAB, RIGHTS_SELECTED_TAB].includes(activeTab) && (
                            <SelectedButton
                                selectedRightsCount={selectedRightsCount}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setActiveTabIndex={setActiveTabIndex}
                                inNewDesign
                            />
                        )}
                    </div>
                    
                    {
                        isItSamePage(SELECTED_FOR_PLANNING_TAB) ? null :
                        <div className="nexus-c-table-toolbar__separation-line" />
                    }

                    {isItSamePage(RIGHTS_TAB) || isItSamePage(RIGHTS_SELECTED_TAB) ? (
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
                    ) : null}
                    {isItSamePage(PRE_PLAN_TAB) ? (
                        <PrePlanActions
                            selectedPrePlanRights={selectedPrePlanRights}
                            setSelectedPrePlanRights={setSelectedPrePlanRights}
                            selectedRightGridApi={selectedRightGridApi}
                            setSelectedRights={setSelectedRights}
                            setPreplanRights={setPreplanRights}
                            prePlanRepoRights={prePlanRepoRights}
                            username={username}
                            singleRightMatch={singleRightMatch}
                            setSingleRightMatch={setSingleRightMatch}
                        />
                    ) : null} 
                    {isItSamePage(SELECTED_FOR_PLANNING_TAB) && null}
                </div>
            </div>
            <div className='col-xs-12 col-xl-4'>
                {hasDownloadButton && (
                    <div className="nexus-c-table-toolbar__button-container">
                        <AvailsTableReleaseReport />
                        <NexusTableExportDropdown
                            activeTab={activeTab}
                            selectedRows={selectedRows}
                            rightsFilter={rightsFilter}
                            rightColumnApi={rightColumnApi}
                            selectedRightColumnApi={selectedRightColumnApi}
                            selectedRightGridApi={selectedRightGridApi}
                            prePlanColumnApi={prePlanColumnApi}
                            prePlanGridApi={prePlanGridApi}
                            selectedForPlanningColumnApi={selectedForPlanningColumnApi}
                            selectedForPlanningGridApi={selectedForPlanningGridApi}
                            totalRows={totalRows}
                            prePlanRightsCount={prePlanRightsCount}
                            planningRightsCount={planningRightsCount}
                            username={username}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

AvailsTableToolbar.propTypes = {
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
    selectedForPlanningColumnApi: PropTypes.object,
    selectedForPlanningGridApi: PropTypes.object,
    setActiveTabIndex: PropTypes.func,
};

AvailsTableToolbar.defaultProps = {
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
    selectedForPlanningColumnApi: {},
    selectedForPlanningGridApi: {},
    setActiveTabIndex: () => null,
};

export default AvailsTableToolbar;
