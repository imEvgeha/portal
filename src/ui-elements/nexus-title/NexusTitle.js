import React from 'react';
import PropTypes from 'prop-types';
import './NexusTitle.scss';

const NexusTitle = ({title, className, children}) => { // eslint-disable-line
    return (
        <div className={`nexus-c-title ${className}`}>
            {children}
            {title && (
                <div className="nexus-c-title__name">{title}</div> 
            )}
        </div> 
    );
};

NexusTitle.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
};

NexusTitle.defaultProps = {
    title: null,
    className: '',
};

export default NexusTitle;
