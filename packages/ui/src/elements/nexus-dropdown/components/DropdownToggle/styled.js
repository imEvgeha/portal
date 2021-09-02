import PT from 'prop-types';
import Button from '@atlaskit/button';
import PointDown from '@vubiquity-nexus/portal-assets/angle.svg';
import Dots from '@vubiquity-nexus/portal-assets/dots.svg';
import {media} from '@vubiquity-nexus/portal-utils/lib/utils';
import styled, {css} from 'styled-components';

export const DotsIcon = styled(Dots)`
    display: block;
    width: 16px;

    ${({isMobile}) =>
        !isMobile &&
        css`
            ${media.desktop`
      dispaly: none;
      width: 0px;
    `}
        `}
`;

export const Label = styled.span`
    display: none;

    ${({isMobile}) =>
        !isMobile &&
        css`
            ${media.desktop`
                 display: inline;
            `}
        `}
`;

export const ExtendedButton = styled(Button)`
    padding: 15px 21px;
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-space-between;
    align-items: center;
`;

export const PointDownIcon = styled(PointDown)`
    display: none;

    ${({isMobile}) =>
        !isMobile &&
        css`
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
        `}
`;

PointDownIcon.propTypes = {
    open: PT.oneOf([0, 1]),
};
