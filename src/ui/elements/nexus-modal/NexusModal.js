import React, {useState, createContext, useCallback} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import './NexusModal.scss';

export const NexusModalContext = createContext({});

export const NexusModalProvider = ({children}) => {
    const [modalStack, setModalstack] = useState([]);

    const openModal = useCallback((content, title, width = 'medium', actions = []) => {
        setModalstack(modalParams => [
            ...modalParams,
            {
                title,
                content,
                actions,
                width,
            },
        ]);
    }, []);

    const closeModal = useCallback(() => {
        setModalstack(modalParams => {
            const stackContent = modalParams.slice();
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
                    shouldCloseOnOverlayClick = false,
                } = modalItem;
                return (
                    <ModalTransition key={title}>
                        <Modal
                            actions={actions.length && actions}
                            heading={title}
                            onClose={closeModal}
                            width={width}
                            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
                            stackIndex={index}
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
