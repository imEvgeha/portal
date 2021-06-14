import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './DraggableContent.scss';

const DraggableContent = ({isDragging, children}) => {
    return (
        <div
            className={classnames('nexus-c-draggable-content', {
                'nexus-c-draggable-content--dragging': isDragging,
            })}
        >
            {children}
        </div>
    );
};

DraggableContent.propTypes = {
    isDragging: PropTypes.bool.isRequired,
};

export default DraggableContent;
