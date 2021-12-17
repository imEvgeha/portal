import React from 'react';
import PropTypes from 'prop-types';
import MenuExpandIcon from '@atlaskit/icon/glyph/menu-expand';
import './DragButton.scss';

const DragButton = props => {
    const {avails} = props;

    return (
        <div {...props} className={`nexus-c-drag-button ${avails === 'true' ? 'hide' : ''}`}>
            <MenuExpandIcon size="medium" label="" />
        </div>
    );
};

DragButton.propTypes = {
    avails: PropTypes.string,
};

DragButton.defaultProps = {
    avails: '',
};

export default DragButton;
