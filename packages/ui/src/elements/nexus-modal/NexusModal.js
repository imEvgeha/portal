import React, {useState, createContext, useCallback} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import './NexusModal.scss';
import {useDispatch} from 'react-redux';
import {storeIsEditorial} from '../../../../../src/pages/title-metadata/titleMetadataActions';

export const NexusModalContext = createContext({});

export const NexusModalProvider = ({children}) => {
    const [modalStack, setModalstack] = useState([]);
    const STACK_INDEX = 6;

    const dispatch = useDispatch();

    const openModal = useCallback((content, params) => {
        const {title, width = 'medium', actions = [], shouldCloseOnOverlayClick = true} = params || {};
        setModalstack(modalStack => [
            ...modalStack,
            {
                title,
                content,
                actions,
                width,
                shouldCloseOnOverlayClick,
            },
        ]);
    }, []);

    const closeModal = useCallback(() => {
        dispatch(storeIsEditorial(false));
        setModalstack(modalStack => {
            const stackContent = modalStack.slice();
            stackContent.pop();
            return [...stackContent];
        });
    }, []);

    const context = {
        closeModal,
        openModal,
    };

    return (
        <NexusModalContext.Provider value={context}>
            {modalStack.map((modalItem, index) => {
                const {
                    title = '',
                    content = null,
                    actions = [],
                    width = '',
                    shouldCloseOnOverlayClick = true,
                } = modalItem;
                return (
                    <ModalTransition key={title}>
                        <Modal
                            actions={actions.length && actions}
                            heading={title}
                            onClose={closeModal}
                            width={width}
                            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
                            stackIndex={index !== 0 ? STACK_INDEX : 0}
                        >
                            <div className="nexus-c-modal">{content}</div>
                        </Modal>
                    </ModalTransition>
                );
            })}
            {children}
        </NexusModalContext.Provider>
    );
};
