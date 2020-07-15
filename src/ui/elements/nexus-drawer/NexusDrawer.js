import classnames from 'classnames';
import React, {useEffect, useState} from 'react';
import Button from '@atlaskit/button';
import styled from 'styled-components';
import {gridSize} from '@atlaskit/theme';
import PropTypes from 'prop-types';
import Blanket from '@atlaskit/blanket';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import IconButton from '../../atlaskit/icon-button/IconButton';
// import CloseIcon from '../../../assets/action-cross.svg';
import './NexusDrawer.scss';

const NexusDrawer = ({
    children,
    width,
    isOpen,
    onClose,
    title,
    headerContent,
    isClosedOnBlur,
    direction,
}) => {
    const drawerClassNames = classnames('nexus-c-drawer', `nexus-c-drawer--is-${width}-width`, {
        'nexus-c-drawer--is-open': isOpen,
        'nexus-c-drawer--from-left': direction === 'fromLeft',
        'nexus-c-drawer--from-right': direction === 'fromRight',
    });

    return (
        <>
            {isOpen && (
                <Blanket
                    onBlanketClicked={isClosedOnBlur ? onClose : null}
                    canClickThrough={false}
                    isTinted
                />
            )}
            <div className={drawerClassNames}>
                <Page>
                    <Grid layout="fluid">
                        <GridColumn>
                            <Header isOpen={isOpen} direction={direction}>
                                <TitleContainer direction={direction}>
                                    <Title>{title}</Title>
                                    {!!headerContent && (
                                        <>
                                            <div className="nexus-c-drawer__line-break" />
                                            <div>{headerContent}</div>
                                        </>
                                    )}
                                </TitleContainer>
                                <IconButton icon={<CrossIcon />} onClick={onClose} />
                            </Header>
                        </GridColumn>
                    </Grid>
                    {isOpen && children}
                </Page>
            </div>
        </>
    );
};

NexusDrawer.propTypes = {
    title: PropTypes.string,
    width: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    headerContent: PropTypes.element,
    isClosedOnBlur: PropTypes.bool,
    direction: PropTypes.oneOf(['fromLeft', 'fromRight']),
};

NexusDrawer.defaultProps = {
    title: '',
    width: 'medium',
    headerContent: null,
    isClosedOnBlur: true,
    direction: 'fromRight',
};

export default NexusDrawer;

const Title = styled.h1`
    margin-left: 0 !important;
`;

const TitleContainer = styled.div`
    margin-left: ${props => (props.direction === 'fromLeft' ? gridSize() * 2 + 'px' : 0)};
`;

const Header = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    justify-content: ${props => (props.direction === 'fromRight' ? 'space-between' : 'flex-end')};
    align-items: flex-start;
    flex-direction: ${props => props.direction === 'fromLeft' && 'row-reverse'};
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-wrap: ${props => props.isOpen && 'wrap'};
`;
