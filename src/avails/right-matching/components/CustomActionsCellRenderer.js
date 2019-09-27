import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './CustomActionsCellRenderer.scss';
import loadingGif from '../../../img/loading.gif';

const CustomActionsCellRenderer = ({context, data}) => {
    const id = data.id;
    const handleFocusAction = () => {
        context.onFocusButtonClick(id);
    };

    return (
        <div className="nexus-c-custom-actions-cell-renderer">
            {id ? (
                <Button onClick={handleFocusAction} className="nexus-c-custom-actions-cell-renderer__button">Focus</Button>
            ) : (
                <img src={loadingGif} className="nexus-c-custom-actions-cell-renderer__spinner" alt='loadingSpinner' />
            )}
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
