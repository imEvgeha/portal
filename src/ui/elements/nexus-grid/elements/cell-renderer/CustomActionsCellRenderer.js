import React from 'react';
import PropTypes from 'prop-types';
import './CustomActionsCellRenderer.scss';
import loadingGif from '../../../../../assets/img/loading.gif';

// eslint-disable-next-line
const CustomActionsCellRenderer = ({id, children, classname}) => (
    <div className={`nexus-c-custom-actions-cell-renderer ${classname}`}>
        {id ? (
            children
        ) : (
            <img src={loadingGif} className="nexus-c-custom-actions-cell-renderer__spinner" alt="loadingSpinner" />
        )}
    </div>
);

CustomActionsCellRenderer.propTypes = {
    id: PropTypes.string,
    classname: PropTypes.string,
};

CustomActionsCellRenderer.defaultProps = {
    id: null,
    classname: '',
};

export default CustomActionsCellRenderer;
