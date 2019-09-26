import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './CustomActionsCellRenderer.scss';

const CustomActionsCellRenderer = ({context, data}) => {
    const handleFocusAction = () => {
        const id = data.id;
        context.onFocusButtonClick(id);
    };

    return (
        <div className="nexus-c-custom-actions-cell-renderer">
            <Button onClick={handleFocusAction} className="nexus-c-custom-actions-cell-renderer__button">Focus</Button>
        </div>
    );
};

CustomActionsCellRenderer.propTypes = {
    data: PropTypes.object,
    context: PropTypes.object,
};

CustomActionsCellRenderer.defaultProps = {
    data: {},
    context: {},
};

export default CustomActionsCellRenderer;
