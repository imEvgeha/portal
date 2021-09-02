/* eslint-disable react/boolean-prop-naming */
import React, {useRef, useCallback, useState, useMemo, useContext, createContext, useEffect} from 'react';
import PT from 'prop-types';
import {Container} from './styled';

const DropdownContext = createContext();

export const useDropdownContext = () => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('Dropdown compound components should be rendered inside the Dropdown component');
    }
    return context;
};

const NexusDropdown = ({children, initialSelected, onToggle, onSelect, rememberSelection, ...otherProps}) => {
    const containerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(initialSelected);

    const toggle = useCallback((open = null) => {
        if (typeof open !== 'boolean') {
            setIsOpen(!isOpen);
        } else {
            setIsOpen(open);
        }

        if (onToggle) {
            onToggle();
        }
    });

    const select = useCallback(val => {
        if (rememberSelection) {
            setSelected(val);
        }

        if (onSelect) {
            onSelect(val);
        }
    });

    const handleClickOutside = event => {
        const {current: containerElement} = containerRef;

        if (containerElement && !containerElement.contains(event.target)) {
            toggle(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('touchend', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchend', handleClickOutside);
        };
    }, []);

    const value = useMemo(() => ({isOpen, toggle, selected, select}), [isOpen, toggle, selected, select]);

    return (
        <DropdownContext.Provider value={value} {...otherProps}>
            <Container ref={containerRef}>{children}</Container>
        </DropdownContext.Provider>
    );
};

NexusDropdown.defaultProps = {
    initialSelected: null,
    onToggle: null,
    onSelect: null,
    children: null,
    rememberSelection: false,
};

NexusDropdown.propTypes = {
    rememberSelection: PT.bool,
    onToggle: PT.func,
    onSelect: PT.func,
    initialSelected: PT.string,
    children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]),
};

export {DropdownOption, DropdownOptions, DropdownToggle} from './components';
export default NexusDropdown;
