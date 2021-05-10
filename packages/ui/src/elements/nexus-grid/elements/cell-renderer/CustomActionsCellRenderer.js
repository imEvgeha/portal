import React from 'react';
import PropTypes from 'prop-types';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import './CustomActionsCellRenderer.scss';

// eslint-disable-next-line
const CustomActionsCellRenderer = ({id, children, classname}) => {
    return (
        <div className={`nexus-c-custom-actions-cell-renderer ${classname}`}>
        {id ? (
            children
        ) : (
            null
        )}
    </div>
    )

};

CustomActionsCellRenderer.propTypes = {
    id: PropTypes.string,
    classname: PropTypes.string,
};

CustomActionsCellRenderer.defaultProps = {
    id: null,
    classname: '',
};

export default CustomActionsCellRenderer;
