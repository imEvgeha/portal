import React from 'react';
import NexusLayout from '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/NexusLayout';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';
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
    },
    {
        path: 'settings/v2',
        element: canRender(SettingsPage, 'read', 'Avail'),
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
            {path: 'avails', element: Outlet, children: [...availsRoutes]},
            {path: 'metadata', element: Outlet, children: [...titleMetadataRoutes]},
            {path: 'dop-tasks', element: Outlet, children: [...dopTasksRoutes]},
            {path: 'servicing-orders', element: Outlet, children: [...servicingOrdersRoutes]},
            {path: 'event-management', element: Outlet, children: [...eventManagementRoutes]},
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
