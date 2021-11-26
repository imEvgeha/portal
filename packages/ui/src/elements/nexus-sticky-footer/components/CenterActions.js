import React from 'react';
import styled from 'styled-components';

const CenterActionsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CenterActions = ({children}) => {
    return <CenterActionsContainer>{children}</CenterActionsContainer>;
};

CenterActions.propTypes = {};

CenterActions.defaultProps = {};
