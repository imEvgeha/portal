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
        roles: {
            operation: 'OR',
            values: ['asset_management_viewer', 'asset_management_user', 'asset_management_admin'],
        },
    },
];

export default routes;
