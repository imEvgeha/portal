import Blanket from '@atlaskit/blanket';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import IconButton from '../../atlaskit/icon-button/IconButton';
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
    const drawerWidths = {
        extended: '95vw',
        full: '100vw',
        medium: '480px',
        narrow: '360px',
        wide: '800px',
        wider: '60vw',
    };

    const drawerClassNames = classnames('nexus-c-drawer', {
        'nexus-c-drawer--from-left': direction === 'fromLeft',
        'nexus-c-drawer--from-right': direction === 'fromRight',
        [`nexus-c-drawer--is-${width}-open`]: isOpen,
    });

    const titleContainerClassNames = classnames('nexus-c-drawer__title-container', {
        'nexus-c-drawer__title-container--from-left': direction === 'fromLeft',
    });

    const headerClassNames = classnames('nexus-c-drawer__header', {
        'nexus-c-drawer__header--from-left': direction === 'fromLeft',
        'nexus-c-drawer__header--from-right': direction === 'fromRight',
        'nexus-c-drawer__header--is-open': isOpen,
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
                            <div className={headerClassNames}>
                                <div className={titleContainerClassNames}>
                                    <h1 className="nexus-c-drawer__title">{title}</h1>
                                    {!!headerContent && (
                                        <>
                                            <div className="nexus-c-drawer__line-break" />
                                            <div>{headerContent}</div>
                                        </>
                                    )}
                                </div>
                                <IconButton
                                    icon={CrossIcon}
                                    label="Close Drawer"
                                    onClick={onClose}
                                />
                            </div>
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
    direction: 'fromLeft',
};

export default NexusDrawer;
