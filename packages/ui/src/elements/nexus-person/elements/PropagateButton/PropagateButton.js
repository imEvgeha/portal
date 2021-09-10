import React from 'react';
import PropagateIcon from '@vubiquity-nexus/portal-assets/action-propagate.svg';
import './PropagateButton.scss';

const PropagateButton = props => {
    return (
        <div {...props} className="nexus-c-propagate-button">
            <span className="nexus-c-propagate-button__wrapper">
                <PropagateIcon />
            </span>
        </div>
    );
};

export default PropagateButton;
