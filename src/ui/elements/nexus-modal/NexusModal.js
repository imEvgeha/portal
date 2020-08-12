import React, {useState, createContext, useCallback} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import './NexusModal.scss';

export const NexusModalContext = createContext({});

export const NexusModalProvider = ({children}) => {
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState('');
    const [actions, setActions] = useState([]);
    const [isOpened, setIsOpened] = useState(false);
    const [style, setStyle] = useState({});

    const setModalContent = content => {
        setIsOpened(true);
        setContent(content);
    };

    const setModalContentAndTitle = useCallback((content, title) => {
        setTitle(title);
        setModalContent(content);
    }, [title, content]);

    const close = useCallback(() => {
        setIsOpened(false);
        setActions([]);
        setContent(null);
        setTitle('');
        setStyle({});
    }, []);

    const context = {
        setModalContent,
        setModalTitle: setTitle,
        setModalContentAndTitle,
        setModalActions: setActions,
        actions,
        title,
        content,
        close,
        open: () => setIsOpened(true),
        setModalStyle: setStyle,
        isOpened,
    };

    return (
        <NexusModalContext.Provider value={context}>
            {isOpened && (
                <ModalTransition>
                    <Modal
                        actions={actions.length && actions}
                        heading={title}
                        onClose={close}
                        width={style.width || 'medium'}
                    >
                        <div className="nexus-c-modal">{content}</div>
                    </Modal>
                </ModalTransition>
            )}
            {children}
        </NexusModalContext.Provider>
    );
};
