import React from 'react';
import PropTypes from 'prop-types';
import './AvailsTableToolbar.scss';
import NexusTableExportDropdown from '../avails-table-export-dropdown/AvailsTableExportDropdown';
import AvailsTableReleaseReport from '../avails-table-release-report/AvailsTableReleaseReport';
import SelectedButton from './components/selected-button/SelectedButton';

const AvailsTableToolbar = ({
    hasDownloadButton,
    activeTab,
    rightsFilter,
    username,
    isSelected,
    setIsSelected,
    showSelectedButton,
    totalRecordsCount,
    selectedRowsCount,
    toolbarActions,
    gridApi,
    columnApi,
}) => {
    const getToolbarActions = () => {
        return (
            <div className="d-flex align-items-center">
                <div className="nexus-c-table-toolbar__separation-line" />
                {toolbarActions}
            </div>
        );
    };

    return (
        <div className="nexus-c-table-toolbar d-flex justify-content-between row">
            <div className="col-xs-12 col-xl-8 d-flex align-items-center justify-content-xs-between justify-content-xl-start">
                <div className="nexus-c-table-toolbar__rights-counter-container">
                    <span className="nexus-c-table-toolbar__total-rows">{totalRecordsCount}</span>
                </div>
                <div className="d-flex">
                    <div className="nexus-c-table-toolbar__selected-button-container d-flex justify-content-end align-items-center">
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
                            selectedRowsCount={selectedRowsCount}
                            totalRecordsCount={totalRecordsCount}
                        />
                        <NexusTableExportDropdown
                            activeTab={activeTab}
                            isSelected={isSelected}
                            selectedRowsCount={selectedRowsCount}
                            rightsFilter={rightsFilter}
                            gridApi={gridApi}
                            columnApi={columnApi}
                            totalRecordsCount={totalRecordsCount}
                            username={username}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

AvailsTableToolbar.propTypes = {
    hasDownloadButton: PropTypes.bool,
    activeTab: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    rightsFilter: PropTypes.object,
    isSelected: PropTypes.bool,
    setIsSelected: PropTypes.func,
    showSelectedButton: PropTypes.bool,
    totalRecordsCount: PropTypes.number,
    selectedRowsCount: PropTypes.number,
    toolbarActions: PropTypes.element,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
};

AvailsTableToolbar.defaultProps = {
    gridApi: {},
    columnApi: {},
    hasDownloadButton: true,
    showSelectedButton: false,
    totalRecordsCount: 0,
    selectedRowsCount: 0,
    toolbarActions: undefined,
    rightsFilter: {},
    isSelected: false,
    setIsSelected: null,
};

export default AvailsTableToolbar;
