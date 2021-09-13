import React from 'react';
import styled from 'styled-components';
import {LeftActions, RightActions} from './components';

const NexusStickyFooterContainer = styled.div`
    background-color: ${({theme}) => theme.colors.grays.light}
    width: 100%;
    height: 52px;
    z-index: 1;
    position: sticky;
    bottom: 0;
    border-top: 1px solid ${({theme}) => theme.colors.grays.dark};
`;

const NexusStickyFooterContent = styled.div`
    display: flex;
    width: 80%;
    flex: 1;
    padding: 10px 0;
    margin: 0 auto;
`;

const NexusStickyFooter = ({children}) => {
    return (
        <NexusStickyFooterContainer>
            <NexusStickyFooterContent>{children}</NexusStickyFooterContent>
        </NexusStickyFooterContainer>
    );
};

NexusStickyFooter.propTypes = {};

NexusStickyFooter.defaultProps = {};

NexusStickyFooter.LeftActions = LeftActions;
NexusStickyFooter.RightActions = RightActions;

export default NexusStickyFooter;
