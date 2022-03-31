import React from 'react';
import {compose} from 'redux';
import availsRoutes from './pages/avails/availsRoutes';
import dopTasksRoutes from './pages/dop-tasks/dopTasksRoutes';
import eventManagementRoutes from './pages/event-management/eventManagementRoutes';
import manualTasksRoutes from './pages/manual-tasks/manualTasksRoutes';
import servicingOrdersRoutes from './pages/servicing-orders/servicingOrdersRoutes';
import staticPagesRoutes from './pages/static/staticPagesRoutes';
import titleMetadataRoutes from './pages/title-metadata/titleMetadataRoutes';
import withTracker from './util/hoc/withTracker';

const ContractProfile = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "ContactProfile" */ './pages/legacy/containers/contracts/profile/ContractProfile'
    )
);
const Contract = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "Contract" */ './pages/legacy/containers/contracts/search/Contract'
    )
);
const Settings = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "Settings" */ './pages/legacy/containers/settings/Settings')
);

const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage'));

const Unauthorized = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "ContactProfile" */ '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/Unauthorized'
    )
);

// TODO: on relevant page refactoring remove in to corresponding page folder
const restRoutes = [
    {
        path: '/contractprofile',
        component: ContractProfile,
    },
    {
        path: '/contractsearch',
        component: Contract,
    },
    {
        path: '/settings',
        component: Settings,
    },
    {
        path: '/settings/v2',
        component: SettingsPage,
    },
    {
        path: '/401',
        component: Unauthorized,
    },
];

export const routes = [
    ...availsRoutes,
    ...titleMetadataRoutes,
    ...servicingOrdersRoutes,
    ...eventManagementRoutes,
    ...dopTasksRoutes,
    ...manualTasksRoutes,
    ...restRoutes,
    ...staticPagesRoutes,
];

export function routesWithTracking() {
    return routes.map(route => {
        route.component = compose(withTracker())(route.component);
        return route;
    });
}
