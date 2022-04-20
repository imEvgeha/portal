import React from 'react';
import PropTypes from 'prop-types';
import NexusDateTimeProvider from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-time-context/NexusDateTimeProvider';
import CustomIntlProvider from '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/CustomIntlProvider';
import {NexusModalProvider} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-overlay/NexusOverlay';
import theme from '@vubiquity-nexus/portal-ui/lib/styled/theme';
import {HistoryRouter as ConnectedRouter} from 'redux-first-history/rr6';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider} from 'styled-components';
import AuthProvider from './auth/AuthProvider';
import {history} from './index';

const AppProviders = ({children, persistor}) => (
    <CustomIntlProvider>
        <NexusDateTimeProvider>
            <NexusOverlayProvider>
                <ConnectedRouter history={history}>
                    <NexusModalProvider>
                        <PersistGate loading={null} persistor={persistor}>
                            <ThemeProvider theme={theme}>
                                <AuthProvider>{children}</AuthProvider>
                            </ThemeProvider>
                        </PersistGate>
                    </NexusModalProvider>
                </ConnectedRouter>
            </NexusOverlayProvider>
        </NexusDateTimeProvider>
    </CustomIntlProvider>
);

AppProviders.propTypes = {
    persistor: PropTypes.object.isRequired,
};

export default AppProviders;
