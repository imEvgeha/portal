import React from 'react';
import {canRender} from './ability';
import availsRoutes from './pages/avails/availsRoutes';
import metadataRoutes from './pages/metadata/metadataRoutes';
import staticPagesRoutes from './pages/static/staticPagesRoutes';
import servicingOrdersRoutes from './pages/servicing-orders/servicingOrdersRoutes';
import withTracker from './util/hoc/withTracker';
import eventManagementRoutes from './pages/event-management/eventManagementRoutes';

const ContractProfile = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "ContactProfile" */ './pages/legacy/containers/contracts/profile/ContractProfile'));
const Contract = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Contract" */ './pages/legacy/containers/contracts/search/Contract'));
const Media = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Media" */ './pages/legacy/containers/media/search/Media.js'));
const Settings = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Settings" */ './pages/legacy/containers/settings/Settings'));

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
        path: '/media',
        component: canRender(Media, 'read', 'AssetManagement'),
    },
    {
        path: '/settings',
        component: Settings
    }
];

export const routes = [
    ...availsRoutes,
    ...metadataRoutes,
    ...servicingOrdersRoutes,
    ...eventManagementRoutes,
    ...restRoutes,
    ...staticPagesRoutes,
];

export function routesWithTracking() {
    return routes.map(route => {
        route.component = withTracker(route.component);

        return route;
    });
}