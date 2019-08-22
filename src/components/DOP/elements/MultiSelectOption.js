import React from 'react';
import {components} from 'react-select';

const MultiSelectOption = props => {
    let className = '';
    if (props.value === 'all') {
        // TODO - use this class to add style for 3 different status for 'SELECT ALL'
        className = 'nexus-select-plan-territory-editor__all-select'; 
    }

    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    className={className}
                    checked={props.isSelected || props.isDisabled}
                    disabled={props.isDisabled}
                    onChange={() => null}
                />
                {' '}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};

export default MultiSelectOption;
