import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './NexusTitle.scss';

const NexusTitle = ({title, isSubTitle, isInline, className, children}) => {
    return (
        <div className={`nexus-c-title ${className}`}>
            <p
                className={classnames(
                    `nexus-c-title${isSubTitle ? '__sub-label' : '__label'}`,
                    isInline && 'nexus-c-title__inline-label'
                )}
            >
                {children}
            </p>
            {title && <div className="nexus-c-title__name">{title}</div>}
        </div>
    );
};

NexusTitle.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    isSubTitle: PropTypes.bool,
    isInline: PropTypes.bool,
};

NexusTitle.defaultProps = {
    title: null,
    className: '',
    isSubTitle: false,
    isInline: false,
};

export default NexusTitle;
