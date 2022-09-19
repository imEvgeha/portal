import React from 'react';
import './PropagateButton.scss';

const PropagateButton = props => {
    return (
        <div {...props} className="nexus-c-propagate-button">
            <span className="nexus-c-propagate-button__wrapper">
                <i className="po po-launch" />
            </span>
        </div>
    );
};

export default PropagateButton;
