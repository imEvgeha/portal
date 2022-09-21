import styled from 'styled-components';
import {media} from '../../../../styled/utils';

export const Label = styled.span`
    display: none;
    color: black;

    ${media.desktop`
        display: inline;
    `}
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-space-between;
    align-items: center;
`;
