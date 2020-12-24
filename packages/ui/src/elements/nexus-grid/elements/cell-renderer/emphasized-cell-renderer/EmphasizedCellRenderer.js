import React from 'react';
import PropTypes from 'prop-types';
import './EmphasizedCellRenderer.scss';

const EmphasizedCellRenderer = ({value}) => {
    const getStatusOrReadinessColor = (value = '') => {
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
                nexus-c-emphasized-cell-renderer--is-${getStatusOrReadinessColor(value)}
            `}
        >
            {value || ''}
        </span>
    );
};

EmphasizedCellRenderer.propTypes = {
    value: PropTypes.string,
};

EmphasizedCellRenderer.defaultProps = {
    value: '',
};

export default EmphasizedCellRenderer;
