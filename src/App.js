import React from 'react';
import routes from './routes';
import {PersistGate} from 'redux-persist/integration/react';
import {ConnectedRouter} from 'connected-react-router';
import NexusLayout from './ui/elements/nexus-layout/NexusLayout';
import CustomIntlProvider from './ui/elements/nexus-layout/CustomIntlProvider';
import {NexusModalProvider} from './ui/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui/elements/nexus-overlay/NexusOverlay';
import Toast from './ui/toast/Toast';
import AuthProvider from './auth/AuthProvider';

const App = ({history, persistor, store}) => (
    <CustomIntlProvider>
        <NexusOverlayProvider>
            <NexusModalProvider>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider>
                        <ConnectedRouter history={history}>
                            <>
                                <Toast />
                                <NexusLayout>
                                    {routes}
                                </NexusLayout>
                            </>
                        </ConnectedRouter>
                    </AuthProvider>
                </PersistGate>
            </NexusModalProvider>
        </NexusOverlayProvider>
    </CustomIntlProvider>
);

export default App;
