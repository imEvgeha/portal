import PT from 'prop-types';
import styled, {css} from 'styled-components';

export const Options = styled.ul`
    position: absolute;
    transition: opacity 0.3s ease;
    opacity: 0;
    width: 160px;
    border-radius: 9px;
    background-color: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    list-style: none;
    padding: 0;
    margin: 8px 0;
    right: 0;
    top: 10px;

    ${props =>
        props.isOpen &&
        css`
            pointer-events: all;
            opacity: 1;
        `}

    ${props =>
        props.align === 'left' &&
        css`
            left: 0;
            right: auto;
        `}

    ${props =>
        props.align === 'top' &&
        css`
            bottom: 2.2vh;
            top: auto;
            left: 0;
        `}
`;

Options.propTypes = {
    isOpen: PT.bool,
    align: PT.oneOf(['right', 'left', 'top']),
};
