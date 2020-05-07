import React from 'react';
import {camelCase, startCase} from 'lodash';
import './EmphasizedStringCellRenderer.scss';

const EmphasizedStringCellRenderer = (props) => {
    const getStatusOrReadinessColor= (value) => {
        switch (value) {
            case 'not configured':
            case 'canceled':
                return 'red';
                // return {backgroundColor: '#de350b', textColor: '#fff'};
            case 'completed':
                return 'green';
                // return {backgroundColor: '#36b37e', textColor: '#fff'};
            case 'on hold':
                return 'yellow';
                // return {backgroundColor: '#ffa700', textColor: '#fff'};
            case 'not started':
                return 'grey';
                // return {backgroundColor: '#737e91', textColor: '#fff'};
            case 'in progress':
                return 'teal';
                // return {backgroundColor: '#00b8d9', textColor: '#fff'};
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
