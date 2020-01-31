import React from 'react';
import PropTypes from 'prop-types';
import './NexusTableToolbar.scss';
import MoreIcon from '../../assets/more-icon.svg';
import NexusTableExportDropdown from '../nexus-table-export-dropdown/NexusTableExportDropdown';

const NexusTableToolbar = ({
    title,
    totalRows,
    hasSelectedTab,
    hasDownloadButton,
    selectedRows,
    isSelectedOptionActive,
    setIsSelectedOptionActive,
    rightsFilter,
    rightColumnApi,
    selectedRightColumnApi
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            <MoreIcon fill="#A5ADBA" />
            <div
                className={`
                    nexus-c-table-toolbar__title 
                    ${!isSelectedOptionActive ? 'nexus-c-table-toolbar__title--is-active' : ''}
                `}
                onClick={() => setIsSelectedOptionActive(false)}
            >
                {title} ({totalRows})
            </div>
            {hasSelectedTab && (
                <div
                    className={`
                        nexus-c-table-toolbar__selected-option
                        ${isSelectedOptionActive ? 'nexus-c-table-toolbar__selected-option--is-active' : ''}
                    `}
                    onClick={() => setIsSelectedOptionActive(true)}
                >
                    Selected ({Object.keys(selectedRows).length})
                </div>
            )}
            {hasDownloadButton && (
                <div className="nexus-c-table-toolbar__button-container">
                    <NexusTableExportDropdown
                        isSelectedOptionActive={isSelectedOptionActive}
                        selectedRows={selectedRows}
                        rightsFilter={rightsFilter}
                        rightColumnApi={rightColumnApi}
                        selectedRightColumnApi={selectedRightColumnApi}
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
    selectedRows: PropTypes.object.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    rightColumnApi: PropTypes.object.isRequired,
    selectedRightColumnApi: PropTypes.object.isRequired
};

NexusTableToolbar.defaultProps = {
    title: null,
    totalRows: 0,
    hasSelectedTab: true,
    hasDownloadButton: true,
    getAllColumns: () => [],
};

export default NexusTableToolbar;
