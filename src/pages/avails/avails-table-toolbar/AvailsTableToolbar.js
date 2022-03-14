import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './AvailsTableToolbar.scss';
import NexusTableExportDropdown from '../avails-table-export-dropdown/AvailsTableExportDropdown';
import AvailsTableReleaseReport from '../avails-table-release-report/AvailsTableReleaseReport';
import {createStatusLogResyncRightsSelector} from '../rights-repository/rightsSelectors';
import SelectedButton from './components/selected-button/SelectedButton';

const AvailsTableToolbar = ({
    totalRows,
    prePlanRightsCount,
    planningRightsCount,
    hasDownloadButton,
    selectedRows,
    activeTab,
    rightsFilter,
    rightColumnApi,
    selectedRightColumnApi,
    selectedRightGridApi,
    username,
    prePlanColumnApi,
    prePlanGridApi,
    selectedForPlanningColumnApi,
    selectedForPlanningGridApi,
    isSelected,
    setIsSelected,
    showSelectedButton,
    allRowsCount,
    selectedRowsCount,
    toolbarActions,
}) => {
    // const getAmountOfRowsForCurrentTab = () => {
    //     if (isItSamePage(SELECTED_FOR_PLANNING_TAB)) {
    //         return planningRightsCount;
    //     }
    //     if (isItSamePage(PRE_PLAN_TAB)) {
    //         return prePlanRightsCount;
    //     }
    //     if (isItSamePage(STATUS_TAB)) {
    //         return statusRightsCount;
    //     }
    //     return totalRows;
    // };
    //
    // const getAmountOfSelectedRowsForCurrentTab = () => {
    //     if ([RIGHTS_TAB, RIGHTS_SELECTED_TAB].includes(activeTab)) {
    //         return selectedRightsCount;
    //     }
    //     if ([PRE_PLAN_TAB, PRE_PLAN_SELECTED_TAB].includes(activeTab)) {
    //         return selectedPrePlanRights.length;
    //     }
    //     if ([STATUS_TAB].includes(activeTab)) {
    //         return statusLogResyncRights['rights']?.length;
    //     }
    //
    //     return 0;
    // };

    const getToolbarActions = () => {
        return (
            <div className="d-flex">
                <div className="nexus-c-table-toolbar__separation-line" />
                {toolbarActions}
            </div>
        );
    };

    return (
        <div className="nexus-c-table-toolbar d-flex justify-content-between row">
            <div className="col-xs-12 col-xl-8 d-flex align-items-center justify-content-xs-between justify-content-xl-start">
                <div className="nexus-c-table-toolbar__rights-counter-container">
                    <span className="nexus-c-table-toolbar__total-rows">{allRowsCount}</span>
                </div>
                <div className="d-flex">
                    <div className="nexus-c-table-toolbar__selected-button-container d-flex justify-content-end">
                        {showSelectedButton && (
                            <SelectedButton
                                selectedRightsCount={selectedRowsCount}
                                setIsSelected={setIsSelected}
                                isSelected={isSelected}
                            />
                        )}
                    </div>

                    {toolbarActions && getToolbarActions()}

                    {/*{isItSamePage(RIGHTS_TAB) || isItSamePage(RIGHTS_SELECTED_TAB) ? (*/}
                    {/*    <SelectedRightsActions*/}
                    {/*        selectedRights={selectedRepoRights}*/}
                    {/*        selectedRightGridApi={selectedRightGridApi}*/}
                    {/*        setSelectedRights={setSelectedRights}*/}
                    {/*        setPrePlanRepoRights={setPrePlanRepoRights}*/}
                    {/*        gridApi={gridApi}*/}
                    {/*        activeTab={activeTab}*/}
                    {/*        singleRightMatch={singleRightMatch}*/}
                    {/*        setSingleRightMatch={setSingleRightMatch}*/}
                    {/*    />*/}
                    {/*) : null}*/}
                    {/*{isItSamePage(PRE_PLAN_TAB) || isItSamePage(PRE_PLAN_SELECTED_TAB) ? (*/}
                    {/*    <PrePlanActions*/}
                    {/*        selectedPrePlanRights={selectedPrePlanRights}*/}
                    {/*        setSelectedPrePlanRights={setSelectedPrePlanRights}*/}
                    {/*        setPreplanRights={setPreplanRights}*/}
                    {/*        prePlanRepoRights={prePlanRepoRights}*/}
                    {/*        username={username}*/}
                    {/*        singleRightMatch={singleRightMatch}*/}
                    {/*        setSingleRightMatch={setSingleRightMatch}*/}
                    {/*    />*/}
                    {/*) : null}*/}

                    {/*{isItSamePage(STATUS_TAB) ? (*/}
                    {/*    <StatusRightsActions statusLogResyncRights={statusLogResyncRights} />*/}
                    {/*) : null}*/}
                    {/*{isItSamePage(SELECTED_FOR_PLANNING_TAB) && null}*/}
                </div>
            </div>
            <div className="col-xs-12 col-xl-4">
                {hasDownloadButton && (
                    <div className="nexus-c-table-toolbar__button-container">
                        <AvailsTableReleaseReport
                            activeTab={activeTab}
                            selectedRows={selectedRows}
                            totalRows={totalRows}
                            prePlanRightsCount={prePlanRightsCount}
                            planningRightsCount={planningRightsCount}
                        />
                        <NexusTableExportDropdown
                            activeTab={activeTab}
                            isSelected={isSelected}
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
    prePlanRightsCount: PropTypes.number,
    planningRightsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rightColumnApi: PropTypes.object,
    activeTab: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    selectedRows: PropTypes.array.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    prePlanColumnApi: PropTypes.object,
    prePlanGridApi: PropTypes.object,
    selectedForPlanningColumnApi: PropTypes.object,
    selectedForPlanningGridApi: PropTypes.object,
    isSelected: PropTypes.bool.isRequired,
    setIsSelected: PropTypes.func.isRequired,
    showSelectedButton: PropTypes.bool,
    allRowsCount: PropTypes.number,
    selectedRowsCount: PropTypes.number,
    toolbarActions: PropTypes.element,
};

AvailsTableToolbar.defaultProps = {
    totalRows: 0,
    hasDownloadButton: true,
    prePlanRightsCount: 0,
    planningRightsCount: 0,
    selectedRightGridApi: {},
    selectedRightColumnApi: {},
    rightColumnApi: {},
    prePlanColumnApi: {},
    prePlanGridApi: {},
    selectedForPlanningColumnApi: {},
    selectedForPlanningGridApi: {},
    showSelectedButton: false,
    allRowsCount: 0,
    selectedRowsCount: 0,
    toolbarActions: undefined,
};

const mapStateToProps = () => {
    const statusLogResyncRightsSelector = createStatusLogResyncRightsSelector();
    return (state, props) => ({
        statusLogResyncRights: statusLogResyncRightsSelector(state, props),
    });
};

export default connect(mapStateToProps)(AvailsTableToolbar);
