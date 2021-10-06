import React from 'react';
import styled from 'styled-components';

const LeftActionsContainer = styled.div`
    display: flex;
    width: 33.33%;
    align-items: flex-start;

    & > * {
        margin-right: 48px;
    }
`;

export const LeftActions = ({children}) => {
    return <LeftActionsContainer>{children}</LeftActionsContainer>;
};

LeftActions.propTypes = {};

LeftActions.defaultProps = {};
