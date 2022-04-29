import React from 'react';

const AssetManagementViewImport = import(
    /* webpackChunkName: "AssetManagementView" */ './asset-management/AssetManagementView'
);
const AssetManagementView = React.lazy(() => AssetManagementViewImport);

const BASE_PATH = 'manual-tasks';

const routes = [
    {
        path: `${BASE_PATH}/choose-artwork`,
        element: AssetManagementView,
        resource: 'assetManagementViewPage',
    },
];

export default routes;
