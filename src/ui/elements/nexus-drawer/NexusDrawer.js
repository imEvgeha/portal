import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Blanket from '@atlaskit/blanket';
import CloseIcon from '../../../assets/action-cross.svg';
import './NexusDrawer.scss';

const NexusDrawer = ({
    children,
    width,
    isOpen,
    onClose,
    title,
    headerContent
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
                    nexus-c-drawer--is-${width}-width
                    ${isOpenClass}`
                }
            >
                <div className='nexus-c-drawer__header'>
                    <div className='nexus-c-drawer__header--title'>{title}</div>
                    <CloseIcon className='nexus-c-drawer__header--close-btn' onClick={onClose} />
                    {headerContent &&
                    (
                        <>
                            <div className='break' />
                            <div className='nexus-c-drawer__header__bottom'>
                                {headerContent}
                            </div>
                        </>
                    )}
                </div>
                {isOpen && children}
            </div>
        </>
    );
};

NexusDrawer.propTypes = {
    title: PropTypes.string,
    width: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    headerContent: PropTypes.element
};

NexusDrawer.defaultProps = {
    title: '',
    width: 'medium',
    headerContent: null
};

export default NexusDrawer;
