import Blanket from '@atlaskit/blanket';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import {colors, gridSize, layers} from '@atlaskit/theme';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import IconButton from '../../atlaskit/icon-button/IconButton';

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
    const drawerWidths = {
        extended: '95vw',
        full: '100vw',
        medium: '480px',
        narrow: '360px',
        wide: '800px',
        wider: '60vw',
    };

    return (
        <>
            {isOpen && (
                <Blanket
                    onBlanketClicked={isClosedOnBlur ? onClose : null}
                    canClickThrough={false}
                    isTinted
                />
            )}
            <Drawer width={drawerWidths[width]} direction={direction} isOpen={isOpen}>
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
                                <IconButton
                                    icon={CrossIcon}
                                    label="Close Drawer"
                                    onClick={onClose}
                                />
                            </Header>
                        </GridColumn>
                    </Grid>
                    {isOpen && children}
                </Page>
            </Drawer>
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

// Styled Components
const Drawer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${props => props.direction === 'fromLeft' && '0'};
    right: ${props => props.direction === 'fromRight' && '0'};
    background-color: ${colors.N0};
    z-index: ${layers.blanket()};
    transition: width 220ms cubic-bezier(0.2, 0, 0, 1) 0s;
    width: ${props => (props.isOpen ? props.width : 0)};
    overflow: auto;
`;

const Title = styled.h1`
    margin-left: 0 !important;
`;

const TitleContainer = styled.div`
    margin-left: ${props => (props.direction === 'fromLeft' ? gridSize() * 2 + 'px' : 0)};
`;

const Header = styled.div`
    margin-top: ${gridSize() * 2}px;
    margin-bottom: ${gridSize() * 2}px;
    justify-content: ${props => (props.direction === 'fromRight' ? 'space-between' : 'flex-end')};
    align-items: flex-start;
    flex-direction: ${props => props.direction === 'fromLeft' && 'row-reverse'};
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-wrap: ${props => props.isOpen && 'wrap'};
`;
