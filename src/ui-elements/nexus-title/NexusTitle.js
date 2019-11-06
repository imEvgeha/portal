import React from 'react';
import PropTypes from 'prop-types';
import './NexusTitle.scss';

const NexusTitle = ({title, isSubTitle, isInline, className, children}) => { // eslint-disable-line
    return (
        <div className={`nexus-c-title ${className}`}>
            <p className={`nexus-c-title__${isSubTitle ? 'sub-label' : 'label'} nexus-c-title__${isInline ? 'inline-label' : ''}`}>{children}</p>
            {title && (
                <div className="nexus-c-title__name">{title}</div> 
            )}
        </div> 
    );
};

NexusTitle.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    isSubTitle: PropTypes.bool,
    isInline: PropTypes.bool
};

NexusTitle.defaultProps = {
    title: null,
    className: '',
    isSubTitle: false,
    isInline: false
};

export default NexusTitle;
