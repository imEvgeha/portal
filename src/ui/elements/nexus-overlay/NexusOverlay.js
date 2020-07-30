import React, {useState, createContext} from 'react';
import Blanket from '@atlaskit/blanket';

export const NexusOverlayContext = createContext({});

// eslint-disable-next-line
export const NexusOverlayProvider = ({children}) => {
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const context = {
        isOverlayActive,
        setIsOverlayActive,
    };

    return (
        <NexusOverlayContext.Provider value={context}>
            {children}
            {isOverlayActive && <Blanket isTinted={true} />}
        </NexusOverlayContext.Provider>
    );
};
