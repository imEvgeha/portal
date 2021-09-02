import React from 'react';
import PT from 'prop-types';
import {useDropdownContext} from '../../NexusDropdown';
import {Option} from './styled';

const DropdownOption = ({onSelect, value, children, ...otherProps}) => {
    const {selected, select, toggle} = useDropdownContext();

    const handleClick = () => {
        select(value);
        toggle(false);

        if (onSelect) {
            onSelect(value);
        }
    };

    return (
        <Option isActive={selected === value} onClick={handleClick} {...otherProps}>
            {children}
        </Option>
    );
};

DropdownOption.defaultProps = {
    onSelect: null,
    children: null,
};

DropdownOption.propTypes = {
    onSelect: PT.func,
    value: PT.string.isRequired,
    children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]),
};

export default DropdownOption;
