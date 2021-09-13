import React from 'react';
import styled from 'styled-components';

const LeftActionsContainer = styled.div`
    display: flex;
    padding-right: 16px;
    align-items: flex-start;

    > * {
        margin-right: 60px;
    }
`;

export const LeftActions = ({children}) => {
    return <LeftActionsContainer>{children}</LeftActionsContainer>;
};

LeftActions.propTypes = {};

LeftActions.defaultProps = {};
