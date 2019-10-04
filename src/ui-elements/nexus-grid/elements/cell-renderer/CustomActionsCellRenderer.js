import React from 'react';
import PropTypes from 'prop-types';
import './CustomActionsCellRenderer.scss';
import loadingGif from '../../../../img/loading.gif';

const CustomActionsCellRenderer = ({id, children}) => ( // eslint-disable-line
    <div className="nexus-c-custom-actions-cell-renderer">
        {id ? children : (
            <img src={loadingGif} className="nexus-c-custom-actions-cell-renderer__spinner" alt='loadingSpinner' />
        )}
    </div>
);

CustomActionsCellRenderer.propTypes = {
    id: PropTypes.string,
};

CustomActionsCellRenderer.defaultProps = {
    id: null,
};

export default CustomActionsCellRenderer;
