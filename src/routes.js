import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';
import {get} from 'lodash';
import {start} from 'single-spa';
import availsRoutes from './pages/avails/availsRoutes';
import dopTasksRoutes from './pages/dop-tasks/dopTasksRoutes';
import eventManagementRoutes from './pages/event-management/eventManagementRoutes';
import metadataRoutes from './pages/metadata/metadataRoutes';
import servicingOrdersRoutes from './pages/servicing-orders/servicingOrdersRoutes';
import staticPagesRoutes from './pages/static/staticPagesRoutes';
import syncLogRoutes from './pages/sync-log/syncLogRoutes';
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
const Media = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "Media" */ './pages/legacy/containers/media/search/Media.js')
);
const Settings = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "Settings" */ './pages/legacy/containers/settings/Settings')
);
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
        path: '/media',
        component: canRender(Media, 'read', 'AssetManagement'),
    },
    {
        path: '/settings',
        component: Settings,
    },
    {
        path: '/401',
        component: Unauthorized,
    },
];

export const routes = [
    ...availsRoutes,
    ...metadataRoutes,
    ...titleMetadataRoutes,
    ...servicingOrdersRoutes,
    ...eventManagementRoutes,
    ...syncLogRoutes,
    ...dopTasksRoutes,
    ...restRoutes,
    ...staticPagesRoutes,
];

export function routesWithTracking(importMap) {
    const imports = get(importMap, 'imports', {});
    const singleSpaRoutes = [];
    Object.keys(imports).map(name => {
        if (name.includes('portal-mf')) {
            singleSpaRoutes.push({
                path: name.split('portal-mf')[1],
                component: () => {
                    start();
                    return <div key={name} id={`single-spa-application:${name}`} />;
                },
            });
        }
        return {};
    });
    return singleSpaRoutes.concat(
        routes.map(route => {
            route.component = withTracker(route.component);
            return route;
        })
    );
}
