import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButton } from 'primereact/togglebutton';
import {PRE_PLAN_SELECTED_TAB, PRE_PLAN_TAB, RIGHTS_SELECTED_TAB, RIGHTS_TAB} from '../../../rights-repository/constants';
import './SelectedButton.scss';

const TOOLTIP_BUTTON_UNSELECTED_MSG = 'Click to view selected items';
const TOOLTIP_BUTTON_SELECTED_MSG = 'Click to view all items';

const SelectedButton = ({activeTab, setActiveTab, selectedRightsCount, inNewDesign, setActiveTabIndex}) => {
    const disabled = selectedRightsCount === 0;
    const amountOfSelectedRowsTitle = `${selectedRightsCount ? `(${selectedRightsCount})` : ''} Selected`;
    const getTooltipTitle = () => {
        if(!disabled) {
            return activeTab === RIGHTS_SELECTED_TAB ? TOOLTIP_BUTTON_SELECTED_MSG : TOOLTIP_BUTTON_UNSELECTED_MSG
        }
        return null;
    }

    const onClick = () => {
        if(!disabled) {
            if (![RIGHTS_SELECTED_TAB, PRE_PLAN_SELECTED_TAB].includes(activeTab)) {
                setActiveTab(PRE_PLAN_TAB === activeTab ? PRE_PLAN_SELECTED_TAB : RIGHTS_SELECTED_TAB);
                setActiveTabIndex(-1);
            } else {
                const isItPrePlanPage = PRE_PLAN_TAB === activeTab || PRE_PLAN_SELECTED_TAB === activeTab;
                setActiveTab(isItPrePlanPage ? PRE_PLAN_TAB : RIGHTS_TAB);
                setActiveTabIndex(isItPrePlanPage ? 1 : 0);
            }
        }
    };

    return (
        <ToggleButton 
            className={disabled ? 'nexus-c-button__avails-disabled' : 'nexus-c-button__avails-selected'}
            onLabel={amountOfSelectedRowsTitle}
            offLabel={amountOfSelectedRowsTitle}
            checked={activeTab === RIGHTS_SELECTED_TAB || activeTab === PRE_PLAN_SELECTED_TAB} 
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
