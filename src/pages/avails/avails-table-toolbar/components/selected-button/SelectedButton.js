import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { ToggleButton } from 'primereact/togglebutton';
import {RIGHTS_SELECTED_TAB, RIGHTS_TAB} from '../../../rights-repository/constants';
import './SelectedButton.scss';

const TOOLTIP_BUTTON_UNSELECTED_MSG = 'Click to view selected items';
const TOOLTIP_BUTTON_SELECTED_MSG = 'Click to view all items';

const SelectedButton = ({activeTab, setActiveTab, selectedRightsCount, inNewDesign, setActiveTabIndex}) => {
    const onClick = () => {
        if (activeTab !== RIGHTS_SELECTED_TAB) {
            setActiveTab(RIGHTS_SELECTED_TAB);
            setActiveTabIndex(-1);
        } else {
            setActiveTab(RIGHTS_TAB);
            setActiveTabIndex(0);
        }
    };

    return (
        <Tooltip
            content={activeTab === RIGHTS_SELECTED_TAB ? TOOLTIP_BUTTON_SELECTED_MSG : TOOLTIP_BUTTON_UNSELECTED_MSG}
            position="top"
        >
            {inNewDesign ?
                <ToggleButton 
                    className='nexus-c-button__avails-selected'
                    onLabel={`(${selectedRightsCount}) Selected`}
                    offLabel={`(${selectedRightsCount}) Selected`}
                    checked={activeTab === RIGHTS_SELECTED_TAB} 
                    onChange={onClick}
                    onIcon=""
                    offIcon=""
                />
                : 
                <Button
                    className="nexus-c-button"
                    isSelected={activeTab === RIGHTS_SELECTED_TAB}
                    onClick={onClick}
                    isDisabled={selectedRightsCount === 0}
                >
                    ({selectedRightsCount}) Selected
                </Button>
            }
        </Tooltip>
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
