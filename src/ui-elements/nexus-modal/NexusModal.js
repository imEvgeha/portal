import React, {useState, createContext} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';

export const NexusModalContext = createContext({});

export const NexusModalConsumer = NexusModalContext.Consumer;

// eslint-disable-next-line react/prop-types
export const NexusModalProvider = ({children}) => {
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState('');
    const [actions, setActions] = useState([]);
    const [isOpened, setIsOpened] = useState(false);

    const setModalContent = (content) => {
        setIsOpened(true);
        setContent(content);
    };

    const setModalContentAndTitle = (content, title) => {
        setTitle(title);
        setModalContent(content);
    };

    const close = () => {
        setIsOpened(false);
    };

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
    };

    return (
        <NexusModalContext.Provider value={context}>
            {isOpened &&
                <ModalTransition>
                    <Modal
                        actions={actions.length && actions}
                        heading={title}
                        onClose={close}
                    >
                        {/* TODO: Change after we decide between styled or sass */}
                        <div style={{paddingBottom: '20px'}}>
                            {content}
                        </div>
                    </Modal>
                </ModalTransition>
            }
            {children}
        </NexusModalContext.Provider>
    );
};