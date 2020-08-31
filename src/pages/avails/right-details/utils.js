import React from 'react';

export const parseField = (field = {}) => {
    const {label = '', type = ''} = field || {};

    switch(type) {
        case 'text': {
            return <div>{label}</div>
        }
        default:
            return <div>Unsupported field type</div>
    }
};
