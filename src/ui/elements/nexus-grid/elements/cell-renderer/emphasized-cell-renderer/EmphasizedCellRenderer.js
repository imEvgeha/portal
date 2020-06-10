import React from 'react';
import './EmphasizedCellRenderer.scss';

const EmphasizedCellRenderer = (props) => {
    const getStatusOrReadinessColor= (value = '') => {
        switch (value.toLowerCase()) {
            case 'not configured':
            case 'canceled':
                return 'red';
            case 'completed':
                return 'green';
            case 'on hold':
                return 'yellow';
            case 'not started':
                return 'grey';
            case 'in progress':
                return 'teal';
            default:
                return 'default';
        }
    };


    return (
        <span
            className={`
                nexus-c-emphasized-cell-renderer 
                nexus-c-emphasized-cell-renderer--is-${getStatusOrReadinessColor(props.value)}
            `}
        >
            {props.value || ''}
        </span>
    );
};

export default EmphasizedCellRenderer;
