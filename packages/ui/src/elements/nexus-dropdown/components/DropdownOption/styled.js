import PT from 'prop-types';
import styled, {css} from 'styled-components';

export const Option = styled.li`
    transition: color 0.3s ease, background-color 0.3s ease;
    padding: 12px 16px;
    font-weight: bold;
    color: black;

    &:hover {
        cursor: pointer;
        background-color: lightgray;
        opacity: 0.7;
    }

    ${props =>
        props.isActive &&
        css`
            color: '#FFB106';
        `}
`;

Option.propTypes = {
    isActive: PT.bool,
};
