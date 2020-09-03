import React, {useState, createContext, useCallback} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import './NexusModal.scss';

export const NexusModalContext = createContext({});

export const NexusModalProvider = ({children}) => {
    const [modalParams, setModalParams] = useState({});


    const openModal = useCallback((content, title, width = 'medium', actions = []) => {
        setModalParams({
            title,
            content,
            actions,
            width,
            isOpened: true
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalParams({
            title: '',
            content: null,
            actions: [],
            width: '',
            isOpened: false
        });
    }, []);

    const context = {
        closeModal,
        openModal
    };

    const { title = '', content = null, actions = [], width = '', isOpened = false } = modalParams;
    return (
        <NexusModalContext.Provider value={context}>
            {isOpened && (
                <ModalTransition>
                    <Modal
                        actions={actions.length && actions}
                        heading={title}
                        onClose={closeModal}
                        width={width}
                    >
                        <div className="nexus-c-modal">{content}</div>
                    </Modal>
                </ModalTransition>
            )}
            {children}
        </NexusModalContext.Provider>
    );
};
