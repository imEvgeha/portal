import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import {RIGHTS_SELECTED_TAB, RIGHTS_TAB} from '../../rights-repository/constants';

const TOOLTIP_BUTTON_UNSELECTED_MSG = 'Click to view selected items';
const TOOLTIP_BUTTON_SELECTED_MSG = 'Click to view all items';

const SelectedButton = ({activeTab, setActiveTab, selectedRightsCount}) => {
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
            position="top"
        >
            <Button
                className="nexus-c-button"
                isSelected={activeTab === RIGHTS_SELECTED_TAB}
                onClick={onClick}
                isDisabled={selectedRightsCount === 0}
            >
                Selected ({selectedRightsCount})
            </Button>
        </Tooltip>
    );
};

SelectedButton.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    selectedRightsCount: PropTypes.number,
};

SelectedButton.defaultProps = {
    selectedRightsCount: 0,
};

export default SelectedButton;
