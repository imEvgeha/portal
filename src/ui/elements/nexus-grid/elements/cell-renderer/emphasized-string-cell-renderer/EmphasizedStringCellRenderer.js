import React from 'react';
import {camelCase, startCase} from 'lodash';
import './EmphasizedStringCellRenderer.scss';

const EmphasizedStringCellRenderer = (props) => {
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
                nexus-c-emphasized-string-cell-renderer 
                nexus-c-emphasized-string-cell-renderer--is-${getStatusOrReadinessColor(props.value)}
            `}
        >
            {startCase(camelCase(props.value || ''))}
        </span>
    );
};

export default EmphasizedStringCellRenderer;
