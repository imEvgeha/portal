import React from 'react';
import PropTypes from 'prop-types';
import {ToggleButton} from 'primereact/togglebutton';
import './SelectedButton.scss';

const TOOLTIP_BUTTON_UNSELECTED_MSG = 'Click to view selected items';
const TOOLTIP_BUTTON_SELECTED_MSG = 'Click to view all items';

const SelectedButton = ({selectedRightsCount, isSelected, setIsSelected, showTooltip}) => {
    const disabled = selectedRightsCount === 0 && !isSelected;

    const amountOfSelectedRowsTitle = `${selectedRightsCount ? `(${selectedRightsCount})` : ''} Selected`;
    const getTooltipTitle = () => {
        if (!disabled) {
            return isSelected ? TOOLTIP_BUTTON_SELECTED_MSG : TOOLTIP_BUTTON_UNSELECTED_MSG;
        }
        return null;
    };

    const onClick = () => {
        if (!disabled) {
            setIsSelected(!isSelected);
        }
    };

    return (
        <ToggleButton
            className={disabled ? 'nexus-c-button__avails-disabled' : 'nexus-c-button__avails-selected'}
            onLabel={amountOfSelectedRowsTitle}
            offLabel={amountOfSelectedRowsTitle}
            checked={isSelected}
            onChange={onClick}
            tooltip={showTooltip ? getTooltipTitle() : ''}
            tooltipOptions={{position: 'top'}}
        />
    );
};

SelectedButton.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    setIsSelected: PropTypes.func.isRequired,
    selectedRightsCount: PropTypes.number,
    showTooltip: PropTypes.bool,
};

SelectedButton.defaultProps = {
    selectedRightsCount: 0,
    showTooltip: true,
};

export default SelectedButton;
