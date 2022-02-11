import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButton } from 'primereact/togglebutton';
import {RIGHTS_SELECTED_TAB, RIGHTS_TAB} from '../../../rights-repository/constants';
import './SelectedButton.scss';

const TOOLTIP_BUTTON_UNSELECTED_MSG = 'Click to view selected items';
const TOOLTIP_BUTTON_SELECTED_MSG = 'Click to view all items';

const SelectedButton = ({activeTab, setActiveTab, selectedRightsCount, inNewDesign, setActiveTabIndex}) => {
    const disabled = selectedRightsCount === 0;
    const amountOfSelectedRowsTitle = `${selectedRightsCount ? `(${selectedRightsCount})` : null} Selected`;
    const getTooltipTitle = () => {
        if(!disabled) {
            return activeTab === RIGHTS_SELECTED_TAB ? TOOLTIP_BUTTON_SELECTED_MSG : TOOLTIP_BUTTON_UNSELECTED_MSG
        }
        return null;
    }

    const onClick = () => {
        if(!disabled) {
            if (activeTab !== RIGHTS_SELECTED_TAB) {
                setActiveTab(RIGHTS_SELECTED_TAB);
                setActiveTabIndex(-1);
            } else {
                setActiveTab(RIGHTS_TAB);
                setActiveTabIndex(0);
            }
        }
    };

    return (
        <ToggleButton 
            className={disabled ? 'nexus-c-button__avails-disabled' : 'nexus-c-button__avails-selected'}
            onLabel={amountOfSelectedRowsTitle}
            offLabel={amountOfSelectedRowsTitle}
            checked={activeTab === RIGHTS_SELECTED_TAB} 
            onChange={onClick}
            tooltip={getTooltipTitle()}
            tooltipOptions={{position: 'top'}}
        />
    );
};

SelectedButton.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    selectedRightsCount: PropTypes.number,
    inNewDesign: PropTypes.bool,
    setActiveTabIndex: PropTypes.func,
};

SelectedButton.defaultProps = {
    selectedRightsCount: 0,
    inNewDesign: false,
    setActiveTabIndex: () => null,
};

export default SelectedButton;
