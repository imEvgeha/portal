import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Blanket from '@atlaskit/blanket';
import Button from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';

import './NexusDrawer.scss';

const NexusDrawer = ({
    children,
    position,
    width,
    isOpen,
    onClose,
}) => {
    const [isOpenClass, setIsOpenClass] = useState('');

    useEffect(
        () => setIsOpenClass(isOpen ? 'nexus-c-drawer--is-open' : ''),
        [isOpen]
    );

    return (
        <>
            {isOpen && (
                <Blanket
                    onBlanketClicked={onClose}
                    canClickThrough={false}
                    isTinted
                />
            )}
            <div
                className={
                    `nexus-c-drawer 
                    nexus-c-drawer--is-${position} 
                    nexus-c-drawer--is-${width}-width
                    ${isOpenClass}`
                }
            >
                <Button
                    appearance="subtle"
                    onClick={onClose}
                    className={
                        `nexus-c-drawer__close-btn 
                        nexus-c-drawer__close-btn--is-${position}`
                    }
                >
                    {
                        position === 'right'
                            ? <ArrowRightIcon />
                            : <ArrowLeftIcon />
                    }
                </Button>
                {isOpen && children}
            </div>
        </>
    );
};

NexusDrawer.propTypes = {
    position: PropTypes.string,
    width: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

NexusDrawer.defaultProps = {
    position: 'right',
    width: 'medium',
};

export default NexusDrawer;
