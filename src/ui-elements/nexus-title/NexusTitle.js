import React from 'react';
import PropTypes from 'prop-types';
import './NexusTitle.scss';

const NexusTitle = ({title, children}) => { // eslint-disable-line
    return (
        <div className="nexus-c-title">
            {children}
            {title && (
                <div className="nexus-c-title__name">{title}</div> 
            )}
        </div> 
    );
};

NexusTitle.propTypes = {
    title: PropTypes.string,
};

NexusTitle.defaultProps = {
    title: null,
};

export default NexusTitle;
