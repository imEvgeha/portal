import React from 'react';
import {canRender} from './ability';
import availsRoutes from './pages/avails/availsRoutes';
import metadataRoutes from './pages/metadata/metadataRoutes';
import staticPagesRoutes from './pages/static/staticPagesRoutes';
import servicingOrdersRoutes from './pages/servicing-orders/servicingOrdersRoutes';
const ContractProfile = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "ContactProfile" */ './pages/legacy/containers/contracts/profile/ContractProfile'));
const Contract = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Contract" */ './pages/legacy/containers/contracts/search/Contract'));
const Media = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Media" */ './pages/legacy/containers/media/search/Media.js'));
const Settings = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Settings" */ './pages/legacy/containers/settings/Settings'));
import WithTracker from './util/hoc/withTracker';

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

const routes = [
    ...availsRoutes,
    ...metadataRoutes,
    ...servicingOrdersRoutes,
    ...restRoutes,
    ...staticPagesRoutes,
];

export function routesWithTracking() {
    return routes.map(route => {
        route.component = WithTracker(route.component);

        return route;
    });
}

export default routes;
