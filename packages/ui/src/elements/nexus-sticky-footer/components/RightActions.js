import React from 'react';
import styled from 'styled-components';

const RightActionsContainer = styled.div`
    display: flex;

    & button + div {
        margin-left: 16px;
    }
`;

export const RightActions = ({children}) => {
    return <RightActionsContainer>{children}</RightActionsContainer>;
};

RightActions.propTypes = {};

RightActions.defaultProps = {};
