import React from 'react';
import PropTypes from 'prop-types';
import Blanket from '@atlaskit/blanket';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import Spinner from '@atlaskit/spinner';
import {Button} from '@portal/portal-components';
import classnames from 'classnames';
import './NexusDrawer.scss';

const NexusDrawer = ({
    children,
    width,
    isOpen,
    isLoading = true,
    onClose,
    title,
    headerContent,
    isClosedOnBlur,
    direction,
}) => {
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
            {isOpen && <Blanket onBlanketClicked={isClosedOnBlur ? onClose : null} canClickThrough={false} isTinted />}
            <div className={drawerClassNames}>
                <Page>
                    {isLoading ? (
                        <div className="nexus-c-drawer--is-loading">
                            <Spinner size="large" />
                        </div>
                    ) : (
                        <>
                            <Grid layout="fluid">
                                <GridColumn>
                                    <div className={headerClassNames}>
                                        <div className={titleContainerClassNames}>
                                            <h1 className="nexus-c-drawer__title">{title}</h1>
                                            {!!headerContent && (
                                                <>
                                                    <div className="nexus-c-drawer__line-break" />
                                                    <div className="nexus-c-drawer__title-content">{headerContent}</div>
                                                </>
                                            )}
                                        </div>
                                        <Button
                                            className="p-button-text"
                                            icon="po po-remove"
                                            tooltip="Close Drawer"
                                            onClick={onClose}
                                        />
                                    </div>
                                </GridColumn>
                            </Grid>
                            {isOpen && children}
                        </>
                    )}
                </Page>
            </div>
        </>
    );
};

NexusDrawer.propTypes = {
    title: PropTypes.string,
    width: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
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
    isLoading: false,
    direction: 'fromRight',
};

export default NexusDrawer;
