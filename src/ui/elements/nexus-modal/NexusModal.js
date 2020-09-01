import React, {useState, createContext, useCallback} from 'react';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import './NexusModal.scss';

export const NexusModalContext = createContext({});

export const NexusModalProvider = ({children}) => {
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState('');
    const [actions, setActions] = useState([]);
    const [isOpened, setIsOpened] = useState(false);
    const [width, setStyle] = useState({});


    const open = useCallback((content, title, width = 'medium', actions = []) => {
        setTitle(title);
        setIsOpened(true);
        setContent(content);
        setActions(actions);
        setStyle(width);
    }, [title, content]);

    const close = useCallback(() => {
        setIsOpened(false);
        setActions([]);
        setContent(null);
        setTitle('');
        setStyle('');
    }, []);

    const context = {
        close,
        open
    };

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
