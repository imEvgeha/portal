import React from 'react';
import PropTypes from 'prop-types';
import {PermissionProvider} from '@portal/portal-auth/permissions';
import NexusDateTimeProvider from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-time-context/NexusDateTimeProvider';
import CustomIntlProvider from '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/CustomIntlProvider';
import {NexusModalProvider} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-overlay/NexusOverlay';
import theme from '@vubiquity-nexus/portal-ui/lib/styled/theme';
import {getAuthConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {get} from 'lodash';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider} from 'styled-components';
import AppLoadProvider from './appLoad/AppLoadProvider';
import AuthProvider from './auth/AuthProvider';
import {registerFetchInterceptor} from './util/http/httpInterceptor';

const AppProviders = ({children, persistor}) => {
    const rolesResourceMap = require('../profile/resourceRoleMap.json');

    const selectedTenant = useSelector(state => state?.auth?.selectedTenant || {});
    const roles = get(selectedTenant, 'roles', []);
    const navigate = useNavigate();

    // register interceptor
    registerFetchInterceptor(selectedTenant);

    return (
        <AuthProvider>
            <PermissionProvider
                roles={roles}
                resourceRolesMap={rolesResourceMap}
                unauthorizedAction={() => navigate(`/${getAuthConfig().realm}/401`)}
            >
                <CustomIntlProvider>
                    <NexusDateTimeProvider>
                        <NexusOverlayProvider>
                            <NexusModalProvider>
                                <PersistGate loading={null} persistor={persistor}>
                                    <ThemeProvider theme={theme}>
                                        <AppLoadProvider>{children}</AppLoadProvider>
                                    </ThemeProvider>
                                </PersistGate>
                            </NexusModalProvider>
                        </NexusOverlayProvider>
                    </NexusDateTimeProvider>
                </CustomIntlProvider>
            </PermissionProvider>
        </AuthProvider>
    );
};

AppProviders.propTypes = {
    persistor: PropTypes.object.isRequired,
};

export default AppProviders;
