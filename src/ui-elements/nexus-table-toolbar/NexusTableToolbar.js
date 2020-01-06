import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './NexusTableToolbar.scss';
import PopOutIcon from '../../assets/action-shortcut.svg';
import MoreIcon from '../../assets/more-icon.svg';

const NexusTableToolbar = ({
    title,
    totalRows,
    hasSelectedTab,
    hasDownloadButton,
    selectedRows
}) => {
    return (
        <div className="nexus-c-table-toolbar">
            <MoreIcon fill="#A5ADBA" />
            <div className="nexus-c-table-toolbar__title">{title} ({totalRows})</div>
            {hasSelectedTab && (
                <div className={`nexus-c-table-toolbar__selected-option ${!selectedRows ? 'nexus-c-table-toolbar__selected-option--is-disabled' : ''}`}>
                    Selected ({selectedRows})
                </div>
            )}
            <PopOutIcon fill="#A5ADBA" />
            {hasDownloadButton && (
                <div className="nexus-c-table-toolbar__button-container">
                    <Button 
                        spacing="compact"
                        isDisabled={true}
                        className="nexus-c-table-toolbar__button"
                    >
                        Download
                    </Button>
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
    selectedRows: PropTypes.number,
};

NexusTableToolbar.defaultProps = {
    title: null,
    totalRows: 0,
    hasSelectedTab: true,
    hasDownloadButton: true,
    selectedRows: 0,
};

export default NexusTableToolbar;
