import React from 'react';
import PropTypes from 'prop-types';
import NexusDateTimeProvider from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-time-context/NexusDateTimeProvider';
import {NexusModalProvider} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {PersistGate} from 'redux-persist/integration/react';
import AuthProvider from './auth/AuthProvider';
import CustomIntlProvider from './ui/elements/nexus-layout/CustomIntlProvider';
import {NexusOverlayProvider} from './ui/elements/nexus-overlay/NexusOverlay';

const AppProviders = ({children, persistor}) => (
    <CustomIntlProvider>
        <NexusDateTimeProvider>
            <NexusOverlayProvider>
                <NexusModalProvider>
                    <PersistGate loading={null} persistor={persistor}>
                        <AuthProvider>{children}</AuthProvider>
                    </PersistGate>
                </NexusModalProvider>
            </NexusOverlayProvider>
        </NexusDateTimeProvider>
    </CustomIntlProvider>
);

AppProviders.propTypes = {
    persistor: PropTypes.object.isRequired,
};

export default AppProviders;
