import React from 'react';
import PropTypes from 'prop-types';
import MenuExpandIcon from '@atlaskit/icon/glyph/menu-expand';
import './DragButton.scss';

const DragButton = props => {
    const {editable} = props;

    return (
        <div {...props} className={`nexus-c-drag-button ${editable === 'false' ? 'hide' : ''}`}>
            <MenuExpandIcon size="medium" label="" />
        </div>
    );
};

DragButton.propTypes = {
    editable: PropTypes.string,
};

DragButton.defaultProps = {
    editable: '',
};

export default DragButton;
