import React from 'react';
import PropTypes from 'prop-types';
import './NexusTableToolbar.scss';
import NexusTableExportDropdown from '../nexus-table-export-dropdown/NexusTableExportDropdown';
import SelectedButton from './components/SelectedButton';
import {
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB
} from '../../../pages/avails/rights-repository/RightsRepository';
import MoreActions from '../../../pages/avails/right-history-view/components/MoreActions/MoreActions';

const NexusTableToolbar = ({
    title,
    totalRows,
    selectedRightsCount,
    hasDownloadButton,
    selectedRows,
    activeTab,
    setActiveTab,
    rightsFilter,
    rightColumnApi,
    selectedRightColumnApi,
    selectedRightGridApi,
    selectedRepoRights
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            <MoreActions selectedRights={selectedRepoRights} />
            <div
                className={`
                    nexus-c-table-toolbar__title 
                    ${activeTab !== RIGHTS_SELECTED_TAB ? 'nexus-c-table-toolbar__title--is-active' : ''}
                `}
                onClick={() => setActiveTab(RIGHTS_TAB)}
            >
                {title} ({totalRows})
            </div>
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

NexusTableToolbar.propsTypes = {
    title: PropTypes.string,
    totalRows: PropTypes.bool,
    hasSelectedTab: PropTypes.bool,
    hasDownloadButton: PropTypes.bool,
    selectedRows: PropTypes.array.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    rightColumnApi: PropTypes.object.isRequired,
    selectedRightGridApi: PropTypes.object.isRequired,
    selectedRightsCount: PropTypes.number,
    selectedRepoRights: PropTypes.array,
};

NexusTableToolbar.defaultProps = {
    title: null,
    totalRows: 0,
    hasSelectedTab: true,
    hasDownloadButton: true,
    getAllColumns: () => [],
    selectedRepoRights: []
};

export default NexusTableToolbar;
