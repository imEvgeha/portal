import React from 'react';
import PT from 'prop-types';
import {useDropdownContext} from '../../NexusDropdown';
import {Options} from './styled';

const DropdownOptions = ({align, ...otherProps}) => {
    const {isOpen} = useDropdownContext();

    return <Options isOpen={isOpen} align={align} {...otherProps} />;
};

DropdownOptions.defaultProps = {
    align: 'right',
};

DropdownOptions.propTypes = {
    align: PT.oneOf(['right', 'left']),
};

export default DropdownOptions;
