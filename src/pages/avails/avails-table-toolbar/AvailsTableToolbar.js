import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './AvailsTableToolbar.scss';
import NexusTableExportDropdown from '../avails-table-export-dropdown/AvailsTableExportDropdown';
import AvailsTableReleaseReport from '../avails-table-release-report/AvailsTableReleaseReport';
import SelectedButton from './components/selected-button/SelectedButton';

const AvailsTableToolbar = ({
    totalRows,
    prePlanRightsCount,
    planningRightsCount,
    hasDownloadButton,
    selectedRows,
    activeTab,
    rightsFilter,
    username,
    isSelected,
    setIsSelected,
    showSelectedButton,
    allRowsCount,
    selectedRowsCount,
    toolbarActions,
    gridApi,
    columnApi,
}) => {
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
                            gridApi={gridApi}
                            columnApi={columnApi}
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
    prePlanRightsCount: PropTypes.number,
    planningRightsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeTab: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    selectedRows: PropTypes.array.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    setIsSelected: PropTypes.func.isRequired,
    showSelectedButton: PropTypes.bool,
    allRowsCount: PropTypes.number,
    selectedRowsCount: PropTypes.number,
    toolbarActions: PropTypes.element,
    gridApi: PropTypes.object.isRequired,
    columnApi: PropTypes.object.isRequired,
};

AvailsTableToolbar.defaultProps = {
    totalRows: 0,
    hasDownloadButton: true,
    prePlanRightsCount: 0,
    planningRightsCount: 0,
    showSelectedButton: false,
    allRowsCount: 0,
    selectedRowsCount: 0,
    toolbarActions: undefined,
};

const mapStateToProps = () => {
    // const statusLogResyncRightsSelector = createStatusLogResyncRightsSelector();
    // return (state, props) => ({
    //     statusLogResyncRights: statusLogResyncRightsSelector(state, props),
    // });
    return {};
};

export default connect(mapStateToProps)(AvailsTableToolbar);
