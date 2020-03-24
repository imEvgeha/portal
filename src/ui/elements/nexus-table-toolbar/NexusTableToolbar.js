import React from 'react';
import PropTypes from 'prop-types';
import './NexusTableToolbar.scss';
import MoreIcon from '../../../assets/more-icon.svg';
import NexusTableExportDropdown from '../nexus-table-export-dropdown/NexusTableExportDropdown';
import SelectedButton from './components/SelectedButton';
import {
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB
} from '../../../avails/rights-repository/RightsRepository';

const NexusTableToolbar = ({
    title,
    totalRows,
    selectedRightsCount,
    hasSelectedTab,
    hasDownloadButton,
    selectedRows,
    activeTab,
    setActiveTab,
    rightsFilter,
    rightColumnApi,
    selectedRightColumnApi,
    selectedRightGridApi
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            <MoreIcon fill="#A5ADBA" />
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
    selectedRightsCount: PropTypes.number
};

NexusTableToolbar.defaultProps = {
    title: null,
    totalRows: 0,
    hasSelectedTab: true,
    hasDownloadButton: true,
    getAllColumns: () => [],
};

export default NexusTableToolbar;
