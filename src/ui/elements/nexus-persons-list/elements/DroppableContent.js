import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './DroppableContent.scss';

const DroppableContent = ({isDragging, children}) => {
    return (
        <div
            className={classnames('nexus-c-droppable-content', {
                'nexus-c-droppable-content--dragging': isDragging,
            })}
        >
            {children}
        </div>
    );
};

DroppableContent.propTypes = {
    isDragging: PropTypes.bool,
};

DroppableContent.defaultProps = {
    isDragging: false,
};

export default DroppableContent;
