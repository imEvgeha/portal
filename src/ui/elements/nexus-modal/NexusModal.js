import React, {useState, createContext, useCallback} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import './NexusModal.scss';

export const NexusModalContext = createContext({});

export const NexusModalProvider = ({children}) => {
    const [modalParams, setModalParams] = useState({});


    const open = useCallback((content, title, width = 'medium', actions = []) => {
        setModalParams({
            title,
            content,
            actions,
            width,
            isOpened: true
        });
    }, []);

    const close = useCallback(() => {
        setModalParams({
            title: '',
            content: null,
            actions: [],
            width: '',
            isOpened: false
        });
    }, []);

    const context = {
        close,
        open
    };

    const { title = '', content = null, actions = [], width = '', isOpened = false } = modalParams;
    return (
        <NexusModalContext.Provider value={context}>
            {isOpened && (
                <ModalTransition>
                    <Modal
                        actions={actions.length && actions}
                        heading={title}
                        onClose={close}
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
