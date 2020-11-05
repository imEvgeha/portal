import React from 'react';
import MenuExpandIcon from '@atlaskit/icon/glyph/menu-expand';
import './DragButton.scss';

const DragButton = props => {
    return (
        <div {...props} className="nexus-c-drag-button">
            <MenuExpandIcon size="medium" label="" />
        </div>
    );
};

export default DragButton;
