import React from 'react';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import {RIGHTS_SELECTED_TAB, RIGHTS_TAB} from '../../../avails/rights-repository/RightsRepository';

const TOOLTIP_BUTTON_UNSELECTED_MSG = 'Click to view selected items';
const TOOLTIP_BUTTON_SELECTED_MSG = 'Click to view all items';

function SelectedButton({activeTab, setActiveTab, selectedRightsCount}) {

    const onClick = () => {
        if (activeTab !== RIGHTS_SELECTED_TAB) {
            setActiveTab(RIGHTS_SELECTED_TAB);
        } else {
            setActiveTab(RIGHTS_TAB);
        }
    };

    return (
        <Tooltip
            content={activeTab === RIGHTS_SELECTED_TAB ? TOOLTIP_BUTTON_SELECTED_MSG : TOOLTIP_BUTTON_UNSELECTED_MSG}
            position='top'>
            <Button isSelected={activeTab === RIGHTS_SELECTED_TAB} onClick={onClick}
                    isDisabled={selectedRightsCount === 0}>
                Selected ({selectedRightsCount})
            </Button>
        </Tooltip>
    );
}

export default SelectedButton;