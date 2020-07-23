import React from 'react';
import PropTypes from 'prop-types';
import {PersistGate} from 'redux-persist/integration/react';
import AuthProvider from './auth/AuthProvider';
import CustomIntlProvider from './ui/elements/nexus-layout/CustomIntlProvider';
import {NexusModalProvider} from './ui/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui/elements/nexus-overlay/NexusOverlay';

const AppProviders = ({children, persistor}) => (
    <CustomIntlProvider>
        <NexusOverlayProvider>
            <NexusModalProvider>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </PersistGate>
            </NexusModalProvider>
        </NexusOverlayProvider>
    </CustomIntlProvider>
);

AppProviders.propsTypes = {
    persistor: PropTypes.object.isRequired,
};

export default AppProviders;


