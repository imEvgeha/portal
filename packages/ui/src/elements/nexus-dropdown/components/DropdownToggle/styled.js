import PT from 'prop-types';
import PointDown from '@vubiquity-nexus/portal-assets/angle.svg';
import Dots from '@vubiquity-nexus/portal-assets/dots.svg';
import styled, {css} from 'styled-components';
import {media} from "../../../../styled/utils";

export const DotsIcon = styled(Dots)`
    display: block;
    width: 16px;
`;

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

export const PointDownIcon = styled(PointDown)`
    display: none;
    color: black;

    ${media.desktop`
    display: block;
    transition: transform 0.3s;
    transform: rotate(0deg);
    width: 18px;
    margin-left: 16px;

    ${props =>
        props.open &&
        css`
            transform: rotate(-180deg);
        `}
  `}
`;

PointDownIcon.propTypes = {
    open: PT.oneOf([0, 1]),
};
