import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';

const AssetManagementViewImport = import(
    /* webpackChunkName: "AssetManagementView" */ './asset-management/AssetManagementView'
);
const AssetManagementView = React.lazy(() => AssetManagementViewImport);

const BASE_PATH = 'manual-tasks';

const routes = [
    {
        path: `${BASE_PATH}/choose-artwork`,
        element: canRender(AssetManagementView, 'read', 'AssetManagement'),
    },
];

export default routes;
