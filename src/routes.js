import React from 'react';
import NexusLayout from '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/NexusLayout';
import {Outlet} from 'react-router-dom';
import availsRoutes from './pages/avails/availsRoutes';
import dopTasksRoutes from './pages/dop-tasks/dopTasksRoutes';
import eventManagementRoutes from './pages/event-management/eventManagementRoutes';
import manualTasksRoutes from './pages/manual-tasks/manualTasksRoutes';
import servicingOrdersRoutes from './pages/servicing-orders/servicingOrdersRoutes';
import NotFound from './pages/static/NotFound';
import Welcome from './pages/static/Welcome';
import titleMetadataRoutes from './pages/title-metadata/titleMetadataRoutes';
import withTracker from './util/hoc/withTracker';

const Settings = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "Settings" */ './pages/legacy/containers/settings/Settings')
);

const SettingsPage = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "SettingsV2" */ './pages/settings/SettingsPage')
);

const Unauthorized = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "ContactProfile" */ '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/Unauthorized'
    )
);

const staticRoutes = [
    {
        path: 'settings',
        element: Settings,
        roles: {
            operation: 'OR',
            values: ['configuration_viewer', 'configuration_user', 'configuration_admin'],
        },
    },
    {
        path: 'settings/v2',
        element: SettingsPage,
        roles: {
            operation: 'OR',
            values: ['configuration_viewer', 'configuration_user', 'configuration_admin'],
        },
    },
    {
        path: '401',
        element: Unauthorized,
    },
    {
        path: '*',
        element: NotFound,
    },
];

export const routes = [
    {
        path: ':realm',
        element: NexusLayout,
        children: [
            {index: true, key: 'welcome', element: Welcome},
            {
                path: 'avails',
                roles: {
                    operation: 'OR',
                    values: ['avails_viewer', 'avails_user', 'avails_admin'],
                },
                element: Outlet,
                children: [...availsRoutes],
            },
            {
                path: 'metadata',
                roles: {
                    operation: 'OR',
                    values: ['metadata_admin', 'metadata_user', 'metadata_viewer'],
                },
                element: Outlet,
                children: [...titleMetadataRoutes],
            },
            {
                path: 'dop-tasks',
                roles: {
                    operation: 'AND',
                    values: ['dop_viewer'],
                },
                element: Outlet,
                children: [...dopTasksRoutes],
            },
            {path: 'servicing-orders', element: Outlet, children: [...servicingOrdersRoutes]},
            {
                path: 'event-management',
                roles: {
                    operation: 'OR',
                    values: ['event_viewer', 'event_admin'],
                },
                element: Outlet,
                children: [...eventManagementRoutes],
            },
            ...manualTasksRoutes,
            ...staticRoutes,
        ],
    },
];

export function routesWithTracking() {
    return routes.map(route => {
        route.element = withTracker(route.element);
        return route;
    });
}
