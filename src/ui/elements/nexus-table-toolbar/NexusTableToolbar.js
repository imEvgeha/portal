import React from 'react';
import PropTypes from 'prop-types';
import './NexusTableToolbar.scss';
import NexusTableExportDropdown from '../nexus-table-export-dropdown/NexusTableExportDropdown';
import SelectedButton from './components/SelectedButton';
import {
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB,
} from '../../../pages/avails/rights-repository/RightsRepository';
import SelectedRightsActions from '../../../pages/avails/selected-rights-actions/SelectedRightsActions';

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
    selectedRepoRights,
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            <SelectedRightsActions
                selectedRights={selectedRepoRights}
                selectedRightGridApi={selectedRightGridApi}
            />
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

NexusTableToolbar.propTypes = {
    title: PropTypes.string,
    totalRows: PropTypes.number,
    hasDownloadButton: PropTypes.bool,
    selectedRightGridApi: PropTypes.object,
    selectedRightColumnApi: PropTypes.object,
    selectedRightsCount: PropTypes.number,
    selectedRepoRights: PropTypes.array,
    rightColumnApi: PropTypes.object,
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
};

export default NexusTableToolbar;
